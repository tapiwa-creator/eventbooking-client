/**
 * EventDataService.js
 * Client-facing Firestore subscriptions with static seed fallbacks.
 */

import { db } from "../firebase";
import { collection, onSnapshot, query, where, orderBy, Timestamp } from "firebase/firestore";
import { allEvents, eventsByCategory } from "../data/eventData";

const col = () => collection(db, "events");

const TAG_COLOURS = {
    CONCERT: "#db2777", CONFERENCE: "#2563eb", FOOD: "#ea580c",
    OUTDOORS: "#16a34a", SPORTS: "#0891b2", ARTS: "#7c3aed", NIGHTLIFE: "#be185d",
};

const TAG_BG = {
    CONCERT: "#1a0a1e", CONFERENCE: "#0a0f1e", FOOD: "#1a0a00",
    OUTDOORS: "#071a0a", SPORTS: "#071420", ARTS: "#0f071a", NIGHTLIFE: "#1a0714",
};

const SYM = { ZAR: "R", USD: "$", GBP: "£", ZiG: "ZiG" };

function toISO(v) {
    return v instanceof Timestamp ? v.toDate().toISOString() : (v ?? null);
}

function formatDate(dateStr, timeStr) {
    if (!dateStr) return "Date TBD";
    try {
        const [y, m, d] = dateStr.split("-").map(Number);
        const label = new Date(y, m - 1, d).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
        });
        return timeStr ? `${label} · ${timeStr}` : label;
    } catch {
        return dateStr;
    }
}

function extractPrice(pricing, tiers, fallbackUnit = "ticket") {
    if (!pricing) return null;
    const sym = SYM[pricing.currency] ?? "$";
    const unit = pricing.unit ?? fallbackUnit;
    if (pricing.mode === "flat") {
        const num = parseFloat(String(pricing.price ?? "0").replace(/[^0-9.]/g, "")) || 0;
        return { price: num > 0 ? `${sym}${num}` : "Free", priceNum: num, unit };
    }
    const items =
        pricing.mode === "packages" ? (tiers ?? pricing.packages ?? []) :
            pricing.mode === "classified" ? (tiers ?? pricing.tiers ?? []) : [];
    const prices = items.map(i => parseFloat(String(i.price ?? "0").replace(/[^0-9.]/g, ""))).filter(n => n > 0);
    const min = prices.length ? Math.min(...prices) : 0;
    // No "From" prefix — just show the minimum price
    return { price: min > 0 ? `${sym}${min}` : "Free", priceNum: min, unit };
}

function transform(snapshot) {
    if (!snapshot.exists()) return null;
    const d = snapshot.data();
    const tag = (d.category ?? d.tag ?? "ARTS").toUpperCase();

    let price, priceNum, unit;
    const fromPricing = extractPrice(d.pricing, d.tiers, d.unit ?? "ticket");
    if (fromPricing) {
        ({ price, priceNum, unit } = fromPricing);
    } else {
        // Legacy flat fields — resolve currency symbol from pricing.currency if available
        const sym = SYM[d.pricing?.currency] ?? SYM[d.currency] ?? "$";
        const num = typeof d.priceNum === "number" ? d.priceNum
            : parseFloat(String(d.price ?? "0").replace(/[^0-9.]/g, "")) || 0;
        price = num > 0 ? `${sym}${num}` : "Free";
        priceNum = num;
        unit = d.unit ?? "ticket";
    }

    const isBlobUrl = typeof d.imageUrl === "string" && d.imageUrl.startsWith("blob:");
    const image = (d.imageUrl && !isBlobUrl) ? d.imageUrl
        : (d.image && !d.image.startsWith("blob:")) ? d.image
            : null;

    return {
        id: snapshot.id,
        source: "firestore",
        tag,
        tagColor: TAG_COLOURS[tag] ?? "#6c47ff",
        bg: TAG_BG[tag] ?? "#0a0a14",
        title: d.title ?? "Untitled Event",
        description: d.description ?? "",
        location: d.location ?? "Location TBD",
        date: formatDate(d.date, d.time),
        rawDate: d.date,
        deadline: d.deadline ?? null,
        image,
        price,
        priceNum,
        unit,
        pricing: d.pricing ?? null,
        tiers: (Array.isArray(d.tiers) && d.tiers.length > 0 ? d.tiers : null) ?? 
               (Array.isArray(d.pricing?.packages) && d.pricing?.packages.length > 0 ? d.pricing.packages : null) ?? 
               d.pricing?.tiers ?? [],
        status: d.status ?? "Upcoming",
        totalCapacity: d.totalCapacity ? Number(d.totalCapacity) : null,
        bookedCount: Number(d.bookedCount ?? 0),
        createdAt: toISO(d.createdAt),
        updatedAt: toISO(d.updatedAt),
        isFeatured: d.isFeatured ?? false,
    };
}

function logErr(fn, err) {
    console.error(`❌ EventDataService.${fn}:`, err?.code ?? "", err?.message ?? err);
}

function isPastEvent(dateStr, rawDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (rawDateStr) {
        try {
            const eventDate = new Date(rawDateStr);
            if (!isNaN(eventDate.getTime())) return eventDate < today;
        } catch {}
    }
    
    if (dateStr) {
        try {
            let cleanStr = dateStr.split("–").pop().split("-").pop().trim();
            cleanStr = cleanStr.replace(/^[a-zA-Z]+,\s*/, "");
            const eventDate = new Date(cleanStr + ", " + today.getFullYear());
            if (!isNaN(eventDate.getTime())) return eventDate < today;
        } catch {}
    }
    return false;
}

export function subscribeToAllEvents(setter, onErr) {
    try {
        const q = query(col(), orderBy("createdAt", "desc"));
        return onSnapshot(
            q,
            { includeMetadataChanges: false },
            snap => {
                if (snap.empty) { setter(allEvents.filter(e => !isPastEvent(e.date, e.rawDate))); return; }
                setter(snap.docs.map(transform).filter(e => e && !isPastEvent(e.date, e.rawDate)));
            },
            err => {
                logErr("subscribeToAllEvents", err);
                setter(allEvents.filter(e => !isPastEvent(e.date, e.rawDate)));
                onErr?.(err.message);
            }
        );
    } catch (err) {
        logErr("subscribeToAllEvents", err);
        setter(allEvents.filter(e => !isPastEvent(e.date, e.rawDate)));
        onErr?.(err.message);
        return () => { };
    }
}

export function subscribeToCategory(tag, setter, onErr) {
    try {
        const q = query(col(), where("tag", "==", tag), orderBy("createdAt", "desc"));
        return onSnapshot(
            q,
            { includeMetadataChanges: false },
            snap => {
                if (snap.empty) { setter((eventsByCategory[tag] ?? []).filter(e => !isPastEvent(e.date, e.rawDate))); return; }
                setter(snap.docs.map(transform).filter(e => e && !isPastEvent(e.date, e.rawDate)));
            },
            err => {
                logErr("subscribeToCategory", err);
                setter((eventsByCategory[tag] ?? []).filter(e => !isPastEvent(e.date, e.rawDate)));
                onErr?.(err.message);
            }
        );
    } catch (err) {
        logErr("subscribeToCategory", err);
        setter((eventsByCategory[tag] ?? []).filter(e => !isPastEvent(e.date, e.rawDate)));
        onErr?.(err.message);
        return () => { };
    }
}

export function searchEvents(queryStr, events) {
    if (!queryStr || !queryStr.trim()) return events;
    const q = queryStr.toLowerCase();
    return events.filter(e => (
        (e.title?.toLowerCase().includes(q) ?? false) ||
        (e.location?.toLowerCase().includes(q) ?? false) ||
        (e.description?.toLowerCase().includes(q) ?? false)
    ));
}

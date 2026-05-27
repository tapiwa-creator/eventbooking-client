import { useState } from "react";
import axios from "axios";
import { createBooking } from "../Services/BookingServices";

/* =========================
   CONFIG
========================= */
const PAYMENT_METHODS = [
    { id: "ecocash", label: "EcoCash" },
    { id: "innbucks", label: "InnBucks" },
];

const SERVICE_FEE_RATE = 0.035;

/* =========================
   HELPERS
========================= */
function isValidZimPhone(val) {
    return /^07[178]\d{7}$/.test(val.replace(/\s/g, ""));
}

function safePrice(val) {
    if (typeof val === "number") return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
}

function QtyInput({ value, onChange }) {
    const [raw, setRaw] = useState(String(value));
    return (
        <div style={{
            display: "flex", alignItems: "center",
            border: "1.5px solid #e5e7eb", borderRadius: "12px",
            overflow: "hidden", background: "#fff", height: "44px",
        }}>
            <input
                type="number" min={1} max={20} value={raw}
                onChange={e => {
                    const str = e.target.value;
                    setRaw(str);
                    const v = parseInt(str, 10);
                    if (!isNaN(v) && v >= 1 && v <= 20) onChange(v);
                }}
                onBlur={() => {
                    const v = parseInt(raw, 10);
                    const safe = isNaN(v) ? 1 : Math.max(1, Math.min(20, v));
                    setRaw(String(safe)); onChange(safe);
                }}
                style={{
                    flex: 1, border: "none", outline: "none",
                    fontSize: "15px", fontWeight: 700, color: "#18103a",
                    textAlign: "center", background: "transparent",
                    fontFamily: "inherit", padding: "0 0 0 14px",
                    MozAppearance: "textfield",
                }}
            />
            <style>{`input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}`}</style>
            <div style={{ display: "flex", flexDirection: "column", borderLeft: "1.5px solid #e5e7eb", height: "44px" }}>
                <button
                    onClick={() => { const n = Math.min(20, value + 1); setRaw(String(n)); onChange(n); }}
                    style={{ flex: 1, width: "32px", background: "#fafafa", border: "none", borderBottom: "1px solid #e5e7eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#14532d", fontSize: "9px", padding: 0, transition: "background 0.15s" }}
                    onMouseOver={e => e.currentTarget.style.background = "#dcfce7"}
                    onMouseOut={e => e.currentTarget.style.background = "#fafafa"}
                >▲</button>
                <button
                    onClick={() => { const n = Math.max(1, value - 1); setRaw(String(n)); onChange(n); }}
                    style={{ flex: 1, width: "32px", background: "#fafafa", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#14532d", fontSize: "9px", padding: 0, transition: "background 0.15s" }}
                    onMouseOver={e => e.currentTarget.style.background = "#dcfce7"}
                    onMouseOut={e => e.currentTarget.style.background = "#fafafa"}
                >▼</button>
            </div>
        </div>
    );
}

function LocationIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function tierIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/>
        </svg>
    );
}

function EventHero({ event, heroImage, onClose }) {
    return (
        <div style={{ position: "relative", height: "170px", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
            {heroImage ? (
                <img src={heroImage} alt={event.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
                <div style={{ width: "100%", height: "100%", background: "#eeedf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0aad8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(8,4,24,0.72) 100%)" }} />
            <button onClick={onClose} style={{
                position: "absolute", top: "12px", right: "12px",
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
                fontSize: "16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 20px" }}>
                <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 5px", lineHeight: 1.3, fontFamily: "Georgia,serif" }}>
                    {event.title}
                </h2>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <LocationIcon /> {event.location}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CalendarIcon /> {event.date}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function BookingModal({ event, onClose, onBookingSuccess }) {

    // ── Does this event use tiered packages? ──────────────────────────────────
    const pricingMode = event.pricing?.mode ?? "flat";
    const hasTiers = (pricingMode === "packages" || pricingMode === "classified")
        && Array.isArray(event.tiers)
        && event.tiers.length > 0
        && event.tiers.some(t => t.label && t.label.trim() !== "");

    const validTiers = hasTiers ? event.tiers.filter(t => t.label && t.label.trim()) : [];
    const isSingleTier = validTiers.length === 1;
    const initialStep = (hasTiers && !isSingleTier) ? "tier" : "form";
    const initialTierId = isSingleTier ? validTiers[0].id : null;

    // Currency symbol
    const sym = (() => {
        if (event.sym) return event.sym;
        const MAP = { ZAR: "R", USD: "$", GBP: "£", ZiG: "ZiG " };
        return MAP[event.pricing?.currency] ?? "$";
    })();

    // Flat base price (only relevant for non-package events)
    const basePriceNum = (() => {
        if (event.pricing?.price != null) {
            const n = parseFloat(String(event.pricing.price).replace(/[^0-9.]/g, ""));
            if (!isNaN(n)) return n;
        }
        if (typeof event.priceNum === "number") return event.priceNum;
        if (typeof event.price === "string") {
            const n = parseFloat(event.price.replace(/[^0-9.]/g, ""));
            if (!isNaN(n)) return n;
        }
        return 0;
    })();

    // ── State ─────────────────────────────────────────────────────────────────
    const [step, setStep] = useState(initialStep);
    const [selectedTierId, setSelectedTierId] = useState(initialTierId);
    const [qty, setQty] = useState(1);
    const [payment, setPayment] = useState("ecocash");
    const [confirmed, setConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("");
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({});

    // ── Derived ───────────────────────────────────────────────────────────────
    const activeTier = hasTiers ? (event.tiers.find(t => t.id === selectedTierId) ?? null) : null;
    const unitPrice = activeTier ? safePrice(activeTier.price) : basePriceNum;
    const unitLabel = activeTier ? activeTier.label : (event.unit || "ticket");
    const subtotal = unitPrice * qty;
    const fee = parseFloat((subtotal * SERVICE_FEE_RATE).toFixed(2));
    const total = (subtotal + fee).toFixed(2);
    const heroImage = (() => {
        const url = event.imageUrl || event.image || null;
        if (!url || url.startsWith("blob:")) return null;
        return url;
    })();

    const handleBackdrop = e => { if (e.target === e.currentTarget) onClose(); };

    // =========================================================================
    // PAYNOW LOGIC
    // =========================================================================
    const makePayment = async () => {
        try {
            setPaymentStatus("Initiating payment...");

            const res = await axios.post(
                "http://localhost:5000/api/paynow/pay",
                {
                    email,
                    phone,
                    amount: parseFloat(total),
                    eventName: event.title
                }
            );

            if (res.data.success) {
                setPaymentStatus("A prompt has been sent to your phone. Please enter your PIN to confirm the payment.");

                checkPaymentStatus(res.data.pollUrl);
            } else {
                setBookingError(res.data.error || "Payment failed");
                setIsSubmitting(false);
                setPaymentStatus("");
            }

        } catch (err) {
            // removed // console.log
            const serverError = err.response?.data?.error;
            setBookingError(serverError || "Payment request failed. Please check your connection or server status.");
            setIsSubmitting(false);
            setPaymentStatus("");
        }
    };

    const checkPaymentStatus = (pollUrl) => {
        let attempts = 0;
        const maxAttempts = 4; // 20 seconds total (4 attempts * 5000ms)

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await axios.post(
                    "http://localhost:5000/api/paynow/status",
                    { pollUrl }
                );

                const status = res.data.status?.toLowerCase();

                if (status === "paid" || status === "awaiting delivery") {
                    clearInterval(interval);
                    saveBooking();
                    return;
                }

                if (status === "cancelled" || status === "failed") {
                    clearInterval(interval);
                    setBookingError("Payment failed or cancelled");
                    setIsSubmitting(false);
                    setPaymentStatus("");
                    return;
                }

                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setBookingError("Payment timed out after 20 seconds. If you were charged, please contact support.");
                    setIsSubmitting(false);
                    setPaymentStatus("");
                }

            } catch (err) {
                // removed // console.log
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setBookingError("Payment timed out due to network issues.");
                    setIsSubmitting(false);
                    setPaymentStatus("");
                }
            }
        }, 5000);
    };

    const saveBooking = async () => {
        try {
            const bookingData = {
                eventId: event.id,
                eventTitle: event.title,
                attendeeName: name.trim(),
                attendeeEmail: email.trim(),
                attendeePhone: phone.trim(),
                quantity: qty,
                ticketType: activeTier ? activeTier.label : "General",
                ticketTypeId: activeTier ? activeTier.id : "general",
                unitPrice,
                subtotal,
                serviceFee: fee,
                serviceFeeRate: SERVICE_FEE_RATE,
                totalAmount: parseFloat(total),
                currency: sym,
                paymentMethod: payment,
                paymentStatus: "paid",
                status: "confirmed",
                bookingDate: new Date().toISOString(),
            };
            
            await createBooking(bookingData);
            
            setPaymentStatus("");
            setIsSubmitting(false);
            setConfirmed(true);
            
            if (onBookingSuccess) onBookingSuccess(bookingData);
        } catch (err) {
            console.error("Booking save failed:", err);
            setBookingError("Failed to save booking. Please contact support.");
            setIsSubmitting(false);
            setPaymentStatus("");
        }
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        const errs = {};
        if (!name.trim()) errs.name = "Full name is required";
        if (!email.trim()) errs.email = "Email address is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address";
        if (!phone.trim()) errs.phone = "Phone number is required";
        else if (!isValidZimPhone(phone)) errs.phone = "Enter a valid Zim number";
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsSubmitting(true);
        setBookingError(null);
        
        if (total > 0) {
            await makePayment();
        } else {
            // Free event logic
            saveBooking();
        }
    };

    // =========================================================================
    // SUCCESS SCREEN
    // =========================================================================
    if (confirmed) {
        return (
            <div onClick={handleBackdrop} style={backdropStyle}>
                <div style={{
                    background: "#fff", borderRadius: "24px", padding: "48px 36px",
                    maxWidth: "420px", width: "100%", textAlign: "center",
                    boxShadow: "0 24px 64px rgba(80,20,160,0.18)",
                    border: "1px solid rgba(124,58,237,0.1)",
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px",
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h3 style={{ color: "#18103a", fontSize: "22px", fontWeight: 800, margin: "0 0 8px", fontFamily: "Georgia,serif" }}>
                        Registration Confirmed!
                    </h3>
                    <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 4px" }}>
                        Registered for <span style={{ color: "#18103a", fontWeight: 600 }}>{name.trim()}</span>
                    </p>
                    <p style={{ color: "#6b7280", fontSize: "13.5px", lineHeight: 1.6, margin: "0 0 4px" }}>
                        {qty} {unitLabel}{qty > 1 ? "s" : ""}{activeTier ? ` · ${activeTier.label}` : ""} for
                    </p>
                    <p style={{ color: "#14532d", fontSize: "15px", fontWeight: 700, margin: "0 0 20px" }}>
                        {event.title}
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 28px" }}>
                        Total paid:{" "}
                        <span style={{ color: "#14532d", fontWeight: 700 }}>{sym}{total}</span>{" "}
                        {total > 0 ? `via ${PAYMENT_METHODS.find(m => m.id === payment)?.label}` : ""}
                    </p>
                    <button onClick={onClose} style={{
                        width: "100%", padding: "13px", background: "#14532d",
                        color: "#fff", border: "none", borderRadius: "999px",
                        fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    }}>Done</button>
                </div>
            </div>
        );
    }

    // =========================================================================
    // STEP 1 — TIER PICKER
    // =========================================================================
    if (step === "tier") {
        return (
            <div onClick={handleBackdrop} style={backdropStyle}>
                <div style={{
                    background: "#fff", borderRadius: "24px",
                    width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto",
                    boxShadow: "0 24px 64px rgba(80,20,160,0.18)",
                    border: "1px solid rgba(124,58,237,0.1)",
                }}>
                    <EventHero event={event} heroImage={heroImage} onClose={onClose} />

                    <div style={{ padding: "24px 22px 28px" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 800, color: "#18103a", fontFamily: "Georgia,serif" }}>
                            Choose Your Admission Option
                        </p>
                        <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#9ca3af" }}>
                            Select an option to see pricing and continue registration
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                            {event.tiers.filter(t => t.label && t.label.trim()).map((tier, idx) => {
                                const active = selectedTierId === tier.id;
                                const displayPrice = safePrice(tier.price);
                                return (
                                    <button
                                        key={tier.id}
                                        onClick={() => setSelectedTierId(tier.id)}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "14px 16px", borderRadius: "14px", cursor: "pointer",
                                            background: active ? "#f0fdf4" : "#fafafa",
                                            border: `2px solid ${active ? "#14532d" : "#e5e7eb"}`,
                                            fontFamily: "inherit", transition: "all 0.15s",
                                            textAlign: "left", width: "100%", boxSizing: "border-box",
                                        }}
                                        onMouseOver={e => { if (!active) e.currentTarget.style.borderColor = "#86efac"; }}
                                        onMouseOut={e => { if (!active) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{
                                                width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
                                                background: active ? "#14532d" : "#f0fdf4",
                                                border: `1.5px solid ${active ? "#14532d" : "#bbf7d0"}`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: "18px", transition: "all 0.15s",
                                            }}>
                                                {tierIcon(tier.id, idx)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "14px", fontWeight: 700, color: active ? "#14532d" : "#18103a" }}>
                                                    {tier.label}
                                                </div>
                                                {tier.perks && (
                                                    <div style={{ fontSize: "12px", color: active ? "#16a34a" : "#9ca3af", marginTop: "2px" }}>
                                                        {tier.perks}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ fontSize: "17px", fontWeight: 800, color: active ? "#14532d" : "#18103a" }}>
                                                    {displayPrice === 0 ? "Free" : `${sym}${displayPrice}`}
                                                </div>
                                                <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                                                    per {tier.unit || "ticket"}
                                                </div>
                                            </div>
                                            <div style={{
                                                width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                                                border: `2px solid ${active ? "#14532d" : "#d1d5db"}`,
                                                background: active ? "#14532d" : "transparent",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                transition: "all 0.15s",
                                            }}>
                                                {active && (
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <polyline points="2,5 4,7.5 8,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => { if (selectedTierId) setStep("form"); }}
                            disabled={!selectedTierId}
                            style={{
                                width: "100%", padding: "14px", border: "none", borderRadius: "999px",
                                background: selectedTierId ? "#14532d" : "#e5e7eb",
                                color: selectedTierId ? "#fff" : "#9ca3af",
                                fontSize: "14px", fontWeight: 700,
                                cursor: selectedTierId ? "pointer" : "not-allowed",
                                fontFamily: "inherit", transition: "background 0.2s",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                            }}
                            onMouseOver={e => { if (selectedTierId) e.currentTarget.style.background = "#0f3d20"; }}
                            onMouseOut={e => { if (selectedTierId) e.currentTarget.style.background = "#14532d"; }}
                        >
                            {selectedTierId
                                ? `Continue with ${event.tiers.find(t => t.id === selectedTierId)?.label}`
                                : "Select an option to continue"
                            }
                            {selectedTierId && (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // STEP 2 — BOOKING FORM
    // =========================================================================
    return (
        <div onClick={handleBackdrop} style={backdropStyle}>
            <div style={{
                background: "#fff", borderRadius: "24px",
                width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto",
                boxShadow: "0 24px 64px rgba(80,20,160,0.18)",
                border: "1px solid rgba(124,58,237,0.1)",
            }}>
                <EventHero event={event} heroImage={heroImage} onClose={onClose} />

                <div style={{ padding: "20px 22px 26px" }}>

                    {bookingError && (
                        <div style={{
                            background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "12px",
                            padding: "12px", marginBottom: "16px", color: "#dc2626", fontSize: "13px", textAlign: "center",
                        }}>{bookingError}</div>
                    )}
                    
                    {paymentStatus && (
                        <div style={{
                            background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px",
                            padding: "12px", marginBottom: "16px", color: "#1d4ed8", fontSize: "13px", textAlign: "center",
                            fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                        }}>
                            <div style={{
                                width: "14px", height: "14px",
                                border: "2px solid rgba(29,78,216,0.3)", borderTopColor: "#1d4ed8",
                                borderRadius: "50%", animation: "spin 0.7s linear infinite",
                            }} />
                            {paymentStatus}
                        </div>
                    )}

                    <div style={{
                        background: "#f8f8fa", border: "1.5px solid #f0f0f2",
                        borderRadius: "12px", padding: "13px 15px", marginBottom: "20px",
                    }}>
                        <p style={{ color: "#555", fontSize: "13px", lineHeight: 1.65, margin: 0 }}>
                            {event.description}
                        </p>
                    </div>

                    {hasTiers && activeTier && (
                        <div style={{ marginBottom: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                <p style={labelStyle}>Registration type</p>
                                {!isSingleTier && (
                                    <button
                                        onClick={() => setStep("tier")}
                                        style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            fontSize: "12px", fontWeight: 700, color: "#7c3aed",
                                            fontFamily: "inherit", padding: 0,
                                        }}
                                    >← Change</button>
                                )}
                            </div>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "12px 16px", borderRadius: "12px",
                                background: "#f0fdf4", border: "1.5px solid #14532d",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "32px", height: "32px", borderRadius: "50%", background: "#14532d",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                                    }}>
                                        {tierIcon(activeTier.id, event.tiers.findIndex(t => t.id === activeTier.id))}
                                    </div>
                                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#14532d" }}>
                                        {activeTier.label}
                                    </span>
                                </div>
                                <span style={{ fontSize: "16px", fontWeight: 800, color: "#14532d" }}>
                                    {unitPrice === 0 ? "Free" : `${sym}${unitPrice}`}
                                </span>
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: "20px" }}>
                        <p style={labelStyle}>Attendee details</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div>
                                <input type="text" placeholder="Full name *" value={name}
                                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: null })); }}
                                    style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "#e5e7eb" }} />
                                {errors.name && <p style={errorStyle}>{errors.name}</p>}
                            </div>
                            <div>
                                <input type="email" placeholder="Email address *" value={email}
                                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
                                    style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : "#e5e7eb" }} />
                                {errors.email && <p style={errorStyle}>{errors.email}</p>}
                            </div>
                            <div>
                                <input type="tel" placeholder="Phone number *" value={phone} maxLength={10}
                                    onChange={e => {
                                        setPhone(e.target.value.replace(/\D/g, ""));
                                        setErrors(p => ({ ...p, phone: null }));
                                    }}
                                    style={{ ...inputStyle, borderColor: errors.phone ? "#ef4444" : "#e5e7eb" }} />
                                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                        <div>
                            <p style={labelStyle}>Registration Pass</p>
                            <QtyInput value={qty} onChange={setQty} />
                        </div>
                        <div>
                            <p style={labelStyle}>Subtotal</p>
                            <div style={{
                                height: "44px", border: "1.5px solid #86efac", borderRadius: "12px",
                                background: "#dcfce7", display: "flex", flexDirection: "column",
                                justifyContent: "center", padding: "0 14px",
                            }}>
                                <span style={{ color: "#14532d", fontWeight: 800, fontSize: "16px", lineHeight: 1 }}>
                                    {sym}{subtotal}
                                </span>
                                <span style={{ color: "#4ade80", fontSize: "11px", marginTop: "2px" }}>
                                    {sym}{unitPrice} / member
                                </span>
                            </div>
                        </div>
                    </div>

                    {total > 0 && (
                        <div style={{ marginBottom: "18px" }}>
                            <p style={labelStyle}>Payment method</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                {PAYMENT_METHODS.map(m => {
                                    const active = payment === m.id;
                                    return (
                                        <button key={m.id} onClick={() => setPayment(m.id)} style={{
                                            display: "flex", alignItems: "center", gap: "10px",
                                            padding: "11px 14px", borderRadius: "12px", cursor: "pointer",
                                            background: active ? "#dcfce7" : "#fafafa",
                                            border: `1.5px solid ${active ? "#14532d" : "#e5e7eb"}`,
                                            fontFamily: "inherit", transition: "all 0.15s",
                                        }}>
                                            <img src={m.id === "ecocash" ? "/eco.png" : "/inn.png"} alt={m.label}
                                                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                                            <span style={{ fontSize: "13px", fontWeight: 600, color: active ? "#14532d" : "#6b7280" }}>
                                                {m.label}
                                            </span>
                                            {active && (
                                                <span style={{
                                                    marginLeft: "auto", width: "18px", height: "18px",
                                                    borderRadius: "50%", background: "#14532d",
                                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                                }}>
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <polyline points="2,5 4,7.5 8,3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div style={{
                        background: "#f8f8fa", border: "1.5px solid #f0f0f2",
                        borderRadius: "12px", padding: "14px 16px", marginBottom: "18px",
                    }}>
                        {[
                            { label: "Unit price", value: `${sym}${unitPrice}` },
                            { label: "Tickets", value: `× ${qty}` },
                            { label: "Fee", value: `${sym}${fee.toFixed(2)}` },
                        ].map(row => (
                            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "#9ca3af", fontSize: "13px" }}>{row.label}</span>
                                <span style={{ color: "#374151", fontSize: "13px", fontWeight: 500 }}>{row.value}</span>
                            </div>
                        ))}
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            paddingTop: "10px", borderTop: "1.5px solid #e5e7eb",
                        }}>
                            <span style={{ color: "#18103a", fontWeight: 700, fontSize: "14px" }}>Total due</span>
                            <span style={{ color: "#14532d", fontWeight: 800, fontSize: "20px" }}>{sym}{total}</span>
                        </div>
                    </div>

                    <button onClick={handleConfirm} disabled={isSubmitting} style={{
                        width: "100%", padding: "14px", border: "none", borderRadius: "999px",
                        background: isSubmitting ? "#9ca3af" : "#14532d",
                        color: "#fff", fontSize: "14px", fontWeight: 700,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontFamily: "inherit", boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                        transition: "background 0.2s, box-shadow 0.2s",
                    }}
                        onMouseOver={e => { if (!isSubmitting) { e.currentTarget.style.background = "#0f3d20"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(20,83,45,0.45)"; } }}
                        onMouseOut={e => { if (!isSubmitting) { e.currentTarget.style.background = "#14532d"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,83,45,0.3)"; } }}
                    >
                        {isSubmitting ? (
                            <>
                                <div style={{
                                    width: "14px", height: "14px",
                                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                                    borderRadius: "50%", animation: "spin 0.7s linear infinite",
                                }} />
                                Processing...
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </>
                        ) : (
                            <>
                                Confirm Registration · {sym}{total}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 17L17 7M7 7h10v10" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Shared constants ─────────────────────────────────────────────────────────
const backdropStyle = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(15,10,40,0.55)",
    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px", fontFamily: "'DM Sans','Inter',sans-serif",
};

const labelStyle = {
    color: "#9ca3af", fontSize: "10.5px", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 7px",
};

const inputStyle = {
    width: "100%", height: "44px", border: "1.5px solid #e5e7eb",
    borderRadius: "12px", padding: "0 14px", fontSize: "13.5px",
    color: "#18103a", background: "#fafafa",
    fontFamily: "'DM Sans','Inter',sans-serif",
    outline: "none", boxSizing: "border-box",
};

const errorStyle = {
    color: "#ef4444", fontSize: "11.5px", margin: "4px 0 0 4px",
};

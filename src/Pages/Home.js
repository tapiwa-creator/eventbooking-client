import { useState, useEffect } from "react";
import EventCard from "../Components/EventCard";
import BookingModal from "../Components/BookingModal";

import { subscribeToAllEvents, searchEvents } from "../Services/EventDataService";


// ── Ministry categories ────────────────────────────────────────────────────────
const ministryCategories = [
    {
        tag: "CHILDREN",
        label: "Children's Ministries",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80",
    },
    {
        tag: "YOUTH",
        label: "Youth Ministries",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    },
    {
        tag: "WOMEN",
        label: "Women's Ministries",
        image: "https://zcuc.adventist.org/wp-content/uploads/2023/02/IMG_9148-scaled.jpg",
    },
    {
        tag: "MEN",
        label: "Men's Ministries",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80",
    },
    {
        tag: "CAMPUS",
        label: "Public Campus Ministries",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80",
    },
    {
        tag: "WISPA",
        label: "WISPA",
        image: "https://zcuc.adventist.org/wp-content/uploads/2023/02/dorcas-2-300x200.jpg",
    },
    {
        tag: "MUSIC",
        label: "Music Ministries",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80",
    },
];


// ── Hero — static single slide, Matthew 18:20 ────────────────────────────────
function HeroCarousel() {
    return (
        <div style={{ position: "relative", width: "100%", height: "380px", overflow: "hidden", borderRadius: "20px", marginBottom: "40px" }}>
            <img
                src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=90"
                alt="SDA Church"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.05) 100%)" }} />
            <div style={{
                position: "absolute", left: "48px", right: "48px", top: "50%",
                transform: "translateY(-50%)", maxWidth: "560px",
            }}>
                <p style={{
                    color: "#fff",
                    fontSize: "clamp(17px, 2.2vw, 26px)",
                    fontWeight: 400,
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    lineHeight: 1.65,
                    margin: "0 0 18px",
                    textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                }}>
                    "For where two or three are gathered together in my name, there am I in the midst of them."
                </p>
                <span style={{
                    color: "#86efac",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                }}>
                    — Matthew 18:20
                </span>
            </div>
        </div>
    );
}


// ── Ministry category grid ─────────────────────────────────────────────────────
function CategoryGrid({ selectedTag, onSelect }) {
    return (
        <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111", margin: "0 0 20px" }}>Browse by ministry</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "14px" }}>
                {ministryCategories.map(ministry => {
                    const isSelected = selectedTag === ministry.tag;
                    return (
                        <button
                            key={ministry.tag}
                            onClick={() => onSelect(isSelected ? null : ministry.tag)}
                            style={{
                                position: "relative", height: "100px", borderRadius: "14px",
                                overflow: "visible", border: "none", cursor: "pointer",
                                padding: 0, background: "none", transition: "transform 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                            {isSelected && (
                                <div style={{
                                    position: "absolute", inset: "-5px", borderRadius: "18px",
                                    border: "3px solid #14532d",
                                    boxShadow: "0 0 0 2px rgba(20,83,45,0.25)",
                                    zIndex: 2, pointerEvents: "none",
                                }} />
                            )}
                            <div style={{ position: "absolute", inset: 0, borderRadius: "14px", overflow: "hidden" }}>
                                <img
                                    src={ministry.image}
                                    alt={ministry.label}
                                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: isSelected
                                        ? "linear-gradient(to top, rgba(20,83,45,0.75) 0%, rgba(0,0,0,0.2) 100%)"
                                        : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 100%)",
                                }} />
                                <span style={{
                                    position: "absolute", bottom: "10px", left: "10px", right: "10px",
                                    color: "#fff", fontSize: "12px", fontWeight: 700,
                                    fontFamily: "Georgia, serif", lineHeight: 1.3,
                                }}>
                                    {ministry.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}


// ── Search bar ────────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }) {
    return (
        <div style={{ marginBottom: "28px" }}>
            <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                background: "#fff", border: "1.5px solid #e5e7eb",
                borderRadius: "12px", padding: "10px 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
                <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
                <input
                    type="text"
                    placeholder="Search events by name, location or description…"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", color: "#111", background: "transparent", fontFamily: "inherit" }}
                />
                {value && (
                    <button onClick={() => onChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "18px", lineHeight: 1, padding: 0 }}>×</button>
                )}
            </div>
        </div>
    );
}


// ── Events section ────────────────────────────────────────────────────────────
function EventsSection({ selectedTag, searchQuery, onClearFilter, events }) {
    const [bookingEvent, setBookingEvent] = useState(null);

    const ministry = ministryCategories.find(m => m.tag === selectedTag);
    // Client-side tag filter first, then search query
    const tagFiltered = selectedTag ? events.filter(e => e.tag === selectedTag) : events;
    const finalEvents = searchEvents(searchQuery, tagFiltered);
    const isFiltered = !!selectedTag;
    const isSearching = searchQuery.trim().length > 0;

    const heading = isFiltered
        ? ministry?.label ?? selectedTag
        : isSearching
            ? `Results for "${searchQuery}"`
            : "All events";

    return (
        <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111", margin: 0 }}>
                    {heading}
                    <span style={{ fontSize: "13px", fontWeight: 400, color: "#aaa", marginLeft: "8px" }}>
                        ({finalEvents.length} event{finalEvents.length !== 1 ? "s" : ""})
                    </span>
                </h2>
                {isFiltered && (
                    <button
                        onClick={onClearFilter}
                        style={{ padding: "7px 16px", fontSize: "13px", fontWeight: 600, color: "#14532d", background: "#dcfce7", border: "1.5px solid #86efac", borderRadius: "999px", cursor: "pointer" }}
                    >
                        ← Back to all events
                    </button>
                )}
            </div>

            {finalEvents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
                    <p style={{ fontSize: "15px", fontWeight: 500, color: "#6b7280", margin: 0 }}>
                        {isFiltered ? "No events for this category found" : "No events found"}
                    </p>
                    {!isFiltered && (
                        <p style={{ fontSize: "14px", margin: "6px 0 0" }}>Try a different search term or category</p>
                    )}
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                    {finalEvents.map(event => (
                        <EventCard key={event.id} event={event} onBook={setBookingEvent} />
                    ))}
                </div>
            )}

            {bookingEvent && (
                <BookingModal event={bookingEvent} onClose={() => setBookingEvent(null)} />
            )}
        </section>
    );
}


// ── DB error banner ───────────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 16px", marginBottom: "20px", fontSize: "13px", color: "#991b1b" }}>
            <span>⚠️ {message} — showing offline data.</span>
            <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "#991b1b", fontSize: "18px", lineHeight: 1 }}>×</button>
        </div>
    );
}


// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState([]);
    const [dbError, setDbError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = subscribeToAllEvents(
            (data) => { setEvents(data); setLoading(false); },
            (errMsg) => { setDbError(errMsg); setLoading(false); },
        );
        return () => unsub();
    }, []);

    function handleTagSelect(tag) {
        setSelectedTag(tag);
        setSearchQuery("");
    }

    return (
        <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#f8f8fa", minHeight: "100vh" }}>
            <div style={{ padding: "32px 40px" }}>

                {dbError && (
                    <ErrorBanner message={dbError} onDismiss={() => setDbError(null)} />
                )}

                <HeroCarousel />
                <CategoryGrid selectedTag={selectedTag} onSelect={handleTagSelect} />
                <SearchBar value={searchQuery} onChange={setSearchQuery} />

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                        <div style={{ width: "32px", height: "32px", border: "3px solid #dcfce7", borderTopColor: "#14532d", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                        <p style={{ fontSize: "14px", margin: 0 }}>Loading events…</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <EventsSection
                        selectedTag={selectedTag}
                        searchQuery={searchQuery}
                        onClearFilter={() => setSelectedTag(null)}
                        events={events}
                    />
                )}

            </div>
        </div>
    );
}
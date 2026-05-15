import React from "react";

export default function EventCard({ event, onBook }) {
    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #f0f0f5",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
                position: "relative",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
            }}
        >
            {/* Image Section */}
            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                <img
                    src={event.image}
                    alt={event.title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                {/* price badge — no tag badge */}
                <div style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(4px)",
                    color: "#111",
                    fontSize: "13px",
                    fontWeight: 800,
                    padding: "6px 12px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                    {event.price}
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h3 style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#111",
                    margin: "0 0 8px",
                    lineHeight: 1.3,
                    fontFamily: "Georgia, serif"
                }}>
                    {event.title}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span style={{ fontSize: "13px", color: "#555", fontWeight: 500 }}>{event.date}</span>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "16px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "2px", flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.4 }}>{event.location}</span>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #f0f0f5" }}>
                    <button
                        onClick={() => onBook(event)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            background: "#14532d",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            letterSpacing: "0.02em",
                            transition: "opacity 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}
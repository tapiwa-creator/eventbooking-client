import { useState } from "react";
import ContactModal from "../events/Contact";

export default function Header() {
    const [showContact, setShowContact] = useState(false);

    return (
        <>
            <div className="px-4 pt-4 md:px-10 md:pt-5" style={{
                background: "#f8f8fa",
                fontFamily: "'DM Sans', 'Inter', sans-serif",
            }}>
                <nav style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#14532d",
                    borderRadius: "999px",
                    padding: "10px 14px",
                    width: "100%",
                    boxSizing: "border-box",
                    position: "relative",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                }}>
                    {/* Logo + wordmark */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, paddingLeft: "4px" }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                            overflow: "hidden", flexShrink: 0,
                            boxShadow: "0 0 0 1.5px rgba(255,255,255,0.3)",
                        }}>
                            <img
                                src="/logo.png"
                                alt="AdventSphere"
                                style={{ width: "28px", height: "28px", objectFit: "contain" }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                            {/* ── CHANGE: Georgia serif to match category card labels ── */}
                            <span style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#fff",
                                letterSpacing: "-0.2px",
                                lineHeight: 1.2,
                                fontFamily: "Georgia, serif",   /* ← changed */
                            }}>
                                AdventSphere
                            </span>
                            <span style={{
                                fontSize: "10px",
                                fontWeight: 400,
                                color: "rgba(255,255,255,0.7)",
                                letterSpacing: "0.01em",
                                lineHeight: 1,
                            }}>
                                Your gateway to adventist events
                            </span>
                        </div>
                    </div>

                    {/* Right actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, paddingRight: "4px" }}>
                        <button
                            onClick={() => setShowContact(true)}
                            style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                background: "#fff", color: "#14532d", border: "none", cursor: "pointer",
                                padding: "9px 20px", borderRadius: "999px", fontSize: "13px",
                                fontWeight: 600, fontFamily: "inherit", transition: "background 0.2s",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
                            onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                        >
                            Contact us
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 17L17 7M7 7h10v10" />
                            </svg>
                        </button>
                    </div>
                </nav>
            </div>

            {showContact && <ContactModal onClose={() => setShowContact(false)} />}
        </>
    );
}
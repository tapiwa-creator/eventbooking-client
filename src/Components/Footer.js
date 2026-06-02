import { useState } from "react";
import ContactModal from "../events/Contact";

export default function Footer() {
    const [showContact, setShowContact] = useState(false);
    const year = new Date().getFullYear();

    const ministryLinks = [
        { label: "Children's Ministries" },
        { label: "Youth Ministries" },
        { label: "Women's Ministries" },
        { label: "Men's Ministries" },
        { label: "WISPA" },
        { label: "Music Ministries" },
    ];

    const exploreLinks = [
        { label: "All Events" },
        { label: "Campus Ministries" },
        { label: "Upcoming Programmes" },
    ];

    const connectLinks = [
        { label: "Contact Us", onClick: () => setShowContact(true) },
        { label: "Prayer Request", onClick: () => setShowContact(true) },
    ];

    const colHeadingStyle = {
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "#86efac",
        fontWeight: 700,
        margin: "0 0 14px",
    };

    const linkStyle = {
        display: "block",
        fontSize: "14px",
        color: "rgba(255,255,255,0.6)",
        textDecoration: "none",
        marginBottom: "10px",
        transition: "color 0.2s",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
    };

    const nonClickableLinkStyle = {
        display: "block",
        fontSize: "14px",
        color: "rgba(255,255,255,0.6)",
        marginBottom: "10px",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
    };

    return (
        <footer style={{ background: "#0f3d22", color: "#fff", marginTop: "64px" }}>

            {/* ── Top band ── */}
            <div className="px-4 py-8 md:px-10 md:pt-14 md:pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10" style={{
                maxWidth: "1280px",
                margin: "0 auto",
            }}>

                {/* Brand column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Logo + name */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: "#fff", display: "flex", alignItems: "center",
                            justifyContent: "center", flexShrink: 0,
                            boxShadow: "0 0 0 1.5px rgba(255,255,255,0.25)",
                        }}>
                            <img src="/logo.png" alt="AdventSphere" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", fontFamily: "Georgia, serif" }}>
                            AdventSphere
                        </span>
                    </div>

                    {/* Tagline */}
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: "260px", margin: 0, fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
                        Your gateway to Seventh-day Adventist events, ministries, and community gatherings.
                    </p>

                    {/* Scripture */}
                    <blockquote style={{ margin: "8px 0 0", paddingLeft: "12px", borderLeft: "2px solid #86efac" }}>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", fontStyle: "italic", lineHeight: 1.65, margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
                            "For where two or three are gathered in my name, there am I among them."
                        </p>
                        <cite style={{ fontSize: "11px", color: "#86efac", fontWeight: 700, fontStyle: "normal", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            — Matthew 18:20
                        </cite>
                    </blockquote>
                </div>

                {/* Ministries */}
                <div>
                    <p style={colHeadingStyle}>Ministries</p>
                    {ministryLinks.map(item => (
                        <span key={item.label} style={nonClickableLinkStyle}>
                            {item.label}
                        </span>
                    ))}
                </div>

                {/* Explore */}
                <div>
                    <p style={colHeadingStyle}>Explore</p>
                    {exploreLinks.map(item => (
                        <span key={item.label} style={nonClickableLinkStyle}>
                            {item.label}
                        </span>
                    ))}
                </div>

                {/* Connect */}
                <div>
                    <p style={colHeadingStyle}>Connect</p>
                    {connectLinks.map(item => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            style={{ ...linkStyle, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", maxWidth: "1280px", margin: "0 auto" }} />

            {/* ── Bottom bar ── */}
            <div className="px-4 py-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3" style={{
                maxWidth: "1280px",
                margin: "0 auto",
            }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
                    © {year} AdventSphere. All rights reserved.
                </p>

                <a
                    href="https://elevatelt.co.zw"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        fontSize: "12px", fontWeight: 700, color: "#0f3d22",
                        background: "#86efac", padding: "6px 14px", borderRadius: "999px",
                        textDecoration: "none", transition: "background 0.2s",
                        fontFamily: "'DM Sans', 'Inter', sans-serif",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#bbf7d0"}
                    onMouseLeave={e => e.currentTarget.style.background = "#86efac"}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                    Designed by elevateLT
                </a>
            </div>
            {showContact && <ContactModal onClose={() => setShowContact(false)} />}
        </footer>
    );
}

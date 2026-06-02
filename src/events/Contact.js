import { useState } from "react";

// ── Location icon ─────────────────────────────────────────────────────────────
function LocationIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
        </svg>
    );
}

// ── Mail icon ─────────────────────────────────────────────────────────────────
function MailIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0 }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

export default function ContactModal({ onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [done, setDone] = useState(false);

    function validate() {
        const errs = {};
        if (!name.trim() || name.trim().length < 2)
            errs.name = "Name must be at least 2 characters.";
        if (!email || !email.includes("@") || !email.includes("."))
            errs.email = "Please enter a valid email address.";
        if (!message.trim() || message.trim().length < 10)
            errs.message = "Message must be at least 10 characters.";
        return errs;
    }

    function handleSubmit() {
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setDone(true);
    }

    const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

    // ── Success screen ────────────────────────────────────────────────────────
    if (done) {
        return (
            <div onClick={handleBackdrop} style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(15,10,40,0.55)",
                backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "16px", fontFamily: "'DM Sans','Inter',sans-serif",
            }}>
                <div style={{
                    background: "#fff", borderRadius: "24px", padding: "48px 36px",
                    maxWidth: "420px", width: "100%", textAlign: "center",
                    boxShadow: "0 24px 64px rgba(20,83,45,0.18)",
                    border: "1px solid rgba(20,83,45,0.1)",
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
                        Message Sent!
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "13.5px", lineHeight: 1.6, margin: "0 0 4px" }}>
                        Thanks <strong>{name}</strong>, we'll get back to you at
                    </p>
                    <p style={{ color: "#14532d", fontSize: "15px", fontWeight: 700, margin: "0 0 28px" }}>
                        {email}
                    </p>
                    <button onClick={onClose} style={{
                        width: "100%", padding: "13px",
                        background: "#14532d", color: "#fff", border: "none",
                        borderRadius: "999px", fontSize: "14px", fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
                    }}>Done</button>
                </div>
            </div>
        );
    }

    // ── Form ─────────────────────────────────────────────────────────────────
    return (
        <div onClick={handleBackdrop} style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(15,10,40,0.55)",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px", fontFamily: "'DM Sans','Inter',sans-serif",
        }}>
            <div style={{
                background: "#fff", borderRadius: "24px",
                width: "100%", maxWidth: "500px", maxHeight: "90vh",
                overflowY: "auto", boxShadow: "0 24px 64px rgba(20,83,45,0.18)",
                border: "1px solid rgba(20,83,45,0.1)",
            }}>

                {/* ── Hero image ── */}
                <div style={{ position: "relative", height: "190px", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
                    <img
                        src="https://images.unsplash.com/photo-1611093344277-4800ee7ad59e?w=800&q=80"
                        alt="Contact us"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(8,4,24,0.82) 100%)" }} />
                    <button onClick={onClose} style={{
                        position: "absolute", top: "12px", right: "12px",
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
                        fontSize: "16px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 20px" }}>
                        <h2 style={{ color: "#fff", fontSize: "17px", fontWeight: 800, margin: "0 0 5px", lineHeight: 1.3, fontFamily: "Georgia,serif" }}>
                            Get in Touch
                        </h2>
                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <LocationIcon /> Conference
                            </span>
                            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <MailIcon /> We'd love to hear from you
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ padding: "20px 22px 26px" }}>

                    {/* Description */}
                    <div style={{
                        background: "#f0fdf4", border: "1.5px solid #bbf7d0",
                        borderRadius: "12px", padding: "13px 15px", marginBottom: "20px",
                    }}>
                        <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.65, margin: 0 }}>
                            Have a question, feedback, or need help with your registration? Fill in the form below and our team will get back to you shortly.
                        </p>
                    </div>

                    {/* Name */}
                    <div style={{ marginBottom: "14px" }}>
                        <p style={labelStyle}>Full Name</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(err => ({ ...err, name: "" })); }}
                            style={{
                                width: "100%", boxSizing: "border-box", padding: "10px 14px",
                                border: `1.5px solid ${errors.name ? "#fca5a5" : "#e5e7eb"}`,
                                borderRadius: "12px", fontSize: "13.5px", color: "#18103a",
                                fontFamily: "inherit", background: errors.name ? "#fff5f5" : "#fff",
                                outline: "none", height: "44px",
                            }}
                            onFocus={e => { e.target.style.borderColor = "#14532d"; e.target.style.boxShadow = "0 0 0 3px rgba(20,83,45,0.15)"; }}
                            onBlur={e => { e.target.style.borderColor = errors.name ? "#fca5a5" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                        />
                        {errors.name && <p style={errorStyle}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "14px" }}>
                        <p style={labelStyle}>Email Address</p>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(err => ({ ...err, email: "" })); }}
                            style={{
                                width: "100%", boxSizing: "border-box", padding: "10px 14px",
                                border: `1.5px solid ${errors.email ? "#fca5a5" : "#e5e7eb"}`,
                                borderRadius: "12px", fontSize: "13.5px", color: "#18103a",
                                fontFamily: "inherit", background: errors.email ? "#fff5f5" : "#fff",
                                outline: "none", height: "44px",
                            }}
                            onFocus={e => { e.target.style.borderColor = "#14532d"; e.target.style.boxShadow = "0 0 0 3px rgba(20,83,45,0.15)"; }}
                            onBlur={e => { e.target.style.borderColor = errors.email ? "#fca5a5" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                        />
                        {errors.email && <p style={errorStyle}>{errors.email}</p>}
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: "18px" }}>
                        <p style={labelStyle}>Message</p>
                        <textarea
                            value={message}
                            rows={4}
                            onChange={(e) => { setMessage(e.target.value); setErrors(err => ({ ...err, message: "" })); }}
                            style={{
                                width: "100%", boxSizing: "border-box", padding: "10px 14px",
                                border: `1.5px solid ${errors.message ? "#fca5a5" : "#e5e7eb"}`,
                                borderRadius: "12px", fontSize: "13.5px", color: "#18103a",
                                fontFamily: "inherit", background: errors.message ? "#fff5f5" : "#fff",
                                outline: "none", resize: "none", lineHeight: 1.6,
                            }}
                            onFocus={e => { e.target.style.borderColor = "#14532d"; e.target.style.boxShadow = "0 0 0 3px rgba(20,83,45,0.15)"; }}
                            onBlur={e => { e.target.style.borderColor = errors.message ? "#fca5a5" : "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                        />
                        {errors.message && <p style={errorStyle}>{errors.message}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: "100%", padding: "14px",
                            background: "#14532d", color: "#fff", border: "none",
                            borderRadius: "999px", fontSize: "14px", fontWeight: 700,
                            cursor: "pointer", fontFamily: "inherit",
                            boxShadow: "0 4px 16px rgba(20,83,45,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                            transition: "background 0.2s, box-shadow 0.2s",
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = "#0f3d20"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(20,83,45,0.45)"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "#14532d"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,83,45,0.3)"; }}
                    >
                        Send Message
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M7 7h10v10" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

const labelStyle = {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 700,
    margin: "0 0 7px",
};

const errorStyle = { color: "#ef4444", fontSize: "11.5px", margin: "5px 0 0" };

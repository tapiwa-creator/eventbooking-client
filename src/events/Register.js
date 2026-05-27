import { useState, useEffect } from "react";

const EVENT_CATEGORIES = [
    "Music", "Tech", "Sports", "Art",
    "Food & Drink", "Business", "Comedy", "Film",
    "Gaming", "Wellness", "Science", "Fashion",
];

const labelStyle = {
    color: "#4b5563", fontSize: "10.5px", fontWeight: 800,
    textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 7px",
    display: "block"
};

export default function RegisterModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [selected, setSelected] = useState(new Set());
    const [errors, setErrors] = useState({});
    const [done, setDone] = useState(false);

    function toggleCat(label) {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });
        setErrors((e) => ({ ...e, events: "" }));
    }

    function validate() {
        const errs = {};
        if (!username.trim() || username.trim().length < 2)
            errs.username = "Username must be at least 2 characters.";
        if (!email || !email.includes("@") || !email.includes("."))
            errs.email = "Please enter a valid email address.";
        if (selected.size === 0)
            errs.events = "Select at least one event type to continue.";
        return errs;
    }

    function handleSubmit() {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setDone(true);
    }

    const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

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
                    boxShadow: "0 24px 64px rgba(80,20,160,0.18)",
                    border: "1px solid rgba(124,58,237,0.1)",
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px",
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h3 style={{ color: "#18103a", fontSize: "22px", fontWeight: 800, margin: "0 0 8px", fontFamily: "Georgia,serif" }}>
                        Welcome, {username}!
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.6, margin: "0 0 20px" }}>
                        We've sent a confirmation to <span style={{ color: "#7c3aed", fontWeight: 700 }}>{email}</span>
                    </p>
                    <div style={{
                        display: "flex", flexWrap: "wrap", gap: "6px",
                        justifyContent: "center", marginBottom: "26px",
                    }}>
                        {[...selected].map((c) => (
                            <span key={c} style={{
                                background: "#ede9fe", color: "#6d28d9",
                                fontSize: "12px", fontWeight: 700,
                                padding: "6px 14px", borderRadius: "999px",
                            }}>{c}</span>
                        ))}
                    </div>
                    <button onClick={onClose} style={{
                        width: "100%", padding: "14px",
                        background: "#7c3aed", color: "#fff", border: "none",
                        borderRadius: "999px", fontSize: "14px", fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                    }}>Done</button>
                </div>
            </div>
        );
    }

    return (
        <div onClick={handleBackdrop} style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(15,10,40,0.55)",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px", fontFamily: "'DM Sans','Inter',sans-serif",
            animation: "rm-fadeIn 0.18s ease",
        }}>
            <style>{`
                @keyframes rm-fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes rm-slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .rm-input:focus { outline: none; border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15); }
            `}</style>

            <div style={{
                background: "#ffffff", borderRadius: "24px", width: "100%", maxWidth: "460px",
                boxShadow: "0 24px 64px rgba(80, 20, 160, 0.22), 0 2px 8px rgba(0,0,0,0.08)",
                overflow: "hidden", border: "1px solid rgba(124, 58, 237, 0.1)",
                animation: "rm-slideUp 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)",
                position: "relative",
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", top: "20px", right: "20px",
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "#f0f0f2", border: "none", color: "#6b7280",
                    fontSize: "16px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s, color 0.15s",
                }}
                    onMouseOver={e => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#18103a"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "#f0f0f2"; e.currentTarget.style.color = "#6b7280"; }}
                >✕</button>

                <div style={{ padding: "32px 32px 28px" }}>
                    <div style={{ marginBottom: "24px" }}>
                        <div style={{
                            width: "44px", height: "44px", borderRadius: "14px",
                            background: "linear-gradient(135deg, #7c3aed 0%, #5f22c8 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: "16px", boxShadow: "0 8px 16px rgba(124,58,237,0.2)"
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#fff" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#18103a", margin: "0 0 6px", fontFamily: "Georgia,serif" }}>
                            Join Eventara
                        </h2>
                        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
                            Subscribe for event alerts and exclusive updates.
                        </p>
                    </div>

                    {/* Username */}
                    <div style={{ marginBottom: "16px" }}>
                        <label style={labelStyle}>Username</label>
                        <input className="rm-input" type="text" value={username} onChange={(e) => { setUsername(e.target.value); setErrors((err) => ({ ...err, username: "" })); }}
                            style={{
                                width: "100%", boxSizing: "border-box", padding: "12px 16px",
                                border: `1.5px solid ${errors.username ? "#fca5a5" : "#e5e7eb"}`,
                                borderRadius: "12px", fontSize: "14px", color: "#18103a", fontFamily: "inherit",
                                background: errors.username ? "#fff5f5" : "#f8f8fa", transition: "all 0.15s",
                            }}
                        />
                        {errors.username && <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0", fontWeight: 500 }}>{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={labelStyle}>Email address</label>
                        <input className="rm-input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((err) => ({ ...err, email: "" })); }}
                            style={{
                                width: "100%", boxSizing: "border-box", padding: "12px 16px",
                                border: `1.5px solid ${errors.email ? "#fca5a5" : "#e5e7eb"}`,
                                borderRadius: "12px", fontSize: "14px", color: "#18103a", fontFamily: "inherit",
                                background: errors.email ? "#fff5f5" : "#f8f8fa", transition: "all 0.15s",
                            }}
                        />
                        {errors.email && <p style={{ color: "#ef4444", fontSize: "12px", margin: "6px 0 0", fontWeight: 500 }}>{errors.email}</p>}
                    </div>

                    {/* Event interests */}
                    <div style={{ marginBottom: "28px" }}>
                        <label style={labelStyle}>Event interests</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {EVENT_CATEGORIES.map((cat) => {
                                const active = selected.has(cat);
                                return (
                                    <button key={cat} onClick={() => toggleCat(cat)}
                                        style={{
                                            padding: "8px 16px", borderRadius: "999px",
                                            border: `1.5px solid ${active ? "#7c3aed" : "#e5e7eb"}`,
                                            background: active ? "#ede9fe" : "#fff",
                                            color: active ? "#5b21b6" : "#6b7280",
                                            fontSize: "13px", fontWeight: 700, fontFamily: "inherit",
                                            cursor: "pointer", transition: "all 0.15s",
                                        }}
                                        onMouseOver={e => { if (!active) { e.currentTarget.style.borderColor = "#a78bfa"; e.currentTarget.style.background = "rgba(237,233,254,0.45)"; e.currentTarget.style.color = "#6d28d9"; } }}
                                        onMouseOut={e => { if (!active) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; } }}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.events && <p style={{ color: "#ef4444", fontSize: "12px", margin: "8px 0 0", fontWeight: 500 }}>{errors.events}</p>}
                    </div>

                    {/* Submit */}
                    <button onClick={handleSubmit}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            background: "#7c3aed", color: "#fff", border: "none", borderRadius: "999px",
                            padding: "14px 24px", fontSize: "15px", fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
                            transition: "all 0.2s", boxShadow: "0 4px 16px rgba(124, 58, 237, 0.3)",
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = "#6d28d9"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.45)"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.3)"; }}
                    >
                        Register
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17L17 7M7 7h10v10" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

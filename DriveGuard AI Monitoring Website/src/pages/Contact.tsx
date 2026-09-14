import { useState } from "react";
import Nav from "../components/Nav";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send message.");
    }

    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 4000);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    alert("Could not send your message. Please try again.");
  }
};

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }} className="mesh-bg">
      <Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 1.25rem 4rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge badge-green" style={{ marginBottom: "1.25rem", display: "inline-block" }}>
            CONTACT US
          </span>
          <h1
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#e8edf2",
              marginBottom: "0.75rem",
              letterSpacing: "0.01em",
            }}
          >
            Get in <span style={{ color: "#00ff88" }}>Touch</span>
          </h1>
          <p style={{ color: "#6b7a8d", maxWidth: 460, margin: "0 auto", lineHeight: 1.65, fontSize: "0.95rem" }}>
            Have questions about DriveGuard? Our team is here to help. Reach out and
            we'll get back to you as soon as possible.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Form */}
          <div
            style={{
              background: "rgba(16,22,28,0.8)",
              border: "1px solid rgba(0,255,136,0.12)",
              borderRadius: 20,
              padding: "2rem",
            }}
          >
            {sent && (
              <div
                style={{
                  background: "rgba(0,255,136,0.08)",
                  border: "1px solid rgba(0,255,136,0.3)",
                  borderRadius: 10,
                  padding: "0.9rem 1.1rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <span style={{ color: "#00ff88", fontSize: "1.1rem" }}>✓</span>
                <span style={{ color: "#00ff88", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, letterSpacing: "0.04em" }}>
                  Message sent successfully!
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }} className="form-name-grid">
                <div>
                  <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                    Name
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                    Email
                  </label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="alex@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                  Subject
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Question about DriveGuard"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                  Message
                </label>
                <textarea
                  className="input-field"
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  style={{ resize: "vertical", minHeight: 120 }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", textAlign: "center" }}>
                Send Message →
              </button>
            </form>
          </div>

          {/* Info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              {
                icon: "📧",
                title: "Email",
                value: "support@driveguard.ai",
                sub: "We read every message",
              },
              {
                icon: "🛟",
                title: "Support",
                value: "help@driveguard.ai",
                sub: "Technical assistance",
              },
              {
                icon: "⏱",
                title: "Response Time",
                value: "Within 24 hours",
                sub: "Monday – Friday",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "rgba(16,22,28,0.7)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: "1.25rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  transition: "border-color 0.3s",
                }}
                className="feature-card"
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "rgba(0,255,136,0.07)",
                    border: "1px solid rgba(0,255,136,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#4d6352", letterSpacing: "0.1em", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                    {card.title}
                  </div>
                  <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "1rem", color: "#e8edf2", marginBottom: "0.15rem" }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#4d6352" }}>{card.sub}</div>
                </div>
              </div>
            ))}

            {/* Extra note */}
            <div
              style={{
                background: "rgba(0,255,136,0.04)",
                border: "1px solid rgba(0,255,136,0.1)",
                borderRadius: 14,
                padding: "1.25rem",
              }}
            >
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 600, color: "#00ff88", marginBottom: "0.4rem", fontSize: "0.95rem" }}>
                Safety-Focused Team
              </div>
              <p style={{ fontSize: "0.82rem", color: "#6b7a8d", lineHeight: 1.65 }}>
                DriveGuard was built with a focus on real-world driver safety. Our team is
                committed to making AI-powered monitoring accessible to everyone on the road.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .contact-grid { grid-template-columns: 1.3fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .form-name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

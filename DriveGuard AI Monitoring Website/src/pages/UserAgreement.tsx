import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

export default function UserAgreement() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) return;
    navigate("/monitoring");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "#e8edf2",
      }}
      className="mesh-bg"
    >
      <Nav />

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "110px 1.25rem 4rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            className="badge badge-green"
            style={{ display: "inline-block", marginBottom: "1rem" }}
          >
            SAFETY & CONSENT
          </span>

          <h1
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              marginBottom: "0.75rem",
            }}
          >
            User Agreement
          </h1>

          <p
            style={{
              color: "#6b7a8d",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Please review the information below before starting your
            AI-monitored driving session.
          </p>
        </div>

        {/* Agreement card */}
        <div
          className="glass"
          style={{
            padding: "2rem",
            borderRadius: 20,
            marginBottom: "1.25rem",
          }}
        >
          {[
            {
              number: "01",
              title: "AI Monitoring",
              text: "DriveGuard uses your device camera to analyze visual indicators such as eye openness, blinking, and signs of reduced alertness during the monitoring session.",
            },
            {
              number: "02",
              title: "Camera Usage",
              text: "Camera access is required for the monitoring system to detect your face and eye-related signals. Monitoring is active only while a session is running.",
            },
            {
              number: "03",
              title: "Safety Alerts",
              text: "DriveGuard may provide visual and audio warnings when potential drowsiness is detected. These alerts are intended to support driver awareness.",
            },
            {
              number: "04",
              title: "Responsible Driving",
              text: "DriveGuard is a safety-assistance tool and does not replace responsible driving, proper rest, or your own judgment. Never rely solely on the system while driving.",
            },
            {
              number: "05",
              title: "Privacy",
              text: "Camera data should be processed only for the purposes required by the monitoring experience. Do not use DriveGuard in a way that violates another person's privacy.",
            },
          ].map((item) => (
            <div
              key={item.number}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "1.25rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  minWidth: 42,
                  height: 42,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,255,136,0.07)",
                  border: "1px solid rgba(0,255,136,0.15)",
                  color: "#00ff88",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                {item.number}
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "1.1rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: "#7f8b99",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Consent */}
        <div
          style={{
            background: "rgba(0,255,136,0.035)",
            border: "1px solid rgba(0,255,136,0.15)",
            borderRadius: 16,
            padding: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <label
            style={{
              display: "flex",
              gap: "0.8rem",
              alignItems: "flex-start",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                marginTop: 2,
                accentColor: "#00ff88",
                cursor: "pointer",
              }}
            />

            <span
              style={{
                color: "#a0aab8",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              I have read and understood the above information. I agree to
              allow DriveGuard to use my camera for the AI monitoring session
              and understand that the system is a safety-assistance tool.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="btn-outline">
              ← Back to Home
            </button>
          </Link>

          <button
            className="btn-primary"
            disabled={!agreed}
            onClick={handleContinue}
            style={{
              opacity: agreed ? 1 : 0.4,
              cursor: agreed ? "pointer" : "not-allowed",
              padding: "0.85rem 1.8rem",
            }}
          >
            Continue to Camera Check →
          </button>
        </div>
      </main>
    </div>
  );
}
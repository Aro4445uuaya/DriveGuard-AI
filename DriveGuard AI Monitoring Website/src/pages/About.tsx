import Nav from "../components/Nav";

const steps = [
  { icon: "📷", label: "Camera", desc: "Live feed capture" },
  { icon: "👁", label: "Eye Monitoring", desc: "AI tracks eye openness" },
  { icon: "📊", label: "Alertness Analysis", desc: "PERCLOS algorithm" },
  { icon: "🔍", label: "Drowsiness Detection", desc: "Pattern recognition" },
  { icon: "⚡", label: "Instant Alert", desc: "Sub-500ms response" },
  { icon: "📈", label: "Session Statistics", desc: "Full analytics report" },
];

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }} className="mesh-bg">
      <Nav />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 1.25rem 4rem" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="badge badge-green" style={{ marginBottom: "1.25rem", display: "inline-block" }}>
            ABOUT DRIVEGUARD
          </span>
          <h1
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#e8edf2",
              marginBottom: "1rem",
              lineHeight: 1.1,
            }}
          >
            Redefining Driver Safety with{" "}
            <span style={{ color: "#00ff88" }}>Artificial Intelligence</span>
          </h1>
          <p style={{ color: "#a0aab8", maxWidth: 580, margin: "0 auto", lineHeight: 1.75, fontSize: "1rem" }}>
            DriveGuard is an AI-powered driver monitoring platform that uses computer vision
            and machine learning to detect drowsiness in real time — before it becomes dangerous.
          </p>
        </div>

        <div className="section-line" style={{ marginBottom: "4rem" }} />

        {/* Mission */}
        <div style={{ marginBottom: "4rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
            }}
            className="about-mission-grid"
          >
            <div
              style={{
                background: "rgba(16,22,28,0.8)",
                border: "1px solid rgba(0,255,136,0.15)",
                borderRadius: 20,
                padding: "2.5rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎯</div>
              <h2
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "#00ff88",
                  marginBottom: "0.75rem",
                  letterSpacing: "0.03em",
                }}
              >
                Our Mission
              </h2>
              <p style={{ color: "#a0aab8", lineHeight: 1.75, fontSize: "0.95rem" }}>
                To use accessible AI technology to help promote safer and more alert driving.
                We believe that technology should protect lives, and DriveGuard puts that belief
                into action with every monitoring session.
              </p>
            </div>

            <div
              style={{
                background: "rgba(16,22,28,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20,
                padding: "2.5rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌍</div>
              <h2
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "#e8edf2",
                  marginBottom: "0.75rem",
                  letterSpacing: "0.03em",
                }}
              >
                The Problem We Solve
              </h2>
              <p style={{ color: "#a0aab8", lineHeight: 1.75, fontSize: "0.95rem" }}>
                Driver fatigue is responsible for a significant percentage of road accidents
                worldwide. Many drivers don't realize they're drowsy until it's too late.
                DriveGuard provides an early warning system using real-time AI analysis of
                eye behavior and alertness patterns.
              </p>
            </div>
          </div>
        </div>

        <div className="section-line" style={{ marginBottom: "4rem" }} />

        {/* How it works */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="badge badge-green" style={{ marginBottom: "1rem", display: "inline-block" }}>
              HOW IT WORKS
            </span>
            <h2
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                color: "#e8edf2",
              }}
            >
              The DriveGuard Process
            </h2>
          </div>

          {/* Steps */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={step.label}
                style={{
                  background: "rgba(16,22,28,0.7)",
                  border: "1px solid rgba(0,255,136,0.1)",
                  borderRadius: 14,
                  padding: "1.25rem",
                  position: "relative",
                  transition: "border-color 0.3s, transform 0.3s",
                }}
                className="feature-card"
              >
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.7rem",
                    color: "rgba(0,255,136,0.3)",
                    fontWeight: 600,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{step.icon}</div>
                <div
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#00ff88",
                    marginBottom: "0.3rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.label}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#6b7a8d" }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-line" style={{ marginBottom: "4rem" }} />

        {/* Technology */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="badge badge-green" style={{ marginBottom: "1rem", display: "inline-block" }}>
              TECHNOLOGY
            </span>
            <h2
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                color: "#e8edf2",
                marginBottom: "0.75rem",
              }}
            >
              AI & Computer Vision
            </h2>
            <p style={{ color: "#6b7a8d", maxWidth: 500, margin: "0 auto", lineHeight: 1.65, fontSize: "0.9rem" }}>
              DriveGuard uses computer vision to analyze facial landmarks and eye behavior
              in real time, identifying subtle cues that indicate driver fatigue.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="tech-grid">
            {[
              {
                title: "PERCLOS Algorithm",
                desc: "Measures the percentage of time eyelids are more than 80% closed — the gold standard for drowsiness detection.",
                icon: "🔬",
              },
              {
                title: "Real-Time Processing",
                desc: "Analyzes up to 30 frames per second, providing continuous and responsive monitoring without delay.",
                icon: "⚡",
              },
              {
                title: "Facial Landmark Tracking",
                desc: "Tracks 68+ facial points to accurately determine eye openness, head position, and expression state.",
                icon: "🗺",
              },
              {
                title: "Adaptive Intelligence",
                desc: "The AI adapts to individual driver baselines, reducing false positives and improving personal accuracy.",
                icon: "🧠",
              },
            ].map((t) => (
              <div key={t.title} className="feature-card" style={{ padding: "1.5rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{t.icon}</div>
                <div
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#e8edf2",
                    marginBottom: "0.4rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {t.title}
                </div>
                <p style={{ fontSize: "0.82rem", color: "#6b7a8d", lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            background: "rgba(16,22,28,0.8)",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: 20,
            padding: "2.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "1.8rem",
              color: "#e8edf2",
              marginBottom: "0.75rem",
            }}
          >
            Ready to Experience DriveGuard?
          </h2>
          <p style={{ color: "#6b7a8d", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Start your first AI monitoring session today.
          </p>
          <a href="/monitoring" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "0.9rem 2.5rem", fontSize: "1rem" }}>
              Get Started →
            </button>
          </a>
        </div>
      </div>

      <style>{`
        @media (min-width: 700px) {
          .about-mission-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .tech-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

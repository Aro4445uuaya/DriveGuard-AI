import { Link } from "react-router-dom";
import Nav from "../components/Nav";


const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="12" r="6" stroke="#00ff88" strokeWidth="1.8" />
        <circle cx="14" cy="12" r="2.5" fill="#00ff88" />
        <path d="M5 24c0-5 4-9 9-9s9 4 9 9" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M2 12h3M23 12h3M14 4V2M14 22v2" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Real-Time Eye Monitoring",
    desc: "Computer vision tracks eye openness, blink rate, and gaze patterns 30 times per second.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L4 9v6c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V9L14 4z" stroke="#00ff88" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 14l3 3 5-5" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Drowsiness Detection",
    desc: "AI algorithms identify PERCLOS patterns and micro-sleep events before they become dangerous.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#00ff88" strokeWidth="1.8" />
        <path d="M14 8v6l4 4" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill="#00ff88" opacity="0.5" />
      </svg>
    ),
    label: "Instant Safety Alerts",
    desc: "Immediate visual alerts when drowsiness is detected, keeping drivers informed and safe.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="6" width="22" height="16" rx="3" stroke="#00ff88" strokeWidth="1.8" />
        <path d="M8 18l3-4 3 2 4-6 2 3" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Session Statistics",
    desc: "Detailed post-session reports with alertness trends, blink data, and AI-generated insights.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="2.5" stroke="#00ff88" strokeWidth="1.8" />
        <path d="M9 8V6a5 5 0 0110 0v2" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="14" cy="15" r="2.5" fill="#00ff88" opacity="0.8" />
        <path d="M14 17.5v2" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    label: "AI-Powered Monitoring",
    desc: "Machine learning models trained on driver fatigue data, continuously improving accuracy.",
  },
];

const stats = [
  { label: "Real-Time AI", sublabel: "Monitoring", value: "30 FPS" },
  { label: "Detection", sublabel: "Accuracy", value: "97.4%" },
  { label: "Alert", sublabel: "Response", value: "<0.5 SEC" },
  { label: "Session", sublabel: "Analytics", value: "REAL-TIME" },
];

export default function Home() {
  
  
return (
  <div
    className="mesh-bg"
    style={{
      minHeight: "100vh",
      position: "relative",
      overflowX: "hidden",
    }}
  >

    {/* VIDEO BACKGROUND */}
    <video
      autoPlay
      muted
      loop
      playsInline
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
      }}
    >
    <source src="/asserts/vid.mp4" type="video/mp4" />
    </video>

    {/* DARK OVERLAY */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(3, 8, 12, 0.20)",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        position: "relative",
        zIndex: 2,
      }}
    >
      <Nav />

      {/* Hero */}
      <section
        style={{
          paddingTop: 100,
          paddingBottom: 80,
          padding: "100px 1.25rem 80px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left / text */}
          <div style={{ maxWidth: 580 }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <span className="badge badge-green">AI DRIVER SAFETY PLATFORM</span>
            </div>
            <h1
              style={{

                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                lineHeight: 1.05,
                color: "#00ff88",
                marginBottom: "1.25rem",
                letterSpacing: "0.01em",
                
              }}
            >
              AI That Watches Over{" "}
              <span style={{ color: "#ffffff" }} className="glow-green">
                You While You Drive.
              </span>
            </h1>
            <p
              style={{
                color: "#a0aab8",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                marginBottom: "2rem",
                maxWidth: 480,
              }}
            >
              DriveGuard uses advanced AI and computer vision to monitor your eyes and
              alertness in real time, detecting early signs of drowsiness before they
              become a risk on the road.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
  <div
  style={{
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  }}
>
  <Link
    to="/user-agreement"
    style={{
      textDecoration: "none",
      display: "inline-block",
    }}
  >
    <button
      type="button"
      className="btn-primary"
      style={{
        fontSize: "1.05rem",
        padding: "0.9rem 2.2rem",
      }}
    >
      Get Started →
    </button>
  </Link>

 <Link
  to="/accident-test"
  style={{
    textDecoration: "none",
    display: "inline-block",
  }}
>
  <button
    type="button"
    className="btn-outline"
    style={{
      fontSize: "1.05rem",
      padding: "0.9rem 2.2rem",
    }}
  >
    Motion Sensor Test
  </button>
</Link>
</div>

  <Link to="/about" style={{ textDecoration: "none" }}>
    <button
      type="button"
      className="btn-outline"
      style={{
        fontSize: "1.05rem",
        padding: "0.9rem 2.2rem",
      }}
    >
      Learn More
    </button>
  </Link>

<Link
  to="/emergency-contact"
  style={{
    textDecoration: "none",
    display: "inline-block",
    marginLeft: "0rem",
    
  }}
>
  <button
    type="button"
    className="btn-outline"
    style={{
      fontSize: "1.05rem",
      padding: "0.9rem 2.2rem",
    }}
  >
    Emergency Contact
  </button>
</Link>

</div>



             

            {/* Mini stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.75rem",
                marginTop: "2.5rem",
              }}
              className="mini-stats-grid"
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "rgba(8,16,22,0.52)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(0,255,136,0.18)",
                    borderRadius: 10,
                    padding: "0.75rem 0.6rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#00ff88",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#c0cad4", lineHeight: 1.3, marginTop: 2 }}>
                    {s.label}
                    <br />
                    {s.sublabel}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right / visual */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AIDriverVisual />
          </div>
        </div>
      </section>

      <div className="section-line" style={{ margin: "0 1.25rem" }} />

      {/* How DriveGuard Works */}
<section
  style={{
    padding: "5rem 1.25rem",
    maxWidth: 1200,
    margin: "0 auto",
  }}
>
  <div style={{ textAlign: "center", marginBottom: "3rem" }}>
    <span
      className="badge badge-green"
      style={{
        marginBottom: "1rem",
        display: "inline-block",
      }}
    >
      HOW DRIVEGUARD WORKS
    </span>

    <h2
      style={{
        fontFamily: "Rajdhani, sans-serif",
        fontWeight: 700,
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        color: "#e8edf2",
        marginBottom: "0.75rem",
      }}
    >
      Smart Monitoring in Four Steps
    </h2>

    <p
      style={{
        color: "#c0cad4",
        maxWidth: 520,
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      DriveGuard combines camera monitoring and AI analysis
      to help identify signs of driver fatigue.
    </p>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "1rem",
    }}
  >
    {[
      {
        number: "01",
        title: "Camera Access",
        text: "Allow camera access to begin your monitoring session.",
        icon: "📷",
      },
      {
        number: "02",
        title: "AI Monitoring",
        text: "Computer vision observes facial and eye-related cues in real time.",
        icon: "👁️",
      },
      {
        number: "03",
        title: "Drowsiness Detection",
        text: "The system evaluates changes in eye state and alertness.",
        icon: "🧠",
      },
      {
        number: "04",
        title: "Safety Alert",
        text: "A warning is presented when signs of drowsiness are detected.",
        icon: "⚠️",
      },
    ].map((step) => (
      <div
        key={step.number}
        className="feature-card"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(8, 16, 22, 0.48)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.7rem",
              color: "#00ff88",
              letterSpacing: "0.1em",
            }}
          >
            STEP {step.number}
          </span>

          <span style={{ fontSize: "1.4rem" }}>
            {step.icon}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#e8edf2",
            marginBottom: "0.6rem",
          }}
        >
          {step.title}
        </h3>

        <p
          style={{
            color: "#c0cad4",
            fontSize: "0.88rem",
            lineHeight: 1.65,
          }}
        >
          {step.text}
        </p>
      </div>
    ))}
  </div>
</section>

<div
  className="section-line"
  style={{ margin: "0 1.25rem" }}
/>

      {/* Features */}
      <section style={{ padding: "5rem 1.25rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="badge badge-green" style={{ marginBottom: "1rem", display: "inline-block" }}>
            CORE FEATURES
          </span>
          <h2
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#e8edf2",
              marginBottom: "0.75rem",
            }}
          >
            Intelligent Safety, Every Mile
          </h2>
          <p style={{ color: "#c0cad4", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
            Five layers of AI protection working together in real time.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="feature-card"
              style={{
                background: "rgba(8, 16, 22, 0.48)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 12,
                  background: "rgba(0,255,136,0.07)",
                  border: "1px solid rgba(0,255,136,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: "#e8edf2",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.03em",
                }}
              >
                {f.label}
              </h3>
              <p style={{ color: "#c0cad4", fontSize: "0.9rem", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-line" style={{ margin: "0 1.25rem" }} />

      {/* How a Session Works */}
<section
  style={{
    padding: "5rem 1.25rem",
    maxWidth: 1200,
    margin: "0 auto",
  }}
>
  <div style={{ textAlign: "center", marginBottom: "3rem" }}>
    <span
      className="badge badge-green"
      style={{
        marginBottom: "1rem",
        display: "inline-block",
      }}
    >
      HOW A SESSION WORKS
    </span>

    <h2
      style={{
        fontFamily: "Rajdhani, sans-serif",
        fontWeight: 700,
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        color: "#e8edf2",
        marginBottom: "0.75rem",
      }}
    >
      From Start to Session Report
    </h2>

    <p
      style={{
        color: "#c0cad4",
        maxWidth: 520,
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >
      Follow a simple safety workflow from camera setup
      to detailed post-session insights.
    </p>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1rem",
    }}
  >
    {[
      {
        number: "01",
        title: "Start Session",
        text: "Begin a new DriveGuard monitoring session.",
        icon: "▶",
      },
      {
        number: "02",
        title: "User Agreement",
        text: "Review and accept the camera and safety terms.",
        icon: "✓",
      },
      {
        number: "03",
        title: "Camera Check",
        text: "Allow camera access before monitoring begins.",
        icon: "◉",
      },
      {
        number: "04",
        title: "Live Monitoring",
        text: "AI monitors visual alertness indicators in real time.",
        icon: "◌",
      },
      {
        number: "05",
        title: "Safety Alert",
        text: "Receive a warning when drowsiness is detected.",
        icon: "!",
      },
      {
        number: "06",
        title: "Session Report",
        text: "Review your session statistics and alertness trends.",
        icon: "▥",
      },
    ].map((step) => (
      <div
        key={step.number}
        className="feature-card"
        style={{
          position: "relative",
          minHeight: 190,
          overflow: "hidden",
          background: "rgba(8, 16, 22, 0.48)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              color: "#00ff88",
              letterSpacing: "0.12em",
            }}
          >
            STEP {step.number}
          </span>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,255,136,0.08)",
              border: "1px solid rgba(0,255,136,0.18)",
              color: "#00ff88",
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 600,
            }}
          >
            {step.icon}
          </div>
        </div>

        <h3
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: "1.15rem",
            color: "#e8edf2",
            marginBottom: "0.6rem",
          }}
        >
          {step.title}
        </h3>

        <p
          style={{
            color: "#c0cad4",
            fontSize: "0.84rem",
            lineHeight: 1.6,
          }}
        >
          {step.text}
        </p>
      </div>
    ))}
  </div>
</section>

<div
  className="section-line"
  style={{ margin: "0 1.25rem" }}
/>

      {/* Purpose section */}
      <section style={{ padding: "5rem 1.25rem", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
          className="purpose-grid"
        >
          <div>
            <span className="badge badge-green" style={{ marginBottom: "1.25rem", display: "inline-block" }}>
              OUR PURPOSE
            </span>
            <h2
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                color: "#e8edf2",
                marginBottom: "1.25rem",
                lineHeight: 1.15,
              }}
            >
              Safer Roads Through Smarter{" "}
              <span style={{ color: "#00ff88" }}>AI Monitoring</span>
            </h2>
            <p
              style={{
                color: "#a0aab8",
                lineHeight: 1.75,
                fontSize: "1rem",
                maxWidth: 560,
                marginBottom: "1.5rem",
              }}
            >
              DriveGuard helps monitor driver alertness in real time using AI and computer
              vision. By tracking signs such as eye closure and reduced alertness, the system
              provides timely warnings and detailed session insights to encourage safer driving.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                maxWidth: 460,
              }}
            >
              {[
                { icon: "🎯", text: "Precision eye tracking at 30fps" },
                { icon: "⚡", text: "Sub-second drowsiness alerts" },
                { icon: "📊", text: "Full session analytics & insights" },
                { icon: "🔒", text: "Privacy-first, on-device processing" },
              ].map((item) => (
                <div
                  key={item.text}
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "flex-start",
                    padding: "0.75rem",
                    background: "rgba(8,16,22,0.48)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span style={{ fontSize: "0.82rem", color: "#a0aab8", lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                background: "rgba(8,16,22,0.58)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(0,255,136,0.18)",
                borderRadius: 20,
                padding: "2rem",
              }}
            >
              <div
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  color: "#c0cad4",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                Live Safety Dashboard Preview
              </div>

              {[
                { label: "Alertness Score", value: "94%", color: "#00ff88", bar: 94 },
                { label: "Eye Status", value: "OPEN", color: "#00ff88", bar: 100 },
                { label: "Risk Level", value: "LOW", color: "#00ff88", bar: 15 },
                { label: "Session Duration", value: "18:42", color: "#a0aab8", bar: null },
              ].map((row) => (
                <div key={row.label} style={{ marginBottom: "1.25rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span style={{ fontSize: "0.82rem", color: "#c0cad4" }}>{row.label}</span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: row.color,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                  {row.bar !== null && (
                    <div
                      style={{
                        height: 4,
                        background: "rgba(255,255,255,0.07)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${row.bar}%`,
                          background:
                            row.bar > 70
                              ? "linear-gradient(90deg,#00ff88,#00cc66)"
                              : row.bar > 40
                              ? "linear-gradient(90deg,#ff9f0a,#ff6b00)"
                              : "linear-gradient(90deg,#ff2d55,#cc0033)",
                          borderRadius: 2,
                          boxShadow: "0 0 8px rgba(0,255,136,0.4)",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}

              <Link to="/monitoring" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ width: "100%", textAlign: "center" }}>
                  Start AI Monitoring
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section
        style={{
          padding: "4rem 1.25rem 5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            background: "rgba(8,16,22,0.52)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0,255,136,0.22)",
            borderRadius: 24,
            padding: "3rem 2rem",
            boxShadow: "0 0 60px rgba(0,255,136,0.05)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
            className="float-anim"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="10" r="5" stroke="#00ff88" strokeWidth="1.8" />
              <circle cx="14" cy="10" r="2" fill="#00ff88" />
              <path d="M5 24c0-5 4-9 9-9s9 4 9 9" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              color: "#e8edf2",
              marginBottom: "0.75rem",
            }}
          >
            Ready to Drive Safer?
          </h2>
          <p style={{ color: "#c0cad4", marginBottom: "2rem", lineHeight: 1.6 }}>
            Start your first AI-monitored session now. No setup required.
          </p>
          <Link to="/monitoring" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ fontSize: "1.05rem", padding: "0.9rem 2.5rem" }}>
              Launch DriveGuard →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
<footer
  style={{
    marginTop: "2rem",
    borderTop: "1px solid rgba(0,255,136,0.1)",
    background: "rgba(5,8,10,0.8)",
    padding: "3rem 1.25rem 1.25rem",
  }}
>
  <div
    style={{
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
      gap: "2.5rem",
    }}
    className="footer-grid"
  >
    {/* Brand */}
    <div>
      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontWeight: 700,
          fontSize: "1.35rem",
          letterSpacing: "0.06em",
          color: "#e8edf2",
          marginBottom: "0.75rem",
        }}
      >
        Drive<span style={{ color: "#00ff88" }}>Guard</span>
        <span
          style={{
            color: "#4d6352",
            fontSize: "0.7rem",
            marginLeft: "0.4rem",
            letterSpacing: "0.12em",
          }}
        >
          AI
        </span>
      </div>

      <p
        style={{
          color: "#c0cad4",
          fontSize: "0.82rem",
          lineHeight: 1.7,
          maxWidth: 300,
          marginBottom: "1rem",
        }}
      >
        AI-powered driver monitoring designed to help identify
        signs of drowsiness and encourage safer driving.
      </p>

      <span className="badge badge-green">
        AI DRIVER SAFETY PLATFORM
      </span>
    </div>

    {/* Quick Links */}
    <div>
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.65rem",
          color: "#00ff88",
          letterSpacing: "0.12em",
          marginBottom: "1rem",
        }}
      >
        QUICK LINKS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <Link
          to="/"
          style={{
            color: "#c0cad4",
            textDecoration: "none",
            fontSize: "0.82rem",
          }}
        >
          Home
        </Link>

        <Link
          to="/about"
          style={{
            color: "#c0cad4",
            textDecoration: "none",
            fontSize: "0.82rem",
          }}
        >
          About
        </Link>

        <Link
          to="/contact"
          style={{
            color: "#c0cad4",
            textDecoration: "none",
            fontSize: "0.82rem",
          }}
        >
          Contact
        </Link>
      </div>
    </div>

    {/* Safety */}
    <div>
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.65rem",
          color: "#00ff88",
          letterSpacing: "0.12em",
          marginBottom: "1rem",
        }}
      >
        SAFETY
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <Link
  to="/user-agreement"
  style={{
    color: "#c0cad4",
    fontSize: "0.82rem",
    textDecoration: "none",
  }}
>
  User Agreement
</Link>

        <Link
  to="/privacy-camera-safety"
  style={{
    color: "#c0cad4",
    fontSize: "0.82rem",
    textDecoration: "none",
  }}
>
  Privacy & Camera Safety
</Link>

        <span
          style={{
            color: "#c0cad4",
            fontSize: "0.82rem",
          }}
        >
          Responsible Driving
        </span>
      </div>
    </div>

    {/* AI Assistant */}
    <div>
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.65rem",
          color: "#00ff88",
          letterSpacing: "0.12em",
          marginBottom: "1rem",
        }}
      >
        AI ASSISTANT
      </div>

      <p
        style={{
          color: "#c0cad4",
          fontSize: "0.82rem",
          lineHeight: 1.6,
          marginBottom: "0.9rem",
        }}
      >
        Have questions about DriveGuard?
        Ask our AI assistant.
      </p>

      <Link
        to="/ask-driveguard-ai"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "#00ff88",
          textDecoration: "none",
          fontFamily: "Rajdhani, sans-serif",
          fontWeight: 600,
          fontSize: "0.85rem",
          letterSpacing: "0.04em",
        }}
      >
        Ask DriveGuard AI →
      </Link>
    </div>
  </div>

  {/* Bottom */}
  <div
    style={{
      maxWidth: 1200,
      margin: "2.5rem auto 0",
      paddingTop: "1.25rem",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
      flexWrap: "wrap",
    }}
  >
    <span
      style={{
        color: "#3d4a57",
        fontSize: "0.7rem",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      © 2026 DriveGuard AI · All rights reserved
    </span>

    <span
      style={{
        color: "#3d4a57",
        fontSize: "0.68rem",
        fontFamily: "JetBrains Mono, monospace",
        textAlign: "right",
      }}
    >
      AI assistance does not replace safe driving decisions.
    </span>
  </div>

  <style>{`
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 2rem !important;
      }
    }

    @media (max-width: 480px) {
      .footer-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `}</style>
</footer>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
          .purpose-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .mini-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
    </div>
  );
}

function AIDriverVisual() {
  return (
    <div
      style={{
        width: "min(380px, 100%)",
        aspectRatio: "1/1.1",
        position: "relative",
      }}
      className="float-anim"
    >
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(0,255,136,0.12)",
        }}
        className="spin-slow"
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              background: "#00ff88",
              borderRadius: "50%",
              top: deg === 0 ? 0 : deg === 180 ? "calc(100% - 8px)" : "calc(50% - 4px)",
              left:
                deg === 90
                  ? "calc(100% - 8px)"
                  : deg === 270
                  ? 0
                  : "calc(50% - 4px)",
              boxShadow: "0 0 8px #00ff88",
              transform:
                deg === 0 || deg === 180
                  ? "translateX(-50%)"
                  : "translateY(-50%)",
            }}
          />
        ))}
      </div>

      {/* Main camera frame */}
      <div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: 24,
          background:
            "linear-gradient(160deg, rgba(16,28,22,0.95) 0%, rgba(8,12,10,0.98) 100%)",
          border: "1px solid rgba(0,255,136,0.2)",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,255,136,0.08), inset 0 0 30px rgba(0,255,136,0.03)",
        }}
      >
        {/* Scanning line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,136,0.7), transparent)",
            boxShadow: "0 0 10px rgba(0,255,136,0.5)",
            zIndex: 10,
          }}
          className="scan-line"
        />

        {/* Grid overlay */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          className="ai-grid"
        >
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="rgba(0,255,136,0.06)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Face silhouette */}
        <svg
          viewBox="0 0 200 240"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            height: "70%",
          }}
        >
          {/* Head */}
          <ellipse cx="100" cy="110" rx="55" ry="70" fill="none" stroke="rgba(0,255,136,0.25)" strokeWidth="1" strokeDasharray="4 3" />
          {/* Face detection box */}
          <rect x="38" y="40" width="124" height="140" rx="8" fill="none" stroke="rgba(0,255,136,0.4)" strokeWidth="1.5" />
          {/* Corner brackets */}
          <path d="M38 58 L38 40 L56 40" stroke="#00ff88" strokeWidth="2" fill="none" />
          <path d="M162 58 L162 40 L144 40" stroke="#00ff88" strokeWidth="2" fill="none" />
          <path d="M38 162 L38 180 L56 180" stroke="#00ff88" strokeWidth="2" fill="none" />
          <path d="M162 162 L162 180 L144 180" stroke="#00ff88" strokeWidth="2" fill="none" />
          {/* Left eye area */}
          <rect x="55" y="88" width="36" height="18" rx="4" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.5)" strokeWidth="1.5">
            <animate attributeName="ry" values="4;1;4" dur="4s" repeatCount="indefinite" />
          </rect>
          <circle cx="73" cy="97" r="4" fill="rgba(0,255,136,0.7)" />
          <circle cx="73" cy="97" r="2" fill="#00ff88" />
          {/* Right eye area */}
          <rect x="109" y="88" width="36" height="18" rx="4" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.5)" strokeWidth="1.5">
            <animate attributeName="ry" values="4;1;4" dur="4s" begin="0.2s" repeatCount="indefinite" />
          </rect>
          <circle cx="127" cy="97" r="4" fill="rgba(0,255,136,0.7)" />
          <circle cx="127" cy="97" r="2" fill="#00ff88" />
          {/* Nose */}
          <path d="M95 108 L100 122 L105 108" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Mouth */}
          <path d="M82 138 Q100 148 118 138" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinecap="round" />
          {/* Tracking dots */}
          {[[73, 78], [127, 78], [100, 108], [82, 138], [118, 138], [62, 102], [138, 102]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.5" fill="rgba(0,255,136,0.6)">
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        {/* Labels */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              background: "#00ff88",
              borderRadius: "50%",
              boxShadow: "0 0 6px #00ff88",
            }}
            className="live-dot"
          />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              color: "#00ff88",
              letterSpacing: "0.1em",
            }}
          >
            LIVE
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6rem",
            color: "rgba(0,255,136,0.6)",
          }}
        >
          FACE DETECTED
        </div>

        {/* Bottom stats */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {[
            ["ALERTNESS", "94%"],
            ["EYE", "OPEN"],
            ["RISK", "LOW"],
          ].map(([k, v]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.55rem",
                  color: "#4d6352",
                  letterSpacing: "0.08em",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.72rem",
                  color: "#00ff88",
                  fontWeight: 600,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

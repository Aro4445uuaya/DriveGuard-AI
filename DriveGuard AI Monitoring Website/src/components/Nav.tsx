import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/user-agreement", label: "User Agreement" },
    
    { to: "/ask-driveguard-ai", label: "Ask DriveGuard AI" },
  ];

  const isActive = (to: string) =>
    to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: "rgba(8,11,14,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,255,136,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.25rem",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              
              
            >
              <img
  src="/image.png"
  alt="DriveGuard"
  style={{
    width: 80,
    height: 80,
    objectFit: "contain",
  }}
/>
            </div>
            <span
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "2.0rem",
                color: "#e8edf2",
                letterSpacing: "0.06em",
              }}
            >
              Drive<span style={{ color: "#00ff88" }}>Guard</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  textDecoration: "none",
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                  color: isActive(l.to) ? "#00ff88" : "#a0aab8",
                  transition: "color 0.2s",
                  textTransform: "uppercase",
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/monitoring" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
                Get Started
              </button>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.4rem",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#00ff88",
                  borderRadius: 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="nav-overlay">
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 18,
              right: 20,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7a8d",
              fontSize: "1.6rem",
              lineHeight: 1,
            }}
          >
            ×
          </button>
          <div
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#e8edf2",
              letterSpacing: "0.06em",
              marginBottom: "1rem",
            }}
          >
            Drive<span style={{ color: "#00ff88" }}>Guard</span>
          </div>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: "none",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "1.8rem",
                letterSpacing: "0.08em",
                color: isActive(l.to) ? "#00ff88" : "#a0aab8",
                textTransform: "uppercase",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/monitoring" onClick={() => setOpen(false)} style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ marginTop: "0.5rem", fontSize: "1.1rem", padding: "0.9rem 2.5rem" }}>
              Get Started
            </button>
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}

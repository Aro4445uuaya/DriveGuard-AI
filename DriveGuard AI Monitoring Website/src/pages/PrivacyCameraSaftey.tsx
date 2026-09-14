import Nav from "../components/Nav";

export default function PrivacyCameraSafety() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "#e8edf2",
      }}
    >
      <Nav />

      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <div
          style={{
            color: "#00ff88",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            marginBottom: "1rem",
          }}
        >
          SAFETY
        </div>

        <h1
          style={{
            fontSize: "2.8rem",
            marginBottom: "1.5rem",
          }}
        >
          Privacy & Camera Safety
        </h1>

        <p
          style={{
            color: "#a0aab8",
            lineHeight: 1.8,
          }}
        >
          DriveGuard uses camera-based monitoring to help detect signs of
          driver drowsiness. Camera access is used only for the monitoring
          experience and should be handled responsibly.
        </p>
      </main>
    </div>
  );
}
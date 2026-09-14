import { useState } from "react";
import { Link } from "react-router-dom";

export default function EmergencyContact() {
  const [name, setName] = useState(
    localStorage.getItem("driveguard_emergency_name") || ""
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("driveguard_emergency_phone") || ""
  );

  const saveContact = () => {
    localStorage.setItem("driveguard_emergency_name", name);
    localStorage.setItem("driveguard_emergency_phone", phone);

    alert("Emergency contact saved successfully.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          paddingTop: "4rem",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#00ff88",
            textDecoration: "none",
          }}
        >
          ← Back to Home
        </Link>

        <div
          style={{
            marginTop: "2rem",
            padding: "2rem",
            background: "#101714",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: 18,
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              marginTop: 0,
              marginBottom: "0.5rem",
            }}
          >
            Emergency Contact
          </h1>

          <p
            style={{
              color: "#9aa9a2",
              marginBottom: "1.75rem",
            }}
          >
            Save a trusted contact for emergency alerts.
          </p>

          <input
            type="text"
            placeholder="Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.9rem",
              marginBottom: "1rem",
              borderRadius: 8,
              border: "1px solid #33433c",
              background: "#0b100e",
              color: "#ffffff",
              boxSizing: "border-box",
            }}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "0.9rem",
              marginBottom: "1.25rem",
              borderRadius: 8,
              border: "1px solid #33433c",
              background: "#0b100e",
              color: "#ffffff",
              boxSizing: "border-box",
            }}
          />

          <button
            className="btn-primary"
            onClick={saveContact}
            style={{
              width: "100%",
              padding: "0.9rem",
            }}
          >
            Save Emergency Contact
          </button>
        </div>
      </div>
    </div>
  );
}
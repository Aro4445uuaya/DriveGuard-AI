import { useEffect, useState } from "react";
import {
  enableMotionSensor,
  isMotionSensorEnabled,
} from "../Motionsensor";
import { getMotionData } from "../Motionsensor";

export default function AccidentTest() {
  const [motion, setMotion] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [rotation, setRotation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

const [permission, setPermission] = useState(
  isMotionSensorEnabled() ? "GRANTED" : "NOT REQUESTED"
);

  const requestMotionPermission = async () => {
  const enabled = await enableMotionSensor();

  if (enabled) {
    setPermission("GRANTED");
  } else {
    setPermission("DENIED");
  }
};
 
 useEffect(() => {
  const interval = window.setInterval(() => {
    const data = getMotionData();

    setMotion({
      x: data.x,
      y: data.y,
      z: data.z,
    });
  }, 100);

  return () => {
    window.clearInterval(interval);
  };
}, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "#e8edf2",
        padding: "2rem 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "2rem",
            marginBottom: "0.5rem",
          }}
        >
          Accident Sensor <span style={{ color: "#00ff88" }}>Test</span>
        </h1>

        <p
          style={{
            color: "#6b7a8d",
            marginBottom: "1.5rem",
          }}
        >
          DriveGuard device motion sensor testing
        </p>

        <button
          className="btn-primary"
          onClick={requestMotionPermission}
          style={{
            marginBottom: "1.5rem",
          }}
        >
          Enable Motion Sensors
        </button>

        <div
          className="stat-card"
          style={{
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              color: "#4d6352",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            SENSOR STATUS
          </div>

          <div
            style={{
              color:
                permission === "GRANTED"
                  ? "#00ff88"
                  : permission === "DENIED"
                  ? "#ff2d55"
                  : "#ff9f0a",
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 600,
            }}
          >
            {permission}
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              color: "#4d6352",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            ACCELEROMETER
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
            }}
          >
            <SensorValue label="X" value={motion.x} />
            <SensorValue label="Y" value={motion.y} />
            <SensorValue label="Z" value={motion.z} />
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              color: "#4d6352",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            GYROSCOPE / ORIENTATION
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
            }}
          >
            <SensorValue label="ALPHA" value={rotation.alpha} />
            <SensorValue label="BETA" value={rotation.beta} />
            <SensorValue label="GAMMA" value={rotation.gamma} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SensorValue({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(0,255,136,0.08)",
        borderRadius: 10,
        padding: "0.9rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.6rem",
          color: "#4d6352",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "1rem",
          color: "#00ff88",
          fontWeight: 600,
        }}
      >
        {value.toFixed(2)}
      </div>
    </div>
  );
}
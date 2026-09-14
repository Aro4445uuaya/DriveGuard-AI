import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { SessionData } from "../App";
import {
  FaceDetector,
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import {
  enableMotionSensor,
  getAccelerationMagnitude,
} from "../Motionsensor";

interface Props {
  onSessionEnd: (d: SessionData) => void;
}

function fmt(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function eyeAspectRatio(points: any[]) {
  if (!points || points.length < 6) return 1;

  const vertical1 = Math.hypot(
    points[1].x - points[5].x,
    points[1].y - points[5].y
  );

  const vertical2 = Math.hypot(
    points[2].x - points[4].x,
    points[2].y - points[4].y
  );

  const horizontal = Math.hypot(
    points[0].x - points[3].x,
    points[0].y - points[3].y
  );

  return (vertical1 + vertical2) / (2 * horizontal);
}

export default function Monitoring({ onSessionEnd }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const alertAudioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const previousEyeOpenRef = useRef(true);
  const eyeClosedSinceRef = useRef<number | null>(null);
  const headPositionRef = useRef<"FORWARD" | "LEFT" | "RIGHT" | "DOWN">("FORWARD");
  const [headPosition, setHeadPosition] = useState<
  "FORWARD" | "LEFT" | "RIGHT" | "DOWN"
  >("FORWARD");
  const drowsinessAlertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  

  useEffect(() => {
  const initFaceDetector = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
  "/wasm"
);

      const detector = await FaceDetector.createFromOptions(
  vision,
  {
    baseOptions: {
      modelAssetPath: "/models/blaze_face_short_range.tflite",
    },
    runningMode: "VIDEO",
  }
);

      faceDetectorRef.current = detector;
      console.log("Face detector initialized");
    } catch (error) {
      console.error("Face detector initialization failed:", error);
    }
  };

  initFaceDetector();
}, []);

useEffect(() => {
  const initFaceLandmarker = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks("/wasm");

      const landmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );

      faceLandmarkerRef.current = landmarker;

      console.log("Face landmarker initialized");
    } catch (error) {
      console.error("Face landmarker initialization failed:", error);
    }
  };

  initFaceLandmarker();
}, []);

useEffect(() => {
  let stopped = false;
  let animationId: number;
  let lastDetectionTime = 0;

  const detectFace = (time: number) => {
    if (stopped) return;

    const video = videoRef.current;
    const detector = faceDetectorRef.current;
    const landmarker = faceLandmarkerRef.current;

    if (!video || !detector || !landmarker || video.readyState < 2) {
      animationId = requestAnimationFrame(detectFace);
      return;
    }

    // Run AI detection only ~30 times per second
    if (time - lastDetectionTime < 33) {
      animationId = requestAnimationFrame(detectFace);
      return;
    }

    lastDetectionTime = time;

    try {
      const result = detector.detectForVideo(video, time);
      const landmarkResult = landmarker.detectForVideo(video, time);

      // Face mesh
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (canvas && ctx) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

const scale = Math.max(
  canvas.width / video.videoWidth,
  canvas.height / video.videoHeight
);

const drawWidth = video.videoWidth * scale;
const drawHeight = video.videoHeight * scale;

const offsetX = (canvas.width - drawWidth) / 2;
const offsetY = (canvas.height - drawHeight) / 2;

ctx.save();
ctx.translate(offsetX, offsetY);
ctx.scale(scale, scale);

        if (landmarkResult.faceLandmarks.length > 0) {
          const drawingUtils = new DrawingUtils(ctx);

          drawingUtils.drawConnectors(
            landmarkResult.faceLandmarks[0],
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            {
              color: "#fffcfc",
              lineWidth: 0.6,
            }
          );
        }
        ctx.restore();
      }

      // Eye detection
      if (landmarkResult.faceLandmarks.length > 0) {
        const face = landmarkResult.faceLandmarks[0];
        
        const nose = face[1];
const leftCheek = face[234];
const rightCheek = face[454];
const chin = face[152];
const forehead = face[10];

const faceCenterX = (leftCheek.x + rightCheek.x) / 2;
const faceCenterY = (forehead.y + chin.y) / 2;

const horizontalOffset = nose.x - faceCenterX;
const verticalOffset = nose.y - faceCenterY;

let currentHeadPosition: "FORWARD" | "LEFT" | "RIGHT" | "DOWN" = "FORWARD";

// DOWN first — works better even when the driver is far from camera
if (verticalOffset > 0.035) {
  currentHeadPosition = "DOWN";
} else if (horizontalOffset < -0.035) {
  currentHeadPosition = "LEFT";
} else if (horizontalOffset > 0.035) {
  currentHeadPosition = "RIGHT";
}

if (currentHeadPosition !== headPositionRef.current) {
  headPositionRef.current = currentHeadPosition;
  setHeadPosition(currentHeadPosition);
}

        const leftEye = [
          face[33],
          face[160],
          face[158],
          face[133],
          face[153],
          face[144],
        ];

        const rightEye = [
          face[362],
          face[385],
          face[387],
          face[263],
          face[373],
          face[380],
        ];

        const leftEAR = eyeAspectRatio(leftEye);
        const rightEAR = eyeAspectRatio(rightEye);

        const averageEAR = (leftEAR + rightEAR) / 2;
       let currentEyeOpen = previousEyeOpenRef.current;

if (previousEyeOpenRef.current) {
  if (averageEAR < 0.18) currentEyeOpen = false;
} else {
  if (averageEAR > 0.21) currentEyeOpen = true;
}

        setEyeOpen(currentEyeOpen);

        if (currentEyeOpen) {
  setAlertness((a) => Math.min(100, a + 0.5));
  alertnessRef.current = Math.min(100, alertnessRef.current + 0.5);
} else {
  setAlertness((a) => Math.max(0, a - 2));
  alertnessRef.current = Math.max(0, alertnessRef.current - 2);
}

        if (!currentEyeOpen) {
          if (eyeClosedSinceRef.current === null) {
            eyeClosedSinceRef.current = performance.now();
          } else {
            const closedTime =
              performance.now() - eyeClosedSinceRef.current;

            if (closedTime >= 1000) {
              triggerDrowsiness();
              eyeClosedSinceRef.current = null;
            }
          }
        } else {
          eyeClosedSinceRef.current = null;
        }

        // Blink detection
        if (!previousEyeOpenRef.current && currentEyeOpen) {
          setBlinkCount((b) => b + 1);
        }

        previousEyeOpenRef.current = currentEyeOpen;
      }

      // Face box
      if (result.detections.length > 0) {
        setFaceDetected(true);

        const box = result.detections[0].boundingBox;

        if (box && video.videoWidth && video.videoHeight) {
          setFaceBox({
            x: (box.originX / video.videoWidth) * 100,
            y: (box.originY / video.videoHeight) * 100,
            width: (box.width / video.videoWidth) * 100,
            height: (box.height / video.videoHeight) * 100,
          });
        }
      } else {
        setFaceDetected(false);
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }

    if (!stopped) {
      animationId = requestAnimationFrame(detectFace);
    }
  };

  animationId = requestAnimationFrame(detectFace);

  return () => {
    stopped = true;
    cancelAnimationFrame(animationId);
  };
}, []);

   useEffect(() => {
  let stream: MediaStream;

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

     if (videoRef.current) {
  videoRef.current.srcObject = stream;

  videoRef.current.onloadedmetadata = () => {
    videoRef.current?.play().catch((error) => {
      console.error("Video play failed:", error);
    });
  };
}
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  startCamera();

  return () => {
    stream?.getTracks().forEach((track) => track.stop());
  };
}, []);



  const navigate = useNavigate();
  const startRef = useRef<Date>(new Date());
  const [elapsed, setElapsed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [emergencyContactName, setEmergencyContactName] = useState("");
const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [accidentDetected, setAccidentDetected] = useState(false);
  const [showAccidentCheck, setShowAccidentCheck] = useState(false);
const [accidentCountdown, setAccidentCountdown] = useState(10);
  useEffect(() => {
  if (acceleration > 40 && !accidentDetected) {
    setAccidentDetected(true);
    setShowAccidentCheck(true);
    console.log("POSSIBLE IMPACT DETECTED", acceleration);
  }
}, [acceleration, accidentDetected]);

useEffect(() => {
  if (!showAccidentCheck) return;

  setAccidentCountdown(10);

  const timer = window.setInterval(() => {
    setAccidentCountdown((count) => {
      if (count <= 1) {
        window.clearInterval(timer);
        
        handleEmergencyTimeout();
        setShowAccidentCheck(false);
        setAccidentDetected(false);
        return 0;
      }

      return count - 1;
    });
  }, 1000);

  return () => {
    window.clearInterval(timer);
  };
}, [showAccidentCheck]);



useEffect(() => {
  enableMotionSensor();

  const interval = window.setInterval(() => {
    setAcceleration(getAccelerationMagnitude());
  }, 100);

  return () => {
    window.clearInterval(interval);
  };
}, []);

  const [alertness, setAlertness] = useState(92);
  const [eyeOpen, setEyeOpen] = useState(true);
  const [LeftEyeOpen, setLeftEyeOpen] = useState(true);
  const [RightEyeOpen, setRightEyeOpen] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceBox, setFaceBox] = useState({
  x: 25,
  y: 18,
  width: 50,
  height: 55,
});
  const [blinkCount, setBlinkCount] = useState(0);
  const [drowsinessEvents, setDrowsinessEvents] = useState(0);
  const [alertnessHistory, setAlertnessHistory] = useState<{ t: number; v: number }[]>([
    { t: 0, v: 92 },
  ]);
  const [isDrowsy, setIsDrowsy] = useState(false);
  const [timeAlert, setTimeAlert] = useState(0);
  const [timeCaution, setTimeCaution] = useState(0);
  const [timeHighRisk, setTimeHighRisk] = useState(0);
  const minAlertnessRef = useRef(92);
  const alertnessRef = useRef(92);

  const riskLevel: "LOW" | "MEDIUM" | "HIGH" =
    alertness >= 80 ? "LOW" : alertness >= 60 ? "MEDIUM" : "HIGH";

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
      // Track time buckets
      const a = alertnessRef.current;
      if (a >= 80) setTimeAlert((t) => t + 1);
      else if (a >= 60) setTimeCaution((t) => t + 1);
      else setTimeHighRisk((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isDrowsy]);

  useEffect(() => {
   const savedName = localStorage.getItem("driveguard_emergency_name");
   const savedPhone = localStorage.getItem("driveguard_emergency_phone");

   if (savedName) {
    setEmergencyContactName(savedName);
   }

   if (savedPhone) {
    setEmergencyContactPhone(savedPhone);
  }
}, []);

  // Push to history every 5s
  useEffect(() => {
    if (elapsed > 0 && elapsed % 5 === 0) {
      setAlertnessHistory((h) => [...h, { t: elapsed, v: Math.round(alertnessRef.current) }]);
    }
  }, [elapsed]);

  

 const triggerDrowsiness = useCallback(() => {
  alertAudioRef.current?.play().catch((error) => {
    console.error("Alert audio playback failed:", error);
  });

  setIsDrowsy(true);
  setDrowsinessEvents((d) => d + 1);
  setAlertness(38);
  alertnessRef.current = 38;

  if (drowsinessAlertTimerRef.current) {
    clearTimeout(drowsinessAlertTimerRef.current);
  }

  drowsinessAlertTimerRef.current = setTimeout(() => {
    setIsDrowsy(false);
  }, 5000);
}, []);


  const dismissAlert = () => {
    setIsDrowsy(false);
    setAlertness(78);
    alertnessRef.current = 78;
  };

  const handleEndSession = () => {
  console.time("SESSION END");

  const endTime = new Date();

  const data: SessionData = {
    startTime: startRef.current,
    endTime,
    durationSeconds: elapsed,
    avgAlertness: Math.round(
      alertnessHistory.reduce((s, h) => s + h.v, 0) /
        Math.max(1, alertnessHistory.length)
    ),
    minAlertness: Math.round(minAlertnessRef.current),
    blinkCount,
    drowsinessEvents,
    riskLevel: drowsinessEvents > 0 ? "HIGH" : riskLevel,
    alertnessHistory,
    timeAlert,
    timeCaution,
    timeHighRisk,
  };

  onSessionEnd(data);

  console.timeLog("SESSION END", "before navigate");

  navigate("/session");
};

  const alertColor =
    alertness >= 80 ? "#00ff88" : alertness >= 60 ? "#ff9f0a" : "#ff2d55";

    const saveEmergencyContact = () => {
  localStorage.setItem(
    "driveguard_emergency_name",
    emergencyContactName
  );

  localStorage.setItem(
    "driveguard_emergency_phone",
    emergencyContactPhone
  );

  alert("Emergency contact saved successfully.");
};

const handleEmergencyTimeout = async () => {
  const savedName = localStorage.getItem("driveguard_emergency_name");
  const savedPhone = localStorage.getItem("driveguard_emergency_phone");

  if (!savedName || !savedPhone) {
    alert("No emergency contact saved.");
    return;
  }

  const message =
    " DriveGuard Emergency Alert: A possible accident was detected. Please check on them immediately.";

  try {
    const response = await fetch("/api/emergency", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: savedName,
        phone: savedPhone,
        message,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(`Emergency request sent for ${savedName}.`);
    }
  } catch (error) {
    console.error("Emergency request failed:", error);
    alert("Could not connect to DriveGuard emergency server.");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        paddingBottom: "2rem",
      }}
    >

    

{showAccidentCheck && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      background: "rgba(0,0,0,0.88)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        background: "#101714",
        border: "1px solid rgba(255,45,85,0.45)",
        borderRadius: 18,
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#ff2d55",
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}
      >
        ⚠️ POSSIBLE ACCIDENT DETECTED
      </div>

      <div style={{ color: "#d7e2dc", marginBottom: "1.5rem" }}>
        Are you OK?
      </div>

      <div
        style={{
          fontSize: "4rem",
          fontWeight: 800,
          color: "#00ff88",
          fontFamily: "JetBrains Mono, monospace",
          marginBottom: "1.5rem",
        }}
      >
        {accidentCountdown}
      </div>

      <button
        className="btn-primary"
        onClick={() => {
          setShowAccidentCheck(false);
          setAccidentDetected(false);
        }}
        style={{
          width: "100%",
          padding: "0.9rem",
        }}
      >
        I'M OK
      </button>
    </div>
  </div>
)}


      <audio
      ref={alertAudioRef}
      src="/audio/beep-13.mp3"
      preload="auto"
      />

      {/* Header */}
      <div
        style={{
          background: "rgba(8,11,14,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,255,136,0.1)",
          padding: "0 1.25rem",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#e8edf2", letterSpacing: "0.06em" }}>
            Drive<span style={{ color: "#00ff88" }}>Guard</span>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 8, height: 8, background: "#00ff88", borderRadius: "50%", boxShadow: "0 0 8px #00ff88" }} className="live-dot" />
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#00ff88", letterSpacing: "0.1em" }}>
            MONITORING ACTIVE
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.25rem" }}>
        {/* Drowsiness Alert Overlay */}
        {isDrowsy && (
          <div
            style={{
              marginBottom: "1.25rem",
              background: "rgba(255,45,85,0.1)",
              border: "1px solid rgba(255,45,85,0.4)",
              borderRadius: 16,
              padding: "1.5rem",
              textAlign: "center",
            }}
            className="alert-pulse"
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⚠️</div>
            <div
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#ff2d55",
                letterSpacing: "0.08em",
                marginBottom: "0.5rem",
              }}
              className="glow-red"
            >
              DROWSINESS DETECTED!
            </div>
            <p style={{ color: "#ffb3c0", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.25rem", maxWidth: 440, margin: "0 auto 1.25rem" }}>
              Your eyes appear to have been closed for too long. Please stay alert and consider taking a break.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={dismissAlert}>
                ✓ I'm Alert
              </button>
              <button className="btn-danger" onClick={handleEndSession}>
                End Session
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: "1.25rem" }} className="monitoring-grid">
          {/* Camera column */}
          <div>
            {/* Camera feed */}
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: isDrowsy ? "1px solid rgba(255,45,85,0.4)" : "1px solid rgba(0,255,136,0.2)",
                background: "#050a08",
                position: "relative",
                aspectRatio: "0.8/0.7",
                boxShadow: isDrowsy
                  ? "0 0 30px rgba(255,45,85,0.15)"
                  : "0 0 30px rgba(0,255,136,0.07)",
                marginBottom: "1.25rem",
              }}
            >
              {/* Scan line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: isDrowsy
                    ? "linear-gradient(90deg, transparent, rgba(255,45,85,0.8), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(0,255,136,0.8), transparent)",
                  boxShadow: isDrowsy ? "0 0 10px rgba(255,45,85,0.6)" : "0 0 10px rgba(0,255,136,0.5)",
                  zIndex: 10,
                }}
                className="scan-line"
              />

              {/* Grid */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} className="ai-grid">
                <defs>
                  <pattern id="cgrid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(0,255,136,0.05)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cgrid)" />
              </svg>

{/* Face visualization */}
<video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "16px",
  }}
/>

<canvas
  ref={canvasRef}
  style={{
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    pointerEvents: "none",
    zIndex: 5,
  }}
/>

<div
  style={{
    position: "absolute",
    top: `${faceBox.y}%`,
    left: `${faceBox.x}%`,
    width: `${faceBox.width}%`,
    height: `${faceBox.height}%`,
    border: `2px solid ${isDrowsy ? "#ff2d55" : "#cee6db"}`,
    borderRadius: "18px",
    boxShadow: `0 0 18px ${isDrowsy ? "#ff2d55" : "#e9f0ed"}`,
    pointerEvents: "none",
    transition: "all 0.3s ease",
  }}
>
  <span
    style={{
      position: "absolute",
      top: "-12px",
      left: "12px",
      background: isDrowsy ? "#ff2d55" : "#f6f6f6",
      color: "#050a08",
      padding: "3px 8px",
      borderRadius: "4px",
      fontSize: "10px",
      fontFamily: "JetBrains Mono, monospace",
      fontWeight: 700,
    }}
  >
   {isDrowsy ? "DROWSY" : faceDetected ? " DETECTED" : "NO FACE DETECTED"}
  </span>
</div>


              {/* LIVE badge */}
              <div style={{ position: "absolute", top: 12, left: 14, display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    background: isDrowsy ? "#fb022f" : "#ff0000",
                    borderRadius: "50%",
                    boxShadow: isDrowsy ? "0 0 8px #ff002f" : "0 0 8px #ff0404",
                  }}
                  className="live-dot"
                />
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: isDrowsy ? "#ff2d55" : "#ff0101", letterSpacing: "0.12em" }}>
                  LIVE
                </span>
              </div>

              {/* Timer */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(0,0,0,0.5)",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {fmt(elapsed)}
              </div>

              {/* Bottom overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(5,10,8,0.9))",
                  padding: "1.5rem 1rem 0.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "rgba(0,255,136,0.5)", letterSpacing: "0.1em" }}>
                    CAMERA ACTIVE
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", color: "#00ff88", fontWeight: 600, letterSpacing: "0.08em" }}>
                    {fmt(elapsed)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: isDrowsy ? "rgba(255,45,85,0.6)" : "rgba(0,255,136,0.5)", letterSpacing: "0.1em" }}>
                    {isDrowsy ? "DROWSY DETECTED" : faceDetected ? "FACE DETECTED" : "NO FACE"}
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: isDrowsy ? "#ff2d55" : "#00ff88", fontWeight: 500 }}>
                    {isDrowsy ? "⚠ WARNING" : "✓ MONITORING"}
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Active card */}
            <div className="stat-card" style={{ marginBottom: "1.25rem", textAlign: "center", padding: "1.25rem" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
                TOTAL CAMERA ACTIVE TIME
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "2rem", color: "#00ff88", fontWeight: 600, letterSpacing: "0.08em", textShadow: "0 0 20px rgba(0,255,136,0.4)" }}>
                {fmt(elapsed)}
              </div>
            </div>

            {/* Alertness score big */}
            <div
              className="glass"
              style={{
                padding: "1.5rem",
                textAlign: "center",
                borderColor: isDrowsy ? "rgba(255,45,85,0.3)" : "rgba(0,255,136,0.15)",
              }}
            >
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
                ALERTNESS SCORE
              </div>
              <div
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontWeight: 700,
                  fontSize: "4rem",
                  color: alertColor,
                  lineHeight: 1,
                  textShadow: `0 0 30px ${alertColor}66`,
                  letterSpacing: "-0.02em",
                }}
              >
                {alertness}%
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3, margin: "1rem 0 0.5rem", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${alertness}%`,
                    background: `linear-gradient(90deg, ${alertColor}cc, ${alertColor})`,
                    borderRadius: 3,
                    boxShadow: `0 0 12px ${alertColor}88`,
                    transition: "width 0.5s ease, background 0.5s ease",
                  }}
                />
              </div>
              <span className={`badge ${isDrowsy ? "badge-red" : alertness >= 80 ? "badge-green" : "badge-amber"}`}>
                {isDrowsy ? "DROWSY" : alertness >= 80 ? "ALERT" : alertness >= 60 ? "CAUTION" : "HIGH RISK"}
              </span>
            </div>

            {/* Demo alert button */}
            {!isDrowsy && (
              <button
                onClick={triggerDrowsiness}
                style={{
                  width: "100%",
                  background: "rgba(255,45,85,0.06)",
                  border: "1px solid rgba(255,45,85,0.2)",
                  borderRadius: 8,
                  padding: "0.6rem",
                  color: "rgba(255,45,85,0.5)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  marginBottom: "1.25rem",
                  transition: "all 0.2s",
                }}
              >
                [ SIMULATE DROWSINESS ALERT ]
              </button>
            )}
          </div>

          {/* Stats column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            
            {/* Driver Head Movement */}
<div
  className="glass"
  style={{
    padding: "1.25rem",
    marginBottom: "0.75rem",
    textAlign: "center",
    overflow: "hidden",
  }}
>
  <div
    style={{
      fontFamily: "JetBrains Mono, monospace",
      fontSize: "0.62rem",
      color: "#4d6352",
      letterSpacing: "0.12em",
      marginBottom: "0.75rem",
    }}
  >
    DRIVER HEAD MOVEMENT
  </div>

  {/* Movement Area */}
  <div
    style={{
      position: "relative",
      width: "100%",
      height: 150,
      maxWidth: 500,
      margin: "0 auto",
    }}
  >
    {/* Horizontal movement line */}
    <div
      style={{
        position: "absolute",
        left: "8%",
        right: "8%",
        top: "50%",
        height: 2,
        background: "rgba(0,255,136,0.25)",
        boxShadow: "0 0 8px rgba(0,255,136,0.15)",
      }}
    />

    {/* Down movement line */}
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        bottom: "8%",
        width: 2,
        background: "rgba(0,255,136,0.25)",
        boxShadow: "0 0 8px rgba(0,255,136,0.15)",
      }}
    />

    {/* LEFT point */}
    <div
      style={{
        position: "absolute",
        left: "8%",
        top: "50%",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "#00ff88",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 0 10px rgba(0,255,136,0.6)",
      }}
    />

    {/* RIGHT point */}
    <div
      style={{
        position: "absolute",
        right: "8%",
        top: "50%",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "#00ff88",
        transform: "translate(50%, -50%)",
        boxShadow: "0 0 10px rgba(0,255,136,0.6)",
      }}
    />

    {/* DOWN point */}
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "8%",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "#00ff88",
        transform: "translate(-50%, 50%)",
        boxShadow: "0 0 10px rgba(0,255,136,0.6)",
      }}
    />

    {/* Animated Head */}
    <div
      style={{
        position: "absolute",

        left:
          headPosition === "LEFT"
            ? "8%"
            : headPosition === "RIGHT"
            ? "92%"
            : "50%",

        top:
          headPosition === "FORWARD"
            ? "18%"
            : headPosition === "DOWN"
            ? "88%"
            : "50%",

        transform: "translate(-50%, -50%)",

        width: 58,
        height: 70,

        transition:
          "left 0.55s cubic-bezier(0.4, 0, 0.2, 1), top 0.55s cubic-bezier(0.4, 0, 0.2, 1)",

        zIndex: 5,
      }}
    >
      {/* Head */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",

          width: 38,
          height: 42,

          border: "2px solid #00ff88",
          borderRadius: "50%",

          background: "rgba(0,255,136,0.035)",
          boxShadow:
            "0 0 12px rgba(0,255,136,0.35), inset 0 0 10px rgba(0,255,136,0.08)",

          transition: "transform 0.4s ease",
        }}
      >
        {/* Face direction indicator */}
        <div
          style={{
            position: "absolute",
            top: 17,

            left:
              headPosition === "LEFT"
                ? 5
                : headPosition === "RIGHT"
                ? 28
                : 17,

            width: 5,
            height: 5,

            borderRadius: "50%",
            background: "#00ff88",
            boxShadow: "0 0 7px #00ff88",

            transition: "left 0.4s ease",
          }}
        />
      </div>

      {/* Neck */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",

          width: 10,
          height: 10,

          background: "#00ff88",
          opacity: 0.8,
        }}
      />

      {/* Shoulders */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: "50%",
          transform: "translateX(-50%)",

          width: 54,
          height: 20,

          border: "2px solid #00ff88",
          borderBottom: "none",
          borderRadius: "28px 28px 0 0",

          boxShadow: "0 0 12px rgba(0,255,136,0.25)",
        }}
      />
    </div>

    {/* Direction labels */}
    <span
  style={{
    position: "absolute",
    left: "8%",
    top: "calc(50% + 14px)",
    transform: "translateX(-50%)",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "0.55rem",
    color: "#00ff88",
    letterSpacing: "0.08em",
  }}
>
  LEFT
</span>

    <span
  style={{
    position: "absolute",
    right: "8%",
    top: "calc(50% + 14px)",
    transform: "translateX(50%)",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "0.55rem",
    color: "#00ff88",
    letterSpacing: "0.08em",
  }}
>
  RIGHT
</span>

    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "2%",
        transform: "translateX(-50%)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.55rem",
        color: "#00ff88",
        letterSpacing: "0.08em",
      }}
    >
      FORWARD
    </span>

    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "calc(87% + 14px)",
        transform: "translateX(-50%)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.55rem",
        color: "#00ff88",
        letterSpacing: "0.08em",
      }}
    >
      DOWN
    </span>
  </div>

  {/* Current position */}
  <div
    style={{
      marginTop: "0.35rem",
      fontFamily: "Rajdhani, sans-serif",
      fontWeight: 700,
      fontSize: "1rem",
      color:
        headPosition === "FORWARD"
          ? "#00ff88"
          : headPosition === "DOWN"
          ? "#ff2d55"
          : "#ff9f0a",
      letterSpacing: "0.12em",
      transition: "color 0.3s ease",
    }}
  >
    {headPosition}
  </div>
</div>
            

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[

                
                {
                  label: "Eye Status",
                  value: isDrowsy ? "CLOSED" : eyeOpen ? "OPEN" : "BLINK",
                  color: isDrowsy ? "#ff2d55" : eyeOpen ? "#00ff88" : "#ff9f0a",
                  icon: "👁",
                },
                {
                  label: "Blink Count",
                  value: String(blinkCount),
                  color: "#a0aab8",
                  icon: "👁‍🗨",
                },
                {
                  label: "Risk Level",
                  value: isDrowsy ? "HIGH" : riskLevel,
                  color: isDrowsy ? "#ff2d55" : riskLevel === "LOW" ? "#00ff88" : riskLevel === "MEDIUM" ? "#ff9f0a" : "#ff2d55",
                  icon: "🛡",
                },
                {
                  label: "Drowsy Events",
                  value: String(drowsinessEvents),
                  color: drowsinessEvents > 0 ? "#ff2d55" : "#00ff88",
                  icon: "⚠",
                },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.9rem" }}>{s.icon}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#4d6352", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1rem", fontWeight: 600, color: s.color, transition: "color 0.3s" }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Alertness chart */}
            <div className="glass" style={{ padding: "1.25rem" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
                ALERTNESS LEVEL OVER TIME
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={alertnessHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#3d4a57", fontFamily: "JetBrains Mono" }} />
                  <Tooltip
                    contentStyle={{ background: "#0d1117", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, fontSize: "0.72rem", fontFamily: "JetBrains Mono" }}
                    labelFormatter={(v) => `T+${v}s`}
                    formatter={(v) => [`${v}%`, "Alertness"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#00ff88"
                    strokeWidth={2}
                    fill="url(#alertGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Time breakdown */}
            <div className="glass" style={{ padding: "1.25rem" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "1rem" }}>
                SESSION TIME BREAKDOWN
              </div>
              {[
                { label: "Alert", time: timeAlert, color: "#00ff88", total: elapsed },
                { label: "Caution", time: timeCaution, color: "#ff9f0a", total: elapsed },
                { label: "High Risk", time: timeHighRisk, color: "#ff2d55", total: elapsed },
              ].map((row) => (
                <div key={row.label} style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "#6b7a8d" }}>{row.label}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", color: row.color }}>
                      {fmt(row.time)}
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${row.total > 0 ? (row.time / row.total) * 100 : 0}%`,
                        background: row.color,
                        borderRadius: 2,
                        opacity: 0.8,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* End session button */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button
            onClick={handleEndSession}
            className="btn-danger"
            style={{ padding: "0.9rem 3rem", fontSize: "1rem" }}
          >
            ■ End Session
          </button>
          <p style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "#3d4a57", fontFamily: "JetBrains Mono, monospace" }}>
            Session data will be saved automatically
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .monitoring-grid {
            grid-template-columns: 1.99fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function CameraFace({ eyeOpen, isDrowsy, alertness }: { eyeOpen: boolean; isDrowsy: boolean; alertness: number }) {
  const eyeH = isDrowsy ? 3 : eyeOpen ? 14 : 3;
  const color = alertness >= 80 ? "#00ff88" : alertness >= 60 ? "#ff9f0a" : "#ff2d55";

  return (
    <svg
      viewBox="0 0 300 300"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {/* Head */}
      <ellipse cx="150" cy="148" rx="70" ry="86" fill="rgba(20,30,22,0.3)" stroke={`${color}44`} strokeWidth="1" strokeDasharray="5 4" />

      {/* Detection frame */}
      <rect x="68" y="50" width="164" height="192" rx="10" fill="none" stroke={`${color}55`} strokeWidth="1.5" />

      {/* Corners */}
      <path d="M68 80 L68 50 L98 50" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M232 80 L232 50 L202 50" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M68 212 L68 242 L98 242" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M232 212 L232 242 L202 242" stroke={color} strokeWidth="2.5" fill="none" />

      {/* Left eye */}
      <rect
        x="88" y={134 - eyeH / 2}
        width="46" height={eyeH}
        rx="5"
        fill={`${color}18`}
        stroke={`${color}bb`}
        strokeWidth="1.5"
        style={{ transition: "height 0.15s, y 0.15s" }}
      />
      <circle cx="111" cy="134" r={isDrowsy ? 2 : eyeOpen ? 6 : 2} fill={color} opacity="0.9" />
      <circle cx="111" cy="134" r={isDrowsy ? 1 : eyeOpen ? 3 : 1} fill="white" opacity="0.6" />

      {/* Right eye */}
      <rect
        x="166" y={134 - eyeH / 2}
        width="46" height={eyeH}
        rx="5"
        fill={`${color}18`}
        stroke={`${color}bb`}
        strokeWidth="1.5"
        style={{ transition: "height 0.15s, y 0.15s" }}
      />
      <circle cx="189" cy="134" r={isDrowsy ? 2 : eyeOpen ? 6 : 2} fill={color} opacity="0.9" />
      <circle cx="189" cy="134" r={isDrowsy ? 1 : eyeOpen ? 3 : 1} fill="white" opacity="0.6" />

      {/* Nose */}
      <path d="M145 152 L150 174 L155 152" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
      {/* Mouth */}
      <path d="M120 196 Q150 210 180 196" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Mesh dots */}
      {[
        [111, 120], [189, 120], [150, 150], [120, 196], [180, 196],
        [80, 140], [220, 140], [150, 96], [111, 205], [189, 205],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={`${color}88`}>
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1.2 + i * 0.25}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Status label */}
      <rect x="100" y="256" width="100" height="22" rx="5" fill={`${color}18`} stroke={`${color}44`} />
      <text x="150" y="271" textAnchor="middle" fill={color} fontSize="9" fontFamily="JetBrains Mono" letterSpacing="1">
        {isDrowsy ? "DROWSY DETECTED" : eyeOpen ? "EYES OPEN" : "BLINKING"}
      </text>
    </svg>
  );
}

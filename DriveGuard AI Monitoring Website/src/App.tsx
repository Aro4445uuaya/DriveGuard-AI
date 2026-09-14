import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Monitoring from "./pages/Monitoring";
import SessionRecord from "./pages/SessionRecord";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UserAgreement from "./pages/UserAgreement";
import PrivacyCameraSaftey from "./pages/PrivacyCameraSaftey";
import AccidentTest from "./pages/AccidentTest.tsx";
import { enableMotionSensor } from "./Motionsensor";
import EmergencyContact from "./pages/EmergencyContact";
import AskDriveGuardAI from "./pages/AskDriveGuardAI";


export interface SessionData {
  startTime: Date;
  endTime: Date;
  durationSeconds: number;
  avgAlertness: number;
  minAlertness: number;
  blinkCount: number;
  drowsinessEvents: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  alertnessHistory: {
    t: number;
    v: number;
  }[];
  timeAlert: number;
  timeCaution: number;
  timeHighRisk: number;
}

function AppRoutes() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  return (
    <Routes>

  <Route path="/" element={<Home />} />

  <Route
    path="/user-agreement"
    element={<UserAgreement />}
  />

  <Route
    path="/monitoring"
    element={
      <Monitoring
        onSessionEnd={(data) => {
          setSessionData(data);
        }}
      />
    }
  />

  <Route
    path="/session"
    element={
      sessionData ? (
        <SessionRecord data={sessionData} />
      ) : (
        <Navigate to="/" replace />
      )
    }
  />

  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />

  <Route
    path="/privacy-camera-safety"
    element={<PrivacyCameraSaftey />}
  />

  <Route
    path="*"
    element={<Navigate to="/" replace />}
  />

  <Route
    path="/accident-test"
    element={<AccidentTest />}
  />

  <Route path="/emergency-contact" element={<EmergencyContact />} />
  <Route
  path="/ask-driveguard-ai"
  element={<AskDriveGuardAI sessionData={sessionData} />}
/>
  

</Routes>
  );

  
}

export default function App() {

  
  
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
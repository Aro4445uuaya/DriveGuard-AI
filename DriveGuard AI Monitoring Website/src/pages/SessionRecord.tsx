import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { SessionData } from "../App";

interface Props {
  data: SessionData;
}

function fmt(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function SessionRecord({ data }: Props) {

 const alertnessScore = data.avgAlertness;

const drowsinessPenalty = Math.min(
  40,
  data.drowsinessEvents * 20
);

const riskTimeRatio =
  data.durationSeconds > 0
    ? data.timeHighRisk / data.durationSeconds
    : 0;

const riskTimePenalty = Math.round(riskTimeRatio * 30);

const safetyScore = Math.max(
  0,
  Math.min(
    100,
    Math.round(
      alertnessScore -
      drowsinessPenalty -
      riskTimePenalty
    )
  )
);

  const safetyRating =
  safetyScore >= 85
    ? { label: "EXCELLENT", color: "#00ff88", score: safetyScore }
    : safetyScore >= 70
    ? { label: "GOOD", color: "#00ff88", score: safetyScore }
    : safetyScore >= 60
    ? { label: "CAUTION", color: "#ff9f0a", score: safetyScore }
    : { label: "HIGH RISK", color: "#ff2d55", score: safetyScore };

  const finalStatus =
    data.riskLevel === "LOW" && data.drowsinessEvents === 0
      ? { label: "SAFE", color: "#00ff88", bg: "rgba(0,255,136,0.08)" }
      : data.riskLevel === "MEDIUM" || data.drowsinessEvents <= 1
      ? { label: "CAUTION", color: "#ff9f0a", bg: "rgba(255,159,10,0.08)" }
      : { label: "HIGH RISK", color: "#ff2d55", bg: "rgba(255,45,85,0.08)" };

  const timeBreakdown = [
    { name: "Alert", value: data.timeAlert, color: "#00ff88" },
    { name: "Caution", value: data.timeCaution, color: "#ff9f0a" },
    { name: "High Risk", value: data.timeHighRisk, color: "#ff2d55" },
  ];

  const insights = [
    {
      icon: "🧠",
      title: "Overall Performance",
      text:
        data.avgAlertness >= 80
          ? "You maintained a strong alertness level during most of the session."
          : data.avgAlertness >= 60
          ? "Your alertness was adequate but showed some fluctuation during the session."
          : "Alertness levels were below recommended thresholds for safe driving.",
      color: data.avgAlertness >= 80 ? "#00ff88" : data.avgAlertness >= 60 ? "#ff9f0a" : "#ff2d55",
    },
    {
      icon: "👁",
      title: "Attention Pattern",
      text:
        data.blinkCount < 20
          ? "Blink frequency was lower than average — this may indicate reduced eye moisture or fixed focus."
          : `Your blink rate of approximately ${Math.round(data.blinkCount / Math.max(1, data.durationSeconds / 60))} blinks/min is within the healthy range.`,
      color: "#00ff88",
    },
    {
      icon: "⚠️",
      title: "Drowsiness Analysis",
      text:
        data.drowsinessEvents === 0
          ? "No major drowsiness events were detected during this session."
          : `${data.drowsinessEvents} drowsiness event${data.drowsinessEvents > 1 ? "s" : ""} ${data.drowsinessEvents > 1 ? "were" : "was"} detected. Please consider rest before your next journey.`,
      color: data.drowsinessEvents === 0 ? "#00ff88" : "#ff2d55",
    },
    {
      icon: "🛡",
      title: "Safety Recommendation",
      text:
        data.durationSeconds > 7200
          ? "For sessions exceeding 2 hours, plan rest stops every 90 minutes."
          : "Consider taking regular breaks during long driving sessions. Stay hydrated and alert.",
      color: "#a0aab8",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "3rem" }} className="mesh-bg">
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
        <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#e8edf2", letterSpacing: "0.06em" }}>
          Drive<span style={{ color: "#00ff88" }}>Guard</span>
        </span>
        <span className="badge badge-green">SESSION COMPLETE</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.25rem 0" }}>
        {/* Page header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
              color: "#e8edf2",
              marginBottom: "0.4rem",
              letterSpacing: "0.02em",
            }}
          >
            Session <span style={{ color: "#00ff88" }}>Record</span>
          </h1>
          <p style={{ color: "#4d6352", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
            {fmtDate(data.startTime)}
          </p>
        </div>

        {/* Hero summary card */}
        <div
          style={{
            background: finalStatus.bg,
            border: `1px solid ${finalStatus.color}44`,
            borderRadius: 20,
            padding: "2rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            boxShadow: `0 0 40px ${finalStatus.color}0a`,
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: finalStatus.color,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              FINAL SESSION STATUS
            </span>
          </div>
          <div
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 700,
              fontSize: "3.5rem",
              color: finalStatus.color,
              letterSpacing: "0.1em",
              lineHeight: 1,
              textShadow: `0 0 30px ${finalStatus.color}66`,
            }}
          >
            {finalStatus.label}
          </div>

          {/* Key metrics row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginTop: "2rem",
            }}
            className="hero-metrics"
          >
            <div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#4d6352", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                CAMERA TIME
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4rem", color: "#e8edf2", fontWeight: 600, letterSpacing: "0.04em" }}>
                {fmt(data.durationSeconds)}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#4d6352", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                AVG ALERTNESS
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4rem", color: finalStatus.color, fontWeight: 600 }}>
                {data.avgAlertness}%
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#4d6352", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                SAFETY RATING
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4rem", color: safetyRating.color, fontWeight: 600 }}>
                {safetyRating.label}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
          className="details-grid"
        >
          {[
            { label: "Session Date", value: fmtDate(data.startTime), mono: false },
            { label: "Start Time", value: fmtTime(data.startTime), mono: true },
            { label: "End Time", value: fmtTime(data.endTime), mono: true },
            { label: "Total Duration", value: fmt(data.durationSeconds), mono: true },
            { label: "Avg Alertness Score", value: `${data.avgAlertness}%`, mono: true },
            { label: "Min Alertness Score", value: `${data.minAlertness}%`, mono: true },
            { label: "Total Blink Count", value: String(data.blinkCount), mono: true },
            { label: "Drowsiness Events", value: String(data.drowsinessEvents), mono: true },
            { label: "Overall Risk Level", value: data.riskLevel, mono: true },
            { label: "Safety Rating", value: safetyRating.label, mono: true },
          ].map((item) => (
            <div key={item.label} className="stat-card" style={{ padding: "0.9rem 1rem" }}>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.58rem", color: "#3d4a57", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: item.mono ? "JetBrains Mono, monospace" : "Rajdhani, sans-serif",
                  fontSize: item.mono ? "0.9rem" : "0.88rem",
                  color: "#e8edf2",
                  fontWeight: 600,
                  wordBreak: "break-all",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Alertness trend chart */}
        <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            ALERTNESS TREND — FULL SESSION
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data.alertnessHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#3d4a57", fontFamily: "JetBrains Mono" }} tickFormatter={(v) => `${v}s`} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#3d4a57", fontFamily: "JetBrains Mono" }} />
              <Tooltip
                contentStyle={{ background: "#0d1117", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, fontSize: "0.72rem", fontFamily: "JetBrains Mono" }}
                labelFormatter={(v) => `T+${v}s`}
               formatter={(v) => [`${v}%`, "Alertness"]}
              />
              <Area type="monotone" dataKey="v" stroke="#00ff88" strokeWidth={2} fill="url(#sessGrad)" dot={{ fill: "#00ff88", r: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Time breakdown chart */}
        <div className="glass" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            TIME BREAKDOWN BY RISK LEVEL
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={timeBreakdown} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#3d4a57", fontFamily: "JetBrains Mono" }} />
                <YAxis tick={{ fontSize: 9, fill: "#3d4a57", fontFamily: "JetBrains Mono" }} tickFormatter={(v) => `${v}s`} />
                <Tooltip
                  contentStyle={{ background: "#0d1117", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, fontSize: "0.72rem", fontFamily: "JetBrains Mono" }}
                 formatter={(v) => [fmt(Number(v)), "Duration"]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {timeBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {timeBreakdown.map((t) => (
                <div key={t.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "#6b7a8d" }}>{t.name}</span>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", color: t.color }}>
                      {fmt(t.value)}
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${data.durationSeconds > 0 ? (t.value / data.durationSeconds) * 100 : 0}%`,
                        background: t.color,
                        borderRadius: 2,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            AI SESSION INSIGHTS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="insights-grid">
            {insights.map((ins) => (
              <div
                key={ins.title}
                style={{
                  background: "rgba(16,22,28,0.7)",
                  border: `1px solid ${ins.color}22`,
                  borderRadius: 14,
                  padding: "1.1rem",
                  transition: "border-color 0.3s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{ins.icon}</span>
                  <span
                    style={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: ins.color,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {ins.title}
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6b7a8d", lineHeight: 1.6 }}>{ins.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety score visual */}
        <div
          className="glass"
          style={{ padding: "1.5rem", marginBottom: "2rem", textAlign: "center" }}
        >
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4d6352", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            OVERALL SAFETY SCORE
          </div>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={safetyRating.color}
                strokeWidth="8"
                strokeDasharray={`${(safetyRating.score / 100) * 314} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ filter: `drop-shadow(0 0 6px ${safetyRating.color}88)` }}
              />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.8rem", color: safetyRating.color, lineHeight: 1 }}>
                {safetyRating.score}
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", color: "#3d4a57" }}>/ 100</div>
            </div>
          </div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: safetyRating.color, letterSpacing: "0.08em" }}>
            {safetyRating.label}
          </div>
        </div>

        {/* Ask DriveGuard AI */}
<div
  style={{
    background: "rgba(0,255,136,0.04)",
    border: "1px solid rgba(0,255,136,0.18)",
    borderRadius: 16,
    padding: "1.25rem 1.5rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  }}
>
  <div>
    <div
      style={{
        fontFamily: "Rajdhani, sans-serif",
        fontWeight: 700,
        fontSize: "1.05rem",
        color: "#00ff88",
        marginBottom: "0.3rem",
      }}
    >
      🤖 Ask DriveGuard AI
    </div>

    <div
      style={{
        fontSize: "0.78rem",
        color: "#6b7a8d",
        lineHeight: 1.5,
      }}
    >
      Have questions about this session? Let DriveGuard AI explain your results.
    </div>
  </div>

  <Link
    to="/ask-driveguard-ai"
    style={{
      textDecoration: "none",
      flexShrink: 0,
    }}
  >
    <button
      className="btn-primary"
      style={{
        padding: "0.75rem 1.25rem",
        fontSize: "0.85rem",
      }}
    >
      Ask About This Session →
    </button>
  </Link>
</div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/monitoring" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}>
              ▶ Start New Session
            </button>
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="btn-outline" style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}>
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .hero-metrics { grid-template-columns: 1fr !important; }
          .details-grid { grid-template-columns: 1fr !important; }
          .insights-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

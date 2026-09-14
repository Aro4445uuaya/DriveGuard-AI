import React, { useState } from "react";
import "../styles/AskDriveGuardAI.css";
import type { SessionData } from "../App";

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function AIText({ text }: { text: string }) {
  const normalized = text
    .replace(/\n(?=\d+\.)/g, "\n")
    .replace(/(\d+\.)\s*\n\s*/g, "$1 ")
    .replace(/(\*\*[^*]+\*\*:?)\s*\n\s*/g, "$1 ")
    .replace(/\n\s*(?=\d+\.\s)/g, "\n");

  return (
    <div className="ai-text">
      {normalized.split("\n").map((line, index) => {
        if (!line.trim()) {
          return <div key={index} style={{ height: 8 }} />;
        }

        return (
          <div key={index} style={{ marginBottom: "0.35rem" }}>
            {renderInlineMarkdown(line)}
          </div>
        );
      })}
    </div>
  );
}


interface Props {
  sessionData: SessionData | null;
}

const AskDriveGuardAI = ({ sessionData }: Props) => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
  { role: "user" | "assistant"; text: string }[]
>([]);

const [loading, setLoading] = useState(false);

const handleSend = async () => {
  if (!message.trim() || loading) return;

  const userMessage = message.trim();

  const updatedMessages = [
    ...messages,
    { role: "user" as const, text: userMessage },
  ];

  setMessages(updatedMessages);
  setMessage("");
  setLoading(true);

  try {
    const response = await fetch("/api/ask-driveguard-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        history: messages,
        sessionData,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "AI request failed");
    }

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        text: data.reply,
      },
    ]);
  } catch (error) {
    console.error("Ask DriveGuard AI error:", error);

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        text: "Sorry, I couldn't connect to DriveGuard AI right now. Please try again.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};  

  return (
    <div className="ask-ai-page">
      {/* Header */}
      <div className="ask-ai-header">
        <div>
          <h1>Ask DriveGuard AI</h1>
          <p>Your intelligent driving safety assistant</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="ai-chat-container">

        {/* Welcome Message */}
        <div className="ai-message">
          <div className="ai-avatar">🛡️</div>

          <div className="ai-bubble">
            <strong>DriveGuard AI</strong>
            <p>
              Hi! I’m DriveGuard AI. Ask me anything about your
              driving safety, session results, or detected risks.
            </p>
          </div>
        </div>

        {messages.map((msg, index) => (
  <div
    key={index}
    className={`ai-message ${
      msg.role === "user" ? "user-message" : ""
    }`}
  >
    <div className="ai-avatar">
      {msg.role === "user" ? "👤" : "🛡️"}
    </div>

    <div className="ai-bubble">
      <strong>
        {msg.role === "user" ? "You" : "DriveGuard AI"}
      </strong>
      <AIText text={msg.text} />
    </div>
  </div>
))}

{loading && (
  <div className="ai-message">
    <div className="ai-avatar">🛡️</div>
    <div className="ai-bubble">
      <strong>DriveGuard AI</strong>
      <p>Thinking...</p>
    </div>
  </div>
)}

        {/* Suggested Questions */}
        <div className="suggested-questions">
          <button onClick={() => setMessage("Why was my safety score low?")}>
            Why was my safety score low?
          </button>

          <button
            onClick={() =>
              setMessage("Am I showing signs of drowsiness?")
            }
          >
            Am I showing signs of drowsiness?
          </button>

          <button
            onClick={() =>
              setMessage("How can I improve my driving safety?")
            }
          >
            How can I improve my driving safety?
          </button>

          <button
            onClick={() =>
              setMessage("Explain my session results")
            }
          >
            Explain my session results
          </button>
        </div>

      </div>

      {/* Input Area */}
      <div className="ai-input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask DriveGuard AI..."
        />

        <button onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default AskDriveGuardAI;
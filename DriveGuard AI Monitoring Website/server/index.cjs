const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/textbee-test", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.textbee.dev/api/v1/gateway/devices",
      {
        headers: {
          "x-api-key": process.env.TEXTBEE_API_KEY,
        },
      }
    );

    const data = await response.json();

    console.log("TEXTBEE TEST:", response.status, data);

    res.json({
      status: response.status,
      result: data,
    });
  } catch (error) {
    console.error("TEXTBEE TEST ERROR:", error);

    res.status(500).json({
      error: "Test failed",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "DriveGuard backend is running",
  });
});

app.get("/api/textbee-status/:batchId", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.textbee.dev/api/v1/gateway/devices/${process.env.TEXTBEE_DEVICE_ID}/sms-batch/${req.params.batchId}`,
      {
        headers: {
          "x-api-key": process.env.TEXTBEE_API_KEY,
        },
      }
    );

    const data = await response.json();

    console.log("TEXTBEE BATCH STATUS:", response.status, data);

    res.json({
      status: response.status,
      result: data,
    });
  } catch (error) {
    console.error("TEXTBEE STATUS ERROR:", error);

    res.status(500).json({
      error: "Status check failed",
    });
  }
});

app.post("/api/emergency", async (req, res) => {
  const { name, phone, message } = req.body;

  console.log("EMERGENCY REQUEST RECEIVED");
  console.log("Contact:", name);
  console.log("Phone:", phone);
  console.log("Message:", message);

  try {
    const response = await fetch(
      "https://api.textbee.dev/api/v1/gateway/send-sms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.TEXTBEE_API_KEY,
        },
        body: JSON.stringify({
  deviceId: process.env.TEXTBEE_DEVICE_ID,

  recipients: [phone],
  message: message,

        }),
      }
    );

    const data = await response.json();

    console.log("TEXTBEE RESPONSE:", data);
    console.log("TEXTBEE STATUS:", response.status);

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "TextBee SMS sending failed.",
        error: data,
      });
    }

    res.json({
      success: true,
      message: `Emergency SMS sent to ${name}.`,
      data: data,
    });
  } catch (error) {
    console.error("TEXTBEE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Could not connect to TextBee.",
    });
  }
});


app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "DriveGuard <onboarding@resend.dev>",
        to: [process.env.CONTACT_RECIEVER_EMAIL],
        reply_to: email,
        subject: `[DriveGuard Contact] ${subject}`,
        text: `
Name: ${name}
Email: ${email}

Message:
${message}
        `,
      }),
    });

    const data = await response.json();

    console.log("RESEND STATUS:", response.status);
    console.log("RESEND RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Email sending failed.",
        error: data,
      });
    }

    res.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("RESEND ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Could not connect to email service.",
    });
  }
});


app.post("/api/ask-driveguard-ai", async (req, res) => {
  try {
    const { message, history = [], sessionData = null } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const systemInstruction = `
You are DriveGuard AI, the intelligent driving safety assistant
for the DriveGuard driver-monitoring website.

Your role:
- Explain DriveGuard features clearly.
- Help users understand driving-safety concepts.
- Explain session results when the user provides them.
- Give practical, safety-focused advice.
- Never encourage unsafe driving.
- If the user describes an immediate dangerous driving situation,
  advise them to stop driving safely when possible and seek appropriate help.
- Do not claim that DriveGuard can diagnose medical conditions.
- Keep responses clear, useful, and reasonably concise.



You are an assistant inside the DriveGuard application.
`;

const sessionContext = sessionData
  ? `
CURRENT DRIVEGUARD SESSION DATA:
- Overall Safety Score: ${Math.max(
      0,
      Math.min(
        100,
        Math.round(
          sessionData.avgAlertness -
            Math.min(40, sessionData.drowsinessEvents * 20) -
            Math.round(
              (sessionData.durationSeconds > 0
                ? sessionData.timeHighRisk / sessionData.durationSeconds
                : 0) * 30
            )
        )
      )
    )}/100
- Average Alertness: ${sessionData.avgAlertness}%
- Minimum Alertness: ${sessionData.minAlertness}%
- Blink Count: ${sessionData.blinkCount}
- Drowsiness Events: ${sessionData.drowsinessEvents}
- Risk Level: ${sessionData.riskLevel}
- Session Duration: ${sessionData.durationSeconds} seconds
- Alert Time: ${sessionData.timeAlert} seconds
- Caution Time: ${sessionData.timeCaution} seconds
- High Risk Time: ${sessionData.timeHighRisk} seconds

Use this session data when answering questions about the user's current session.
Do not invent values that are not present in the session data.
`
  : `
CURRENT DRIVEGUARD SESSION DATA:
No completed session data is currently available.
If the user asks about their session results, explain that they need to complete a monitoring session first.
`;

    const contents = [
      ...history.map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text }],
      })),
      {
        role: "user",
        parts: [
          {
            text: `${sessionContext}
            USER QUESTION:
            ${message.trim()}`,
          },
        ],
      },
    ];

     let response;

for (let attempt = 0; attempt < 3; attempt++) {
  response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    }
  );

  if (response.status !== 503 || attempt === 2) {
    break;
  }

  console.log(`Gemini 503 - retrying... attempt ${attempt + 1}`);

  await new Promise((resolve) =>
    setTimeout(resolve, 1000 * (attempt + 1))
  );
}

const data = await response.json();

console.log("GEMINI STATUS:", response.status);

if (!response.ok) {

  console.error("GEMINI ERROR:", data);

  return res.status(response.status).json({
    success: false,
    message: "Gemini API request failed.",
    error: data,
  });
}

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("") || "";

    if (!reply) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned an empty response.",
      });
    }

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Could not connect to Gemini.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DriveGuard server running on port ${PORT}`);
});
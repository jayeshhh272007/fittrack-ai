
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.status(503).json({
        error: "Gemini API key is not configured."
      });
    }

    const { message, profile = {}, targets = {} } = req.body || {};

    if (
      !message ||
      typeof message !== "string" ||
      message.length > 2000
    ) {
      return res.status(400).json({
        error: "Please send a valid message."
      });
    }

    const prompt = `You are FitTrack AI Coach, a supportive fitness and nutrition education assistant.
Be concise, practical and evidence-informed.
Do not diagnose or recommend unsafe diets or exercise.
User context: ${JSON.stringify({ profile, targets })}
User question: ${message}`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      encodeURIComponent(key),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "AI provider returned an error."
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(p => p.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({
        error: "No response returned."
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}

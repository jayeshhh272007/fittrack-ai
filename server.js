// Optional Gemini-powered chat backend for FitTrack AI.
// Run: npm install && set GEMINI_API_KEY in your environment && npm start
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json({limit:"1mb"}));
app.use(express.static(__dirname));
app.post("/api/chat", async (req,res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(503).json({error:"Gemini API key is not configured."});
    const {message,profile={},targets={}} = req.body || {};
    if (!message || typeof message !== "string" || message.length > 2000) return res.status(400).json({error:"Please send a valid message under 2,000 characters."});
    const prompt = `You are FitTrack AI Coach, a supportive fitness and nutrition education assistant. Be concise, practical, and evidence-informed. Do not diagnose, prescribe medication, recommend crash diets, extreme calorie deficits, unsafe supplements, or excessive exercise. If the user mentions injury, concerning symptoms, or a medical condition, advise consulting an appropriate healthcare professional. Make clear that estimates are not medical advice.\nUser context: ${JSON.stringify({profile,targets})}\nUser question: ${message}`;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+encodeURIComponent(key), {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.6,maxOutputTokens:500}})
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({error:"AI provider returned an error."});
    const reply = data.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("").trim();
    if (!reply) return res.status(502).json({error:"No response was returned by the AI provider."});
    res.json({reply});
  } catch (e) { console.error(e); res.status(500).json({error:"Something went wrong. Please try again."}); }
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`FitTrack AI running at http://localhost:${port}`));

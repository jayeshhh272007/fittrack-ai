# FitTrack AI

A responsive fitness and nutrition tracking starter website for a Prompt Engineering project.

## Included features
- Dashboard with calorie/protein progress and daily food summary
- BMI, BMR (Mifflin–St Jeor), TDEE and calorie target estimates
- Workout schedule builder and exercise library
- Food and macronutrient log
- Weight check-ins and an SVG trend chart
- Profile settings and local browser storage
- AI coach UI with a local fallback and optional Gemini API backend

## Run locally

### Option A: Frontend demo
Open `index.html` in a modern browser. The dashboard, calculators, workout planner, food tracker and progress tracker work locally. Data is saved in this browser using `localStorage`.

### Option B: Gemini AI coach
1. Install Node.js (18+ recommended).
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env` and add your Gemini API key.
4. Run `npm start`.
5. Open `http://localhost:3000`.

The API key is read server-side by `server.js`; do not put it in frontend JavaScript or commit `.env` to GitHub.

## Deploy
For a production deployment, deploy the static frontend and add a serverless API route for `/api/chat` on Vercel, or adapt `server.js` to a Vercel function. Configure `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables. Do not deploy a client-side API key.

## Important limitations
- This is a working project starter, not a medical or clinical product.
- BMI, BMR, TDEE, protein and calorie targets are estimates. They can be inaccurate for individuals.
- The food tracker requires the user to enter nutrition values; it does not yet use a verified food database.
- Workout schedules are templates, not individualized medical or training prescriptions.
- Local browser storage is not user authentication or cloud sync. Supabase authentication/database integration is a separate next development step.
- Without a configured Gemini backend, the coach uses a clearly labelled local demo response, not a live AI model.

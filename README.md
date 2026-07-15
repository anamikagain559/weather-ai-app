# Weather-AI Dashboard

A premium, glassmorphism-themed weather dashboard built as an integration assignment for Weather-AI. This application consumes the Weather-AI API to present current weather conditions and a 5-day forecast with a visually stunning, responsive design.

## Features
- **Current Weather Intelligence**: Real-time temperature, wind speed, humidity, and UV index.
- **5-Day Forecast**: Predictive insights for the upcoming days.
- **Premium Glassmorphism UI**: Built with pure CSS (no CSS frameworks) leveraging modern design principles, gradients, and micro-animations to create a "wow" factor.
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices.

## Tech Stack
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS with Glassmorphism aesthetic
- **Data Source**: Weather-AI API (Mock fallback enabled if API key is not present)

## Setup Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd weather-ai-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root of the project and add your Weather-AI API key:
   ```env
   VITE_WEATHER_AI_API_KEY=your_api_key_here
   ```
   *Note: If no API key is provided, the application will elegantly fallback to mock data to demonstrate full UI functionality.*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Deployment
This project is optimized for deployment on Vercel, Netlify, or Render.

**For Vercel / Netlify:**
1. Connect your GitHub repository.
2. Ensure the Build Command is `npm run build`.
3. Ensure the Publish Directory is `dist`.
4. Add the `VITE_WEATHER_AI_API_KEY` to the environment variables section in the deployment settings.

---
*Developed for the Weather-AI Engineering Assignment.*

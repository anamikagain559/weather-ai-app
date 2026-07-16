<div align="center">
  <h1>🌤️ Weather-AI Dashboard</h1>
  <p><strong>A premium, glassmorphism-themed intelligent weather dashboard built with React.</strong></p>

  <!-- Badges -->
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
    <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </p>

  <h3>
    🌐 Live Demo: <a href="https://weather-ai-app-eta.vercel.app/">https://weather-ai-app-eta.vercel.app/</a>
  </h3>
  <p>
    <em>Backend API: <a href="https://subscription-billing-api-rho.vercel.app">https://subscription-billing-api-rho.vercel.app</a></em>
  </p>
</div>

<hr/>

## ✨ Core Features

- 🌡️ **Comprehensive Weather Intelligence:** Get real-time updates on temperature, wind speed, humidity, and UV index with beautiful, intuitive icons.
- 📅 **Interactive Forecasts:** Plan ahead with detailed 5-day predictive weather insights, complete with daily highs and lows.
- 🌳 **Forestry AI Analysis:** A specialized module that calculates health scores, drought risk, and disease risk for forestry and agriculture based on current weather conditions.
- 📱 **SMS Alert System:** Stay notified of severe weather events with an integrated SMS alert notification feature.
- 💳 **Subscription & Billing:** Premium tiered access powered by Stripe. Users can upgrade their plan to access advanced AI insights and extended forecasts.
- 💎 **Premium Glassmorphism UI:** Built with Tailwind CSS, leveraging modern design principles, vibrant gradients, and smooth micro-animations.
- 🎭 **Smart Fallback Mechanism:** Gracefully falls back to realistic mock data if the API key is missing or backend is unavailable, demonstrating full UI functionality seamlessly.

---

## 🛠️ Tech Stack
| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS (Glassmorphism Aesthetic) |
| **Routing** | React Router DOM |
| **Notifications** | SweetAlert2 & React Hot Toast |
| **Data Source** | Weather-AI API |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- NPM or Yarn installed globally

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anamikagain559/weather-ai-app.git
   cd weather-ai-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root of the project and add your Weather-AI API key:
   ```env
   VITE_WEATHER_AI_API_KEY=your_api_key_here
   ```
   > 💡 *Note: If no API key is provided, the application will elegantly fall back to mock data so you can still view the UI.*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to see the app running.

---



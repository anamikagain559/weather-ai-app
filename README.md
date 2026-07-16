<div align="center">
  <h1>🌤️ Weather-AI Dashboard</h1>
  <p><strong>A premium, glassmorphism-themed intelligent weather dashboard built with React.</strong></p>

  <!-- Badges -->
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
    <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
    <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  </p>
</div>

<hr/>

## ✨ Features
- 🌡️ **Current Weather Intelligence:** Real-time temperature, wind speed, humidity, and UV index.
- 📅 **5-Day Forecast:** Predictive weather insights for the upcoming days.
- 💎 **Premium Glassmorphism UI:** Built with pure vanilla CSS (no heavy CSS frameworks), leveraging modern design principles, vibrant gradients, and smooth micro-animations.
- 📱 **Responsive Design:** A flawless and fluid experience across desktop, tablet, and mobile devices.
- 🎭 **Smart Fallback Mechanism:** Gracefully falls back to mock data if the API key is missing to demonstrate full UI functionality.

---

## 🛠️ Tech Stack
| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Vanilla CSS (Glassmorphism Aesthetic) |
| **Data Source** | Weather-AI API |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- NPM or Yarn installed globally

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
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

## 🌍 Deployment

This project is highly optimized for deployment on platforms like Vercel, Netlify, or Render.

**Deploying on Vercel / Netlify:**
1. Connect your GitHub repository to your hosting provider.
2. Set the **Build Command** to `npm run build`.
3. Set the **Publish Directory** to `dist`.
4. Don't forget to add the `VITE_WEATHER_AI_API_KEY` to the Environment Variables section in your deployment dashboard!

---

<div align="center">
  <p><i>Developed for the Weather-AI Engineering Assignment.</i></p>
</div>

// src/services/api.js

const API_KEY = import.meta.env.VITE_WEATHER_AI_API_KEY;
const BASE_URL = 'https://api.weather-ai.co/v1';

const MOCK_USAGE = { requests_today: 450, limit: 1000, active_webhooks: 2 };
const MOCK_WEBHOOKS = [
  { id: "wh_123", url: "https://myapp.com/api/webhook/weather", events: ["weather.alert", "temp.high"], status: "active" }
];
const MOCK_SMS_STATS = { sent_today: 45, delivery_rate: "99.8%", credits_remaining: 1550 };
const MOCK_FORESTRY_ANALYSIS = {
  health_score: 88,
  drought_risk: "Low",
  recommendation: "Optimal soil moisture levels detected. Proceed with standard irrigation schedule.",
  disease_risk: "Moderate - Monitor for fungal growth due to recent humidity."
};

// MOCK DATA for demonstration when API_KEY is missing
const MOCK_CURRENT = {
  location: { name: "Dhaka", country: "Bangladesh", lat: 23.81, lon: 90.41 },
  current: {
    temp_c: 32,
    condition: { text: "Partly cloudy", icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png" },
    wind_kph: 15.2,
    humidity: 68,
    feelslike_c: 36,
    uv: 7,
    visibility_km: 10
  }
};

const MOCK_FORECAST = {
  forecast: {
    forecastday: [
      { date: "2026-07-16", day: { maxtemp_c: 34, mintemp_c: 27, condition: { text: "Sunny", icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png" } } },
      { date: "2026-07-17", day: { maxtemp_c: 33, mintemp_c: 26, condition: { text: "Patchy rain", icon: "https://cdn.weatherapi.com/weather/64x64/day/176.png" } } },
      { date: "2026-07-18", day: { maxtemp_c: 31, mintemp_c: 26, condition: { text: "Heavy rain", icon: "https://cdn.weatherapi.com/weather/64x64/day/308.png" } } },
      { date: "2026-07-19", day: { maxtemp_c: 32, mintemp_c: 27, condition: { text: "Partly cloudy", icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png" } } },
      { date: "2026-07-20", day: { maxtemp_c: 34, mintemp_c: 28, condition: { text: "Sunny", icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png" } } },
    ]
  }
};

const MOCK_AQI = {
  aqi: 45,
  status: "Good",
  pm2_5: 12.5,
  pm10: 25.4,
  o3: 45.2,
  no2: 15.1
};

const MOCK_AI_INSIGHTS = {
  summary: "It's a beautiful, warm day in your area. Conditions are perfect for outdoor activities, but the UV index is slightly high, so consider wearing sunscreen if you'll be out for long.",
  recommendations: ["Wear light clothing", "Apply sunscreen", "Stay hydrated"]
};

const MOCK_ALERTS = {
  alerts: [
    {
      event: "Heat Advisory",
      headline: "Heat Advisory issued for the afternoon.",
      severity: "Moderate",
      instruction: "Drink plenty of fluids, stay in an air-conditioned room, stay out of the sun, and check up on relatives and neighbors."
    }
  ]
};

/**
 * Fetches current weather for a given city.
 */
export const fetchWeather = async (city = 'Dhaka') => {
  // If no API key is provided, simulate a network request and return mock data
  if (!API_KEY) {
    console.warn("No VITE_WEATHER_AI_API_KEY found. Using Mock Data.");
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...MOCK_CURRENT, location: { ...MOCK_CURRENT.location, name: city } }), 800);
    });
  }

  try {
    const res = await fetch(`${BASE_URL}/current?q=${city}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch weather data");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Fetches 5-day forecast for a given city.
 */
export const fetchForecast = async (city = 'Dhaka') => {
  if (!API_KEY) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_FORECAST), 1000);
    });
  }

  try {
    const res = await fetch(`${BASE_URL}/forecast?q=${city}&days=5`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch forecast data");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Premium API: Fetches AI generated weather insights.
 */
export const fetchAiInsights = async (city = 'Dhaka') => {
  if (!API_KEY) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_AI_INSIGHTS), 1200);
    });
  }
  // Simulate real API call fallback
  return MOCK_AI_INSIGHTS;
};

/**
 * Premium API: Fetches Severe Weather Alerts.
 */
export const fetchAlerts = async (city = 'Dhaka') => {
  if (!API_KEY) {
    return new Promise((resolve) => {
      // Sometimes return no alerts for realism, but we'll return mock alerts for demonstration
      setTimeout(() => resolve(MOCK_ALERTS), 600);
    });
  }
  return MOCK_ALERTS;
};

/**
 * Premium API: Fetches Air Quality Index data.
 */
export const fetchAqi = async (city = 'Dhaka') => {
  if (!API_KEY) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_AQI), 700);
    });
  }
  return MOCK_AQI;
};

// --- NEW API INTEGRATIONS ---

export const fetchHourlyForecast = async (city = 'Dhaka') => {
  return new Promise((resolve) => setTimeout(() => resolve({ /* mock hourly */ }), 500));
};

export const fetchDailyForecast = async (city = 'Dhaka') => {
  return new Promise((resolve) => setTimeout(() => resolve({ /* mock daily */ }), 500));
};

export const ipLookup = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ city: "Dhaka", country: "Bangladesh" }), 300));
};

export const fetchUsageStats = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_USAGE), 600));
};

export const fetchWebhooks = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_WEBHOOKS), 700));
};

export const addWebhook = async (url, events) => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: `wh_${Math.floor(Math.random() * 1000)}` }), 800));
};

export const deleteWebhook = async (id) => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
};

export const fetchSmsStats = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SMS_STATS), 600));
};

export const sendSmsAlert = async (phone, message) => {
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, messageId: "msg_456" }), 1000));
};

export const analyzeForestry = async (lat, lon) => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_FORESTRY_ANALYSIS), 1500));
};

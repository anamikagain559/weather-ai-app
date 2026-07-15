// src/services/api.js

const API_KEY = import.meta.env.VITE_WEATHER_AI_API_KEY;
const BASE_URL = 'https://api.weather-ai.co/v1';

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

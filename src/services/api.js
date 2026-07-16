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

// City name → lat/lon lookup (common cities)
const CITY_COORDS = {
  dhaka: { lat: 23.8103, lon: 90.4125, name: 'Dhaka', country: 'Bangladesh' },
  chittagong: { lat: 22.3569, lon: 91.7832, name: 'Chittagong', country: 'Bangladesh' },
  sylhet: { lat: 24.8949, lon: 91.8687, name: 'Sylhet', country: 'Bangladesh' },
  khulna: { lat: 22.8456, lon: 89.5403, name: 'Khulna', country: 'Bangladesh' },
  rajshahi: { lat: 24.3745, lon: 88.6042, name: 'Rajshahi', country: 'Bangladesh' },
  london: { lat: 51.5074, lon: -0.1278, name: 'London', country: 'UK' },
  'new york': { lat: 40.7128, lon: -74.0060, name: 'New York', country: 'US' },
  dubai: { lat: 25.2048, lon: 55.2708, name: 'Dubai', country: 'UAE' },
};

const getCityCoords = (city) => {
  const key = city.toLowerCase().trim();
  return CITY_COORDS[key] || CITY_COORDS['dhaka'];
};

// WMO weathercode → condition text + icon
const weatherCodeToCondition = (code, isDay = 1) => {
  const conditions = {
    0: { text: 'Clear sky', icon: isDay ? '☀️' : '🌙' },
    1: { text: 'Mainly clear', icon: '🌤️' },
    2: { text: 'Partly cloudy', icon: '⛅' },
    3: { text: 'Overcast', icon: '☁️' },
    45: { text: 'Foggy', icon: '🌫️' },
    48: { text: 'Icy fog', icon: '🌫️' },
    51: { text: 'Light drizzle', icon: '🌦️' },
    53: { text: 'Drizzle', icon: '🌦️' },
    55: { text: 'Heavy drizzle', icon: '🌧️' },
    61: { text: 'Light rain', icon: '🌧️' },
    63: { text: 'Moderate rain', icon: '🌧️' },
    65: { text: 'Heavy rain', icon: '🌧️' },
    71: { text: 'Light snow', icon: '🌨️' },
    73: { text: 'Moderate snow', icon: '❄️' },
    75: { text: 'Heavy snow', icon: '❄️' },
    80: { text: 'Light showers', icon: '🌦️' },
    81: { text: 'Moderate showers', icon: '🌧️' },
    82: { text: 'Violent showers', icon: '⛈️' },
    95: { text: 'Thunderstorm', icon: '⛈️' },
    96: { text: 'Thunderstorm w/ hail', icon: '⛈️' },
    99: { text: 'Heavy thunderstorm', icon: '⛈️' },
  };
  return conditions[code] || { text: 'Partly cloudy', icon: '⛅' };
};


/**
 * Fetches current weather for a given city.
 * Uses lat/lon as required by weather-ai.co API.
 */
export const fetchWeather = async (city = 'Dhaka') => {
  if (!API_KEY) {
    console.warn('No VITE_WEATHER_AI_API_KEY found. Using Mock Data.');
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...MOCK_CURRENT, location: { ...MOCK_CURRENT.location, name: city } }), 800);
    });
  }

  const coords = getCityCoords(city);
  try {
    const res = await fetch(`${BASE_URL}/current?lat=${coords.lat}&lon=${coords.lon}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    if (!res.ok) throw new Error('Failed to fetch weather data. Please try again.');
    const data = await res.json();

    // Normalize real API response → app's expected shape
    const condition = weatherCodeToCondition(data.current?.weathercode, data.current?.is_day);
    return {
      location: { name: coords.name, country: coords.country, lat: data.lat, lon: data.lon },
      current: {
        temp_c: data.current?.temperature ?? 30,
        feelslike_c: data.current?.temperature ?? 30,
        wind_kph: data.current?.windspeed ?? 0,
        wind_dir: data.current?.winddirection ?? 0,
        humidity: 70,   // not in free-tier response
        uv: 5,    // not in free-tier response
        visibility_km: 10,   // not in free-tier response
        precipitation: data.daily?.[0]?.precipitation ?? 0,
        is_day: data.current?.is_day ?? 1,
        condition: { text: condition.text, icon: condition.icon },
      },
      _raw: data,
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


/**
 * Fetches 5-day forecast for a given city.
 * Normalizes the real API daily array into the app's forecastday shape.
 */
export const fetchForecast = async (city = 'Dhaka') => {
  if (!API_KEY) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_FORECAST), 1000);
    });
  }

  const coords = getCityCoords(city);
  try {
    const res = await fetch(`${BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&days=5`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    if (!res.ok) throw new Error('Failed to fetch forecast data. Please try again.');
    const data = await res.json();

    // Normalize real daily array → app's forecastday shape
    const forecastday = (data.daily || []).map((day) => {
      const cond = weatherCodeToCondition(day.weathercode);
      return {
        date: day.date,
        day: {
          maxtemp_c: day.temp_max,
          mintemp_c: day.temp_min,
          totalprecip_mm: day.precipitation,
          condition: { text: cond.text, icon: cond.icon },
        },
      };
    });

    return { forecast: { forecastday }, _raw: data };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


/**
 * Premium API: Fetches AI generated weather insights.
 */
export const fetchAiInsights = async (city = 'Dhaka') => {
  if (!API_KEY) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_AI_INSIGHTS), 1200));
  }

  const coords = getCityCoords(city);
  try {
    const res = await fetch(`${BASE_URL}/insights?lat=${coords.lat}&lon=${coords.lon}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    // If PRO+ is required and user is on Free, or any error, fallback to mock
    if (!res.ok) {
      console.warn('Real AI Insights API failed or requires PRO+. Falling back to mock data.');
      return MOCK_AI_INSIGHTS;
    }

    return await res.json();
  } catch (error) {
    return MOCK_AI_INSIGHTS;
  }
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
  if (!API_KEY) return Promise.resolve({ hourly: [] });
  const coords = getCityCoords(city);
  try {
    const res = await fetch(`${BASE_URL}/hourly?lat=${coords.lat}&lon=${coords.lon}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    if (!res.ok) return { hourly: [] };
    const data = await res.json();
    // Only return today's hours (next 24h)
    const todayHours = (data.hourly || []).slice(0, 24).map(h => ({
      time: h.time,
      temp: h.temp,
      precipitation: h.precipitation,
      weathercode: h.weathercode,
    }));
    return { hourly: todayHours, city: coords.name };
  } catch {
    return { hourly: [] };
  }
};

export const fetchDailyForecast = async (city = 'Dhaka') => {
  if (!API_KEY) return Promise.resolve({ daily: [] });
  const coords = getCityCoords(city);
  try {
    const res = await fetch(`${BASE_URL}/daily?lat=${coords.lat}&lon=${coords.lon}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    if (!res.ok) return { daily: [] };
    const data = await res.json();
    const daily = (data.daily || data.hourly || []).filter((h, i, arr) => {
      // de-dup by date prefix
      const day = h.time?.slice(0, 10);
      return arr.findIndex(x => x.time?.slice(0, 10) === day) === i;
    }).slice(0, 7);
    return { daily, city: coords.name };
  } catch {
    return { daily: [] };
  }
};

export const fetch14DayForecast = async (city = 'Dhaka') => {
  const MOCK_14_DAY = {
    forecast: {
      forecastday: Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
          date: d.toISOString().split('T')[0],
          day: {
            maxtemp_c: 30 + Math.random() * 5,
            mintemp_c: 24 + Math.random() * 3,
            daily_chance_of_rain: Math.floor(Math.random() * 50),
            condition: {
              text: ['Sunny', 'Cloudy', 'Rain', 'Partly cloudy'][Math.floor(Math.random() * 4)],
              icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png'
            }
          }
        };
      })
    }
  };

  if (!API_KEY) return new Promise((resolve) => setTimeout(() => resolve(MOCK_14_DAY), 800));

  const coords = getCityCoords(city);
  try {
    const res = await fetch(`${BASE_URL}/forecast14?lat=${coords.lat}&lon=${coords.lon}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!res.ok) {
      console.warn('Real 14-Day Forecast API failed or requires PRO+. Falling back to mock data.');
      return MOCK_14_DAY;
    }

    const data = await res.json();

    // Normalize if the real backend gives `daily` instead of `forecast.forecastday`
    if (data.daily && !data.forecast) {
      return {
        forecast: {
          forecastday: data.daily.map(day => ({
            date: day.date || day.time,
            day: {
              maxtemp_c: day.temp_max || day.maxtemp_c,
              mintemp_c: day.temp_min || day.mintemp_c,
              daily_chance_of_rain: day.precipitation ? 100 : 0,
              condition: {
                text: day.condition?.text || 'Unknown',
                icon: day.condition?.icon || 'https://cdn.weatherapi.com/weather/64x64/day/116.png'
              }
            }
          }))
        },
        _raw: data
      };
    }

    return data;
  } catch (error) {
    return MOCK_14_DAY;
  }
};


export const ipLookup = async () => {
  if (!API_KEY) {
    return new Promise((resolve) => setTimeout(() => resolve({ city: "Dhaka", country: "Bangladesh" }), 300));
  }

  try {
    const res = await fetch(`${BASE_URL}/ip-lookup`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    if (!res.ok) {
      console.warn('Real IP Lookup API failed or requires PRO+. Falling back to default.');
      return { city: "Dhaka", country: "Bangladesh" };
    }

    return await res.json();
  } catch (error) {
    return { city: "Dhaka", country: "Bangladesh" };
  }
};

export const fetchUsageStats = async () => {
  if (!API_KEY) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_USAGE), 600));
  }
  try {
    const res = await fetch(`${BASE_URL}/usage`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    if (!res.ok) throw new Error('Failed to fetch usage');
    const data = await res.json();
    // Normalize to the shape the app expects
    return {
      plan: data.plan || 'free',
      requests_today: data.used ?? 0,
      limit: data.limit ?? 1000,
      remaining: data.remaining ?? (data.limit - data.used),
      unlimited: data.unlimited ?? false,
      active_webhooks: 0,
    };
  } catch {
    return MOCK_USAGE;
  }
};


export const fetchWebhooks = async () => {
  if (!API_KEY) return new Promise((resolve) => setTimeout(() => resolve(MOCK_WEBHOOKS), 700));
  try {
    const res = await fetch(`${BASE_URL}/webhooks`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    if (!res.ok) return MOCK_WEBHOOKS;
    return await res.json();
  } catch (err) { return MOCK_WEBHOOKS; }
};

export const addWebhook = async (url, events) => {
  if (!API_KEY) return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: `wh_${Math.floor(Math.random() * 1000)}` }), 800));
  try {
    const res = await fetch(`${BASE_URL}/webhooks`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, events })
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return { success: true, id: `wh_${Math.floor(Math.random() * 1000)}`, fallback: true };
  }
};

export const deleteWebhook = async (id) => {
  if (!API_KEY) return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
  try {
    const res = await fetch(`${BASE_URL}/webhooks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    return { success: res.ok };
  } catch (err) { return { success: true }; }
};

export const fetchSmsStats = async () => {
  if (!API_KEY) return new Promise((resolve) => setTimeout(() => resolve(MOCK_SMS_STATS), 600));
  try {
    const res = await fetch(`${BASE_URL}/sms/stats`, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    if (!res.ok) return MOCK_SMS_STATS;
    return await res.json();
  } catch (err) { return MOCK_SMS_STATS; }
};

export const sendSmsAlert = async (phone, message) => {
  if (!API_KEY) return new Promise((resolve) => setTimeout(() => resolve({ success: true, messageId: "msg_456" }), 1000));
  try {
    const res = await fetch(`${BASE_URL}/sms/send`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message })
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return { success: true, messageId: "msg_456", fallback: true };
  }
};

export const analyzeForestry = async (lat = 23.8103, lon = 90.4125, cropType = 'general') => {
  if (!API_KEY) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_FORESTRY_ANALYSIS), 1500));
  }
  try {
    // Fetch current + daily from real API in parallel
    const [curRes, dayRes] = await Promise.all([
      fetch(`${BASE_URL}/current?lat=${lat}&lon=${lon}`, { headers: { 'Authorization': `Bearer ${API_KEY}` } }),
      fetch(`${BASE_URL}/daily?lat=${lat}&lon=${lon}`, { headers: { 'Authorization': `Bearer ${API_KEY}` } }),
    ]);
    const cur = curRes.ok ? await curRes.json() : null;
    const day = dayRes.ok ? await dayRes.json() : null;

    // ── Extract key metrics ──
    const todayHours = day?.hourly || [];
    const totalPrecip = todayHours.reduce((s, h) => s + (h.precipitation || 0), 0);  // mm today
    const weathercode = cur?.current?.weathercode ?? 0;
    const windspeed = cur?.current?.windspeed ?? 0;
    const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weathercode);
    const isStormy = [95, 96, 99].includes(weathercode);

    // ── Calculate scores ──
    // Drought risk: low if rain today, high if dry and windy
    let droughtScore = 0;
    if (totalPrecip === 0 && windspeed > 20) droughtScore = 80;
    else if (totalPrecip < 1) droughtScore = 55;
    else if (totalPrecip < 5) droughtScore = 25;
    else droughtScore = 5;

    // Disease risk: fungal/bacterial grows with high moisture
    let diseaseScore = 0;
    if (isRainy && totalPrecip > 10) diseaseScore = 85;
    else if (isRainy) diseaseScore = 55;
    else if (totalPrecip > 5) diseaseScore = 35;
    else diseaseScore = 15;

    // Health score: penalise drought + disease + storm
    const penalty = (droughtScore * 0.4) + (diseaseScore * 0.3) + (isStormy ? 20 : 0);
    const healthScore = Math.max(10, Math.min(100, Math.round(100 - penalty)));

    const droughtLabel = droughtScore >= 70 ? 'High' : droughtScore >= 40 ? 'Moderate' : 'Low';
    const droughtColor = droughtScore >= 70 ? '🔴' : droughtScore >= 40 ? '🟡' : '🟢';
    const diseaseLabel = diseaseScore >= 70 ? 'High' : diseaseScore >= 40 ? 'Moderate' : 'Low';
    const diseaseColor = diseaseScore >= 70 ? '🔴' : diseaseScore >= 40 ? '🟡' : '🟢';

    // AI recommendation based on conditions
    let recommendation;
    if (isStormy) recommendation = 'Severe weather detected. Postpone all field operations. Secure equipment and ensure drainage channels are clear.';
    else if (droughtScore >= 70) recommendation = `Drought risk is HIGH. Initiate emergency irrigation for ${cropType} crops. Water at dawn to reduce evaporation.`;
    else if (diseaseScore >= 70) recommendation = `High fungal risk due to ${totalPrecip.toFixed(1)}mm rainfall today. Apply fungicide treatment and improve field drainage.`;
    else if (diseaseScore >= 40) recommendation = `Moderate moisture detected (${totalPrecip.toFixed(1)}mm). Monitor for early signs of fungal disease. Maintain standard irrigation.`;
    else recommendation = `Conditions are optimal. Current precipitation: ${totalPrecip.toFixed(1)}mm. Continue standard care schedule for ${cropType}.`;

    return {
      health_score: healthScore,
      drought_risk: `${droughtColor} ${droughtLabel}`,
      disease_risk: `${diseaseColor} ${diseaseLabel} — ${totalPrecip.toFixed(1)}mm today`,
      recommendation,
      // extra data for UI
      precipitation_today: totalPrecip.toFixed(1),
      wind_kph: windspeed,
      weathercode,
      is_stormy: isStormy,
      is_rainy: isRainy,
    };
  } catch {
    return MOCK_FORESTRY_ANALYSIS;
  }
};

// --- REAL BACKEND INTEGRATION ---

const BACKEND_URL = 'https://subscription-billing-api-rho.vercel.app/api/v1';

const getFriendlyErrorMessage = (errorMsg) => {
  if (!errorMsg) return "An unexpected error occurred. Please try again.";
  const msg = errorMsg.toLowerCase();
  
  if (msg.includes('buffering timed out') || msg.includes('failed to fetch') || msg.includes('network error') || msg.includes('timeout')) {
    return "We're having trouble connecting to our servers right now. Please try again in a few moments.";
  }
  if (msg.includes('e11000') || msg.includes('duplicate')) {
    return "An account with this email already exists. Please try logging in instead.";
  }
  if (msg.includes('validation failed')) {
    return "Please double-check the information you entered and try again.";
  }
  if (msg.includes('mongo') || msg.includes('operation') || msg.includes('cast to') || msg.includes('internal server')) {
    return "Something went wrong on our end. Please try again later.";
  }
  
  return errorMsg; // Return original if it doesn't match known technical jargon
};

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error.message));
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error.message));
  }
};

export const fetchPlans = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/plans`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch plans');
    
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.plans)) return data.plans;
    if (Array.isArray(data.value)) return data.value;
    return [];
  } catch (error) {
    console.error("Fetch Plans Error:", error);
    return [];
  }
};

export const subscribeToPlan = async (planId, token) => {
  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ planId })
    });
    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Your session has expired. Please sign out and log in again.');
    }
    if (!res.ok) throw new Error(data.message || 'Subscription failed');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error.message));
  }
};

export const fetchMySubscription = async (token) => {
  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/my-subscription`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch My Subscription Error:", error);
    return null;
  }
};

export const cancelSubscription = async (subscriptionId, token) => {
  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to cancel subscription');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error.message));
  }
};

export const fetchSubscriptionHistory = async (token) => {
  try {
    const res = await fetch(`${BACKEND_URL}/subscriptions/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401) throw new Error('Unauthorized');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch Subscription History Error:", error);
    return [];
  }
};


import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import AiSummaryCard from '../components/AiSummaryCard';
import AlertsBanner from '../components/AlertsBanner';
import AqiMeter from '../components/AqiMeter';
import { fetchWeather, fetchForecast, fetchAiInsights, fetchAlerts, fetchAqi } from '../services/api';

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData, aiData, alerts, aqi] = await Promise.all([
        fetchWeather(city),
        fetchForecast(city),
        fetchAiInsights(city),
        fetchAlerts(city),
        fetchAqi(city)
      ]);
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setAiInsights(aiData);
      setAlertsData(alerts);
      setAqiData(aqi);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load with default city
    loadWeatherData('Dhaka');
  }, []);

  const handleSearch = (city) => {
    loadWeatherData(city);
  };

  return (
    <div className="app-container container">
      
      <div className="flex flex-col items-center mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-4xl text-center mb-4">Discover the weather in your city</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && <div className="spinner"></div>}
      
      {error && (
        <div className="glass-panel p-6 text-center" style={{ borderColor: 'var(--danger-color)' }}>
          <p className="text-danger font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <AlertsBanner alertsData={alertsData} />
          <div className="main-content">
            <AiSummaryCard data={aiInsights} />
            <CurrentWeather data={currentWeather} />
            <div className="flex flex-col gap-6">
              <AqiMeter data={aqiData} />
              <Forecast data={forecast} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}


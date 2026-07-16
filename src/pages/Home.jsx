import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import AiSummaryCard from '../components/AiSummaryCard';
import AlertsBanner from '../components/AlertsBanner';
import AqiMeter from '../components/AqiMeter';
import HourlyChart from '../components/HourlyChart';
import NearbyCities from '../components/NearbyCities';
import ExtendedForecast from '../components/ExtendedForecast';
import { fetchWeather, fetchForecast, fetchHourlyForecast, fetchAiInsights, fetchAlerts, fetchAqi, fetch14DayForecast } from '../services/api';

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecast14, setForecast14] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [nearbyCitiesData, setNearbyCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const nearbyCitiesList = ['Chittagong', 'Sylhet', 'Rajshahi'];
      
      const [weatherData, forecastData, forecast14Data, hourlyData, aiData, alerts, aqi, ...nearbyData] = await Promise.all([
        fetchWeather(city),
        fetchForecast(city),
        fetch14DayForecast(city),
        fetchHourlyForecast(city),
        fetchAiInsights(city),
        fetchAlerts(city),
        fetchAqi(city),
        ...nearbyCitiesList.map(c => fetchWeather(c))
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setForecast14(forecast14Data);
      setHourlyForecast(hourlyData);
      setAiInsights(aiData);
      setAlertsData(alerts);
      setAqiData(aqi);
      setNearbyCitiesData(nearbyData);
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
    <div className="flex flex-col min-h-screen max-w-[1400px] mx-auto px-6 md:px-16 w-full pb-16">
      
      <div className="flex flex-col items-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-6 tracking-tight text-whiteBright">Discover the weather in your city</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && (
        <div className="w-10 h-10 border-4 border-borderTint border-t-accent rounded-full animate-spin mx-auto my-12"></div>
      )}
      
      {error && (
        <div className="glass-panel p-6 text-center border-danger/50">
          <p className="text-danger font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col w-full gap-6">
          
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6 animate-fade-in w-full" style={{ animationDelay: '0.2s' }}>
            
            {/* Left Column (Hero) */}
            <div className="flex flex-col gap-6 w-full min-w-0">
              <CurrentWeather data={currentWeather} forecast={forecast} />
              <NearbyCities citiesData={nearbyCitiesData} />
              <AqiMeter data={aqiData} />
            </div>
            
            {/* Right Column */}
            <div className="flex flex-col gap-6 w-full min-w-0">
              <HourlyChart data={hourlyForecast} />
              <Forecast data={forecast} location={currentWeather?.location} current={currentWeather?.current} />
            </div>
          </div>

          {/* Bottom Full-Width Sections */}
          <div className="flex flex-col gap-6 animate-fade-in w-full" style={{ animationDelay: '0.3s' }}>
            <AlertsBanner alertsData={alertsData} />
            <AiSummaryCard data={aiInsights} />
            <ExtendedForecast data={forecast14} />
          </div>
        </div>
      )}
    </div>
  );
}


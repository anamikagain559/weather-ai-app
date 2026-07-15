import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import { fetchWeather, fetchForecast } from './services/api';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeather(city),
        fetchForecast(city)
      ]);
      setCurrentWeather(weatherData);
      setForecast(forecastData);
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
      <Header />
      
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
        <div className="main-content">
          <CurrentWeather data={currentWeather} />
          <Forecast data={forecast} />
        </div>
      )}
    </div>
  );
}

export default App;


import { useState, useEffect } from 'react';
import { OutdoorWeather } from '../types';

// Almaty Coordinates
const LAT = 43.238949;
const LON = 76.889709;

export const useOutdoorWeather = () => {
  const [data, setData] = useState<OutdoorWeather>({
    temp: 0,
    humidity: 0,
    aqi: 0,
    pm25: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 1. Fetch Basic Weather (Temp, Humidity)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m`
        );
        const weatherJson = await weatherRes.json();

        // 2. Fetch Air Quality (PM2.5, European AQI)
        const airRes = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}&current=pm2_5,european_aqi`
        );
        const airJson = await airRes.json();

        setData({
          temp: weatherJson.current.temperature_2m,
          humidity: weatherJson.current.relative_humidity_2m,
          aqi: airJson.current.european_aqi,
          pm25: airJson.current.pm2_5,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to fetch outdoor weather", err);
        setData(prev => ({ ...prev, loading: false, error: 'Failed to load weather data' }));
      }
    };

    fetchWeather();
    
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
};

import { NextRequest, NextResponse } from "next/server";

// Simple weather conditions for demo - deterministic based on destination coordinates
const WEATHER_PRESETS = [
  { temp: 24, condition: "Sunny", icon: "sun", humidity: 45, wind: 12, description: "Clear skies, perfect for outdoor activities" },
  { temp: 22, condition: "Partly Cloudy", icon: "cloud-sun", humidity: 55, wind: 15, description: "Comfortable with some clouds" },
  { temp: 19, condition: "Cloudy", icon: "cloud", humidity: 65, wind: 18, description: "Overcast but mild temperatures" },
  { temp: 17, condition: "Light Rain", icon: "cloud-rain", humidity: 78, wind: 20, description: "Light showers expected, bring an umbrella" },
  { temp: 28, condition: "Hot & Sunny", icon: "sun", humidity: 40, wind: 8, description: "Hot day ahead, stay hydrated" },
  { temp: 21, condition: "Breezy", icon: "wind", humidity: 50, wind: 25, description: "Windy conditions, great for sailing" },
];

function generateForecast(lat: number, lng: number) {
  // Use coordinates to deterministically pick weather (feels natural per location)
  const seed = Math.abs(Math.round(lat * 100 + lng * 10));
  const today = WEATHER_PRESETS[seed % WEATHER_PRESETS.length];

  const forecast = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const idx = (seed + i * 3) % WEATHER_PRESETS.length;
    const preset = WEATHER_PRESETS[idx];
    forecast.push({
      date: date.toISOString().slice(0, 10),
      dayName: i === 0 ? "Today" : date.toLocaleDateString("en", { weekday: "short" }),
      temp: preset.temp + Math.round((Math.sin(seed + i) * 3)),
      tempMin: preset.temp - 3 + Math.round((Math.sin(seed + i) * 2)),
      tempMax: preset.temp + 3 + Math.round((Math.cos(seed + i) * 2)),
      condition: preset.condition,
      icon: preset.icon,
      humidity: preset.humidity,
    });
  }

  return {
    current: {
      temp: today.temp,
      feelsLike: today.temp - 1,
      condition: today.condition,
      icon: today.icon,
      humidity: today.humidity,
      wind: today.wind,
      description: today.description,
    },
    forecast,
    location: { lat, lng },
    source: "demo",
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing lat and lng query parameters" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid coordinates" },
      { status: 400 }
    );
  }

  const data = generateForecast(latitude, longitude);
  return NextResponse.json(data);
}

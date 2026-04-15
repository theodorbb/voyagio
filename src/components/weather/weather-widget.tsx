"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  Loader2,
} from "lucide-react";

interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  description: string;
}

interface ForecastDay {
  date: string;
  dayName: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
}

interface WeatherResponse {
  current: WeatherCurrent;
  forecast: ForecastDay[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-rain": CloudRain,
  wind: Wind,
};

function WeatherIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = ICON_MAP[icon] || Sun;
  return <Icon className={className} />;
}

// Simple weather-aware suggestions
function getSuggestions(condition: string): string[] {
  const lower = condition.toLowerCase();
  if (lower.includes("rain")) {
    return [
      "Great for museums & cultural visits",
      "Try local indoor food markets",
      "Visit historic indoor landmarks",
    ];
  }
  if (lower.includes("hot")) {
    return [
      "Best for early morning activities",
      "Water sports & beach time ideal",
      "Stay hydrated, seek afternoon shade",
    ];
  }
  if (lower.includes("wind") || lower.includes("breezy")) {
    return [
      "Perfect for sailing & boat tours",
      "Kite surfing conditions are ideal",
      "Sheltered walks recommended",
    ];
  }
  if (lower.includes("cloud")) {
    return [
      "Ideal for walking tours & hikes",
      "Great photography conditions",
      "Comfortable for all-day exploring",
    ];
  }
  // Sunny / default
  return [
    "Perfect for outdoor adventures",
    "Don't forget sun protection",
    "Beach & nature activities ideal",
  ];
}

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  compact?: boolean;
  className?: string;
}

export function WeatherWidget({
  lat,
  lng,
  compact = false,
  className = "",
}: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error("Weather fetch failed");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        // Silently fail — component just won't show
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [lat, lng]);

  if (loading) {
    return (
      <div className={`glass-card p-5 ${className}`}>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-white/20" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { current, forecast } = data;
  const suggestions = getSuggestions(current.condition);

  if (compact) {
    return (
      <div className={`glass-card p-5 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <WeatherIcon icon={current.icon} className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">
                {current.temp}°C
              </span>
              <span className="text-xs text-white/40">{current.condition}</span>
            </div>
            <p className="text-[10px] text-white/30">{current.description}</p>
          </div>
        </div>

        {/* Mini forecast */}
        <div className="mt-4 flex gap-1">
          {forecast.slice(0, 5).map((day) => (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-white/[0.03] py-2"
            >
              <span className="text-[9px] text-white/30">{day.dayName}</span>
              <WeatherIcon
                icon={day.icon}
                className="h-3 w-3 text-white/40"
              />
              <span className="text-[10px] font-medium text-white/60">
                {day.temp}°
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full weather card
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      {/* Current weather header */}
      <div className="border-b border-white/[0.06] bg-gradient-to-r from-primary/5 to-accent/5 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Current Weather
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {current.temp}°C
              </span>
              <span className="text-sm text-white/40">
                Feels {current.feelsLike}°
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-white/70">
              {current.condition}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.05] p-3">
            <WeatherIcon icon={current.icon} className="h-8 w-8 text-accent" />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Droplets className="h-3.5 w-3.5" />
            <span>{current.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Wind className="h-3.5 w-3.5" />
            <span>{current.wind} km/h</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Thermometer className="h-3.5 w-3.5" />
            <span>Feels {current.feelsLike}°</span>
          </div>
        </div>
      </div>

      {/* 5-day forecast */}
      <div className="p-5">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-white/30">
          5-Day Forecast
        </p>
        <div className="space-y-2">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2"
            >
              <span className="w-10 text-xs font-medium text-white/50">
                {day.dayName}
              </span>
              <WeatherIcon
                icon={day.icon}
                className="h-4 w-4 text-white/40"
              />
              <span className="flex-1 text-[10px] text-white/30">
                {day.condition}
              </span>
              <span className="text-xs text-white/30">{day.tempMin}°</span>
              <div className="h-1 w-12 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/40 to-accent/40"
                  style={{
                    width: `${Math.min(100, ((day.temp - 10) / 25) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium text-white/60">
                {day.tempMax}°
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart suggestions */}
      <div className="border-t border-white/[0.06] bg-white/[0.02] p-5">
        <p className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-accent/60">
          Weather-Smart Tips
        </p>
        <div className="space-y-1.5">
          {suggestions.map((s) => (
            <div key={s} className="flex items-center gap-2 text-xs text-white/40">
              <span className="h-1 w-1 rounded-full bg-accent/40" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

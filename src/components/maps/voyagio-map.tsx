"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

// Leaflet is loaded dynamically to avoid SSR issues
let L: typeof import("leaflet") | null = null;

interface Marker {
  lat: number;
  lng: number;
  title: string;
  category?: string;
  price?: number;
  currency?: string;
  slug?: string;
  dayNumber?: number;
}

interface VoyagioMapProps {
  center: [number, number];
  zoom?: number;
  markers?: Marker[];
  height?: string;
  onMarkerClick?: (marker: Marker) => void;
  showDayColors?: boolean;
  className?: string;
}

const DAY_COLORS = [
  "#F4845F", // accent
  "#5FA8D3", // primary-light
  "#A78BFA", // purple
  "#22C55E", // green
  "#F7B267", // amber
  "#3B82F6", // blue
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F43F5E", // rose
  "#8B5CF6", // violet
];

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Wine": "#F7B267",
  Cultural: "#5FA8D3",
  Adventure: "#F4845F",
  Nature: "#22C55E",
  "Water Sports": "#3B82F6",
  Wellness: "#EC4899",
  Photography: "#A78BFA",
  Nightlife: "#8B5CF6",
};

function createMarkerIcon(color: string, label?: string) {
  if (!L) return undefined;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${color}" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
    <circle cx="14" cy="13" r="5" fill="white" opacity="0.9"/>
    ${label ? `<text x="14" y="16" text-anchor="middle" font-size="8" font-weight="bold" fill="${color}">${label}</text>` : ""}
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "voyagio-marker",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

export function VoyagioMap({
  center,
  zoom = 13,
  markers = [],
  height = "h-[300px]",
  onMarkerClick,
  showDayColors = false,
  className = "",
}: VoyagioMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    let mounted = true;

    async function init() {
      if (!L) {
        const leaflet = await import("leaflet");
        L = leaflet.default || leaflet;
        // Load leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }
      }

      if (!mounted || !mapRef.current) return;

      // Destroy existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(center, zoom);

      // Dark map tiles (CartoDB Dark Matter)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Add zoom control to bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add attribution
      L.control
        .attribution({ position: "bottomleft", prefix: false })
        .addAttribution(
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OSM</a> &copy; <a href="https://carto.com/" target="_blank" rel="noopener">CARTO</a>'
        )
        .addTo(map);

      // Add markers
      const bounds: [number, number][] = [];

      for (const m of markers) {
        let color = CATEGORY_COLORS[m.category || ""] || "#F4845F";
        let label: string | undefined;

        if (showDayColors && m.dayNumber) {
          color = DAY_COLORS[(m.dayNumber - 1) % DAY_COLORS.length];
          label = String(m.dayNumber);
        }

        const icon = createMarkerIcon(color, label);
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 160px;">
            <p style="font-weight: 700; font-size: 13px; margin: 0 0 4px; color: #1a1a2e;">${m.title}</p>
            ${m.category ? `<p style="font-size: 10px; color: #666; margin: 0 0 2px;">${m.category}</p>` : ""}
            ${m.price ? `<p style="font-size: 12px; font-weight: 600; color: ${color}; margin: 0;">${m.currency || "€"}${m.price}</p>` : ""}
            ${m.dayNumber ? `<p style="font-size: 10px; color: #888; margin: 2px 0 0;">Day ${m.dayNumber}</p>` : ""}
          </div>
        `;
        marker.bindPopup(popupContent, {
          className: "voyagio-popup",
          closeButton: false,
        });

        if (onMarkerClick) {
          marker.on("click", () => onMarkerClick(m));
        }

        bounds.push([m.lat, m.lng]);
      }

      // Fit bounds if multiple markers
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }

      mapInstanceRef.current = map;
      setReady(true);
    }

    init();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom, markers.length]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/[0.08] ${height} ${className}`}>
      <div ref={mapRef} className="absolute inset-0 z-0" />
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--background)]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-accent/50" />
            <p className="text-[10px] text-white/20">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers: { name: string; coordinates: [number, number]; origin: boolean }[] = [
  { name: "Sialkot Factory", coordinates: [74.53, 32.49], origin: true },
  { name: "USA", coordinates: [-95.71, 37.09], origin: false },
  { name: "Canada", coordinates: [-96.8, 56.13], origin: false },
  { name: "UK", coordinates: [-3.44, 55.38], origin: false },
  { name: "Germany", coordinates: [10.45, 51.17], origin: false },
  { name: "France", coordinates: [2.21, 46.23], origin: false },
  { name: "UAE", coordinates: [53.85, 23.42], origin: false },
  { name: "Saudi Arabia", coordinates: [45.08, 23.89], origin: false },
  { name: "Australia", coordinates: [133.78, -25.27], origin: false },
  { name: "South Africa", coordinates: [22.94, -30.56], origin: false },
  { name: "Nigeria", coordinates: [8.68, 9.08], origin: false },
  { name: "Mexico", coordinates: [-102.55, 23.63], origin: false },
];

export function WorldMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] p-4">
      {/* Legend */}
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-2 rounded-lg bg-black/60 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 shrink-0 rounded-full border-2 border-white bg-transparent" />
          <span className="text-xs text-white/70">Sialkot Factory Origin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c9a84c]" />
          <span className="text-xs text-white/70">Global Export Markets</span>
        </div>
      </div>

      <ComposableMap
        projectionConfig={{ scale: 147 }}
        width={980}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#1a1a1a", stroke: "#333333", strokeWidth: 0.5, outline: "none" },
                  hover: { fill: "#222222", stroke: "#333333", strokeWidth: 0.5, outline: "none" },
                  pressed: { fill: "#222222", stroke: "#333333", strokeWidth: 0.5, outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {markers.map((m) =>
          m.origin ? (
            <Marker key={m.name} coordinates={m.coordinates}>
              <circle r={6} fill="none" stroke="#c9a84c" strokeWidth={2} />
              <circle r={3} fill="#c9a84c" />
            </Marker>
          ) : (
            <Marker key={m.name} coordinates={m.coordinates}>
              <circle r={9} fill="none" stroke="#c9a84c" strokeWidth={1} opacity={0.3} />
              <circle r={5} fill="#c9a84c" opacity={0.8} />
            </Marker>
          )
        )}
      </ComposableMap>
    </div>
  );
}

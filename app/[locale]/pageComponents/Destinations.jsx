"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { resources } from "@/lib/i18n";

const routeGeometry = [
  { path: "M405 265 C385 258 386 239 405 232", x: 405, y: 232 },
  { path: "M405 265 C404 231 395 203 385 185", x: 385, y: 185 },
  { path: "M405 265 C374 269 344 282 320 295", x: 320, y: 295 },
  { path: "M405 265 C435 270 465 290 490 315", x: 490, y: 315 },
];

function EuropeMap({ activeIndex, regions, origin, mapLabel }) {
  return (
    <div className="relative h-[340px] overflow-hidden bg-[#282843] sm:aspect-[29/15] sm:h-auto">
      <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#191925]/80 px-3 py-2 text-xs font-bold text-white/78 backdrop-blur-sm sm:left-7 sm:top-7">
        <MapPin aria-hidden="true" size={14} className="text-[#E24A46]" />
        {origin}
      </div>

      <svg
        role="img"
        aria-label={mapLabel}
        viewBox="100 100 580 300"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="route-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="map-light" cx="60%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="680" height="540" fill="url(#map-light)" />
        <image
          href="/europe-map.svg"
          width="680"
          height="540"
          opacity="0.34"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: "grayscale(1) brightness(1.18)" }}
        />

        {routeGeometry.map((route, index) => {
          const active = index === activeIndex;
          return (
            <g key={route.path}>
              <path
                d={route.path}
                fill="none"
                stroke={active ? "#E24A46" : "#FFFFFF"}
                strokeOpacity={active ? "1" : "0.15"}
                strokeWidth={active ? "4" : "2"}
                strokeLinecap="round"
                strokeDasharray={active ? undefined : "5 8"}
                filter={active ? "url(#route-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle
                cx={route.x}
                cy={route.y}
                r={active ? "7" : "5"}
                fill={active ? "#E24A46" : "#77778E"}
                stroke="#282843"
                strokeWidth="3"
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        <circle
          cx={routeGeometry[activeIndex].x}
          cy={routeGeometry[activeIndex].y}
          r="18"
          fill="#E24A46"
          fillOpacity="0.16"
        >
          <animate attributeName="r" values="10;24;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.28;0.04;0.28" dur="2.4s" repeatCount="indefinite" />
        </circle>

        <circle key={`route-marker-${activeIndex}`} r="4.5" fill="#FFFFFF">
          <animateMotion
            path={routeGeometry[activeIndex].path}
            dur="2.8s"
            repeatCount="indefinite"
            keySplines="0.42 0 0.58 1"
            calcMode="spline"
          />
        </circle>

        <circle cx="405" cy="265" r="16" fill="#E24A46" fillOpacity="0.16" />
        <circle cx="405" cy="265" r="7" fill="#E24A46" stroke="#FFFFFF" strokeWidth="3" />

        <g fontFamily="Manrope, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF">
          <text x="419" y="258">{origin}</text>
          <text
            x={routeGeometry[activeIndex].x + (routeGeometry[activeIndex].x > 600 ? -12 : 12)}
            y={routeGeometry[activeIndex].y - 11}
            textAnchor={routeGeometry[activeIndex].x > 600 ? "end" : "start"}
            fill="#FFFFFF"
            fillOpacity="0.86"
          >
            {regions[activeIndex].title}
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function Destinations({ locale = "lt" }) {
  const destinations = (resources[locale] ?? resources.lt).common.destinations;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRegion = destinations.regions[activeIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % destinations.regions.length);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [activeIndex, destinations.regions.length]);

  return (
    <section id="kryptys" className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
            {destinations.eyebrow}
          </p>
          <h2 className="mt-5 text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1] tracking-[-0.035em] text-[#191925] text-balance">
            {destinations.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">
            {destinations.intro}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1050px] overflow-hidden rounded-2xl border border-[#D9D8E0] bg-[#313152] shadow-[0_20px_55px_rgba(25,25,37,0.12)]">
          <EuropeMap
            activeIndex={activeIndex}
            regions={destinations.regions}
            origin={destinations.origin}
            mapLabel={destinations.mapLabel}
          />

          <div className="border-t border-white/14 px-7 py-7 text-center text-white sm:px-10 sm:py-8">
            <div className="mx-auto max-w-3xl" aria-live="polite">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/48">
                {destinations.countriesLabel}
              </p>
              <h3 className="mt-3 text-xl font-bold">{activeRegion.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/68">{activeRegion.countries.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

const routeGeometry = [
  { path: "M405 265 C425 258 424 239 405 232", x: 405, y: 232, labelX: 12, labelY: -11, labelAnchor: "start" },
  { path: "M405 265 C404 231 395 203 385 185", x: 385, y: 185, labelX: 12, labelY: -11, labelAnchor: "start" },
  { path: "M405 265 C374 269 344 282 320 295", x: 320, y: 295, labelX: 84, labelY: 21, labelAnchor: "end" },
  { path: "M405 265 C350 242 278 240 224 282", x: 224, y: 282, labelX: 14, labelY: 34, labelAnchor: "start" },
];

const desktopMapViewBox = "20 100 580 300";
const mobileMapViewBox = "80 40 500 420";

export default function EuropeMap({ activeIndex, regions, origin, mapLabel }) {
  const [viewBox, setViewBox] = useState(desktopMapViewBox);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 639px)");
    const updateViewBox = () => {
      setViewBox(mobileQuery.matches ? mobileMapViewBox : desktopMapViewBox);
    };

    updateViewBox();
    mobileQuery.addEventListener("change", updateViewBox);

    return () => mobileQuery.removeEventListener("change", updateViewBox);
  }, []);

  return (
    <div className="relative h-[340px] overflow-hidden bg-[#282843] sm:aspect-[29/15] sm:h-auto">
      <svg
        role="img"
        aria-label={mapLabel}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
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
            dur="5.6s"
            repeatCount="indefinite"
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            calcMode="linear"
          />
        </circle>

        <circle cx="405" cy="265" r="16" fill="#E24A46" fillOpacity="0.16" />
        <circle cx="405" cy="265" r="7" fill="#E24A46" stroke="#FFFFFF" strokeWidth="3" />

        <g fontFamily="Manrope, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF">
          <text x="425" y="265">{origin}</text>
          <text
            x={routeGeometry[activeIndex].x + routeGeometry[activeIndex].labelX}
            y={routeGeometry[activeIndex].y + routeGeometry[activeIndex].labelY}
            textAnchor={routeGeometry[activeIndex].labelAnchor}
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


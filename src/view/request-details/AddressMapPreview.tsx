"use client";

import { useMemo, useState } from "react";

type MapProvider = "google" | "neshan" | "osm";

interface AddressMapPreviewProps {
  mapQuery: string;
  lat?: number;
  lng?: number;
  onOpenMaps: () => void;
}

function parseLatLng(
  lat?: number,
  lng?: number,
  mapQuery?: string,
): { lat: number; lng: number } | null {
  if (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0)
  ) {
    return { lat, lng };
  }

  const match = mapQuery
    ?.trim()
    .match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const parsedLat = Number(match[1]);
  const parsedLng = Number(match[2]);
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return null;
  if (parsedLat === 0 && parsedLng === 0) return null;
  return { lat: parsedLat, lng: parsedLng };
}

function buildProviderOrder(hasCoords: boolean): MapProvider[] {
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const neshanKey = process.env.NEXT_PUBLIC_NESHAN_API_KEY;
  const order: MapProvider[] = [];

  // Priority: Google → Neshan → OpenStreetMap
  if (googleKey && hasCoords) order.push("google");
  if (neshanKey && hasCoords) order.push("neshan");
  if (hasCoords) order.push("osm");
  return order;
}

function googleStaticUrl(lat: number, lng: number, key: string): string {
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: "15",
    size: "640x320",
    scale: "2",
    maptype: "roadmap",
    markers: `color:red|${lat},${lng}`,
    key,
    language: "fa",
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

function neshanStaticUrl(lat: number, lng: number, key: string): string {
  const params = new URLSearchParams({
    key,
    style: "light",
    width: "640",
    height: "320",
    zoom: "15",
    latitude: String(lat),
    longitude: String(lng),
    marker: "red",
  });
  return `https://api.neshan.org/v5/static?${params.toString()}`;
}

function osmEmbedUrl(lat: number, lng: number): string {
  const delta = 0.012;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function AddressMapPreview({
  mapQuery,
  lat,
  lng,
  onOpenMaps,
}: AddressMapPreviewProps) {
  const coords = useMemo(
    () => parseLatLng(lat, lng, mapQuery),
    [lat, lng, mapQuery],
  );
  const providers = useMemo(
    () => buildProviderOrder(Boolean(coords)),
    [coords],
  );
  const [providerIndex, setProviderIndex] = useState(0);
  const provider = providers[Math.min(providerIndex, providers.length - 1)];

  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const neshanKey = process.env.NEXT_PUBLIC_NESHAN_API_KEY ?? "";

  const advanceProvider = () => {
    setProviderIndex((i) => Math.min(i + 1, providers.length - 1));
  };

  if (!coords || providers.length === 0) {
    return (
      <button
        type="button"
        onClick={onOpenMaps}
        className="block w-full overflow-hidden rounded-2xl border-2 border-teal/30 text-start"
        aria-label="Open map"
      >
        <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-teal/10 via-blue-50 to-teal/20">
          <div className="h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
        </div>
      </button>
    );
  }

  const staticSrc =
    provider === "google"
      ? googleStaticUrl(coords.lat, coords.lng, googleKey)
      : provider === "neshan"
        ? neshanStaticUrl(coords.lat, coords.lng, neshanKey)
        : null;

  return (
    <button
      type="button"
      onClick={onOpenMaps}
      className="block w-full overflow-hidden rounded-2xl border-2 border-teal/30 text-start"
      aria-label="Open map"
    >
      <div className="relative h-40 bg-gradient-to-br from-teal/10 via-blue-50 to-teal/20">
        {staticSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={staticSrc}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={advanceProvider}
          />
        ) : (
          <iframe
            title="map"
            src={osmEmbedUrl(coords.lat, coords.lng)}
            className="pointer-events-none h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </button>
  );
}

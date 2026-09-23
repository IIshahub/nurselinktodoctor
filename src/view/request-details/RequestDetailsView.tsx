"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Arrow, Phone, NurseCare } from "@/src/components/icon";
import { TAB_STORAGE_KEY, useRequests } from "@/src/contexts/RequestsContext";
import type { CareRequest, CareRequestDetail } from "@/src/types/requests";
import AddressMapPreview from "./AddressMapPreview";

interface RequestDetailsViewProps {
  request: CareRequest;
}

export default function RequestDetailsView({ request }: RequestDetailsViewProps) {
  const t = useTranslations();
  const router = useRouter();
  const { approveRequest, ignoreRequest, loadRequestDetail } = useRequests();
  const [detail, setDetail] = useState<CareRequestDetail>(
    request.detail ?? {
      patientName: "—",
      phone: "",
      gender: "—",
      age: 0,
      services: request.title || "—",
      scheduledDate: request.date,
      scheduledTime: request.time,
      requestDate: request.date,
      requestTime: request.time,
      diseases: [],
      outlinedDiseases: [],
      patientComment: "",
      supervisorComment: "",
      address: request.address,
      mapQuery: request.address !== "—" ? request.address : "",
    },
  );
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingDetail(true);

    loadRequestDetail(request.id)
      .then((loaded) => {
        if (!cancelled && loaded) setDetail(loaded);
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
    // Only re-fetch when the request id changes — loadRequestDetail is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.id]);

  const handleAccept = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Approve via HomeTreatment/approve-new-request/{id}
      await approveRequest(request.id, detail);
      sessionStorage.setItem(TAB_STORAGE_KEY, "approved");
      router.replace("/");
    } catch {
      setSubmitting(false);
    }
  };

  const handleIgnore = async () => {
    if (submitting) return;
    setSubmitting(true);
    await ignoreRequest(request.id);
    router.replace("/");
  };

  const resolveCoords = (): { lat: number; lng: number } | null => {
    if (
      typeof detail.lat === "number" &&
      typeof detail.lng === "number" &&
      Number.isFinite(detail.lat) &&
      Number.isFinite(detail.lng) &&
      !(detail.lat === 0 && detail.lng === 0)
    ) {
      return { lat: detail.lat, lng: detail.lng };
    }
    const match = detail.mapQuery
      .trim()
      .match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (!match) return null;
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat === 0 && lng === 0) return null;
    return { lat, lng };
  };

  const openMapPicker = () => setShowMapPicker(true);

  const openInGoogleMaps = () => {
    setShowMapPicker(false);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.mapQuery)}`,
      "_blank",
    );
  };

  const openInNeshan = () => {
    setShowMapPicker(false);
    const coords = resolveCoords();
    // Official Neshan deep link — places a pin at lat/lng (web + app)
    // https://platform.neshan.org/FAQ/
    const url = coords
      ? `https://nshn.ir/?lat=${coords.lat}&lng=${coords.lng}`
      : `https://nshn.ir/?q=${encodeURIComponent(detail.address || detail.mapQuery)}`;
    window.open(url, "_blank");
  };

  const phoneHref = detail.phone ? `tel:${detail.phone}` : undefined;

  return (
    <div className="relative mx-auto w-full max-w-full overflow-x-hidden px-4 pt-3 pb-8">
      {loadingDetail && (
        <div className="absolute end-4 top-3 z-10 flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] text-primary shadow-sm dark:bg-[#2a2a3a]/90">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 mt-2 flex items-center gap-1 text-sm font-semibold text-primary"
      >
        <Arrow className="h-4 w-4 shrink-0 rotate-90" color="#0D50FF" />
        {t("back")}
      </button>

      <SectionTitle>{t("requestDetails")}</SectionTitle>
      <Card>
        <p className="break-words text-base font-bold text-primary">
          {detail.patientName}
        </p>
        {phoneHref ? (
          <a
            href={phoneHref}
            className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-sm text-teal underline"
          >
            <Phone className="h-4 w-4 shrink-0" color="#00BBD3" />
            {detail.phone}
          </a>
        ) : (
          <p className="mt-2 text-sm text-text/40">—</p>
        )}
        <p className="mt-2 text-xs text-text/50">
          {detail.gender}
          {detail.age > 0 ? ` · ${detail.age} ${t("yearsOld")}` : ""}
        </p>
      </Card>

      <SectionTitle>{t("requestedServices")}</SectionTitle>
      <Card>
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/10">
            <NurseCare className="h-5 w-5" color="#00BBD3" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-bold text-text">
              {request.title}
            </p>
            <p className="mt-1 break-words text-xs text-text/60">{detail.services}</p>
            <p className="mt-2 text-xs text-text/50">
              {detail.scheduledDate} - {detail.scheduledTime}
            </p>
          </div>
        </div>
      </Card>

      <SectionTitle>{t("requestTime")}</SectionTitle>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-text/70">{detail.requestDate} •</span>
          <span className="font-semibold text-text">{detail.requestTime}</span>
        </div>
      </Card>

      <SectionTitle>{t("diseases")}</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {detail.diseases.length > 0 ? (
          detail.diseases.map((disease) => (
            <span
              key={disease}
              className="max-w-full break-words rounded-full bg-teal/15 px-3 py-1 text-xs font-medium text-text"
            >
              {disease}
            </span>
          ))
        ) : (
          <span className="text-xs text-text/40">—</span>
        )}
        {detail.outlinedDiseases.map((disease) => (
          <span
            key={disease}
            className="max-w-full break-words rounded-full border border-text px-3 py-1 text-xs font-medium uppercase text-text"
          >
            {disease}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-10 min-w-0 rounded-xl border border-border bg-card"
          />
        ))}
      </div>

      <SectionTitle className="mt-5">{t("patientComment")}</SectionTitle>
      <Card className="border-2 border-teal">
        <p className="text-sm font-semibold text-text">{t("patientComment")}</p>
        <p className="mt-2 break-words text-xs text-text/50">
          {detail.patientComment || "—"}
        </p>
      </Card>

      <SectionTitle className="mt-5">{t("supervisorComment")}</SectionTitle>
      <Card className="border-2 border-red-500">
        <p className="text-sm font-bold text-text">{t("supervisorComment")}</p>
        <p className="mt-2 break-words text-sm text-red-500">
          {detail.supervisorComment || "—"}
        </p>
      </Card>

      <SectionTitle className="mt-5">{t("address")}</SectionTitle>
      {detail.address && detail.address !== "—" ? (
        <>
          <p className="mb-3 break-words text-sm font-bold leading-6 text-text">
            {t("address")}: {detail.address}
          </p>

          <AddressMapPreview
            mapQuery={detail.mapQuery}
            lat={detail.lat}
            lng={detail.lng}
            onOpenMaps={openMapPicker}
          />

          <button
            type="button"
            onClick={openMapPicker}
            className="mt-3 w-full rounded-2xl border-2 border-teal py-3 text-sm font-semibold text-teal transition hover:bg-teal/5"
          >
            {t("openInMaps")}
          </button>
        </>
      ) : (
        <Card>
          <p className="text-sm text-text/40">—</p>
        </Card>
      )}

      {showMapPicker && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 px-4 pb-8 backdrop-blur-[1px] sm:items-center sm:pb-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="map-picker-title"
          onClick={() => setShowMapPicker(false)}
        >
          <div
            className="w-full max-w-[360px] rounded-[24px] bg-white px-5 pb-5 pt-6 shadow-xl dark:bg-[#2a2a3a]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="map-picker-title"
              className="text-center text-[18px] font-bold text-[#0D50FF]"
            >
              {t("chooseMapApp")}
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={openInGoogleMaps}
                className="h-12 rounded-xl bg-[#0D50FF] text-[15px] font-semibold text-white transition-opacity active:opacity-90"
              >
                {t("openInGoogleMaps")}
              </button>
              <button
                type="button"
                onClick={openInNeshan}
                className="h-12 rounded-xl border-2 border-[#00A693] bg-white text-[15px] font-semibold text-[#00A693] transition-opacity active:opacity-80 dark:bg-transparent"
              >
                {t("openInNeshan")}
              </button>
              <button
                type="button"
                onClick={() => setShowMapPicker(false)}
                className="h-11 text-[14px] font-medium text-text/60 transition-opacity active:opacity-70"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 pb-4">
        <button
          type="button"
          onClick={handleAccept}
          disabled={submitting}
          className="rounded-2xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t("accept")}
            </span>
          ) : (
            t("accept")
          )}
        </button>
        <button
          type="button"
          onClick={handleIgnore}
          disabled={submitting}
          className="rounded-2xl border-2 border-teal py-3 text-sm font-bold text-teal transition hover:bg-teal/5 disabled:opacity-60"
        >
          {t("ignore")}
        </button>
      </div>
    </div>
  );
}

function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`mb-2 text-sm font-bold text-text ${className}`}>
      {children}
    </h2>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-4 min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

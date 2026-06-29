"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { CheckApprove, Emergency, Microscope } from "@/src/components/icon";
import type { LabRequest } from "@/src/types/requests";

interface SwipeRequestCardProps {
  request: LabRequest;
}

const SWIPE_THRESHOLD = 72;
const APPROVE_WIDTH = 56;

export default function SwipeRequestCard({ request }: SwipeRequestCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const startX = useRef(0);
  const dragging = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const releasePointer = () => {
    const surface = surfaceRef.current;
    if (
      surface &&
      pointerIdRef.current !== null &&
      surface.hasPointerCapture(pointerIdRef.current)
    ) {
      surface.releasePointerCapture(pointerIdRef.current);
    }
    pointerIdRef.current = null;
  };

  const handleApprove = () => {
    dragging.current = false;
    const surface = surfaceRef.current;
    if (surface) {
      surface.style.transform = "";
    }
    releasePointer();
    router.push(`/request/${request.id}`);
  };

  const setOffset = (offset: number) => {
    const node = surfaceRef.current;
    if (!node) return;
    const clamped = Math.max(-APPROVE_WIDTH, Math.min(0, offset));
    node.style.transform = `translateX(${clamped}px)`;
  };

  const resetOffset = () => setOffset(0);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={handleApprove}
        className="absolute inset-y-0 right-0 flex w-14 flex-col items-center justify-center gap-1 bg-teal text-white"
        aria-label={t("approve")}
      >
        <CheckApprove />
        <span className="text-[10px] font-semibold">{t("approve")}</span>
      </button>

      <div
        ref={surfaceRef}
        className="relative touch-pan-y transition-transform duration-200 ease-out"
        onPointerDown={(event) => {
          dragging.current = true;
          startX.current = event.clientX;
          pointerIdRef.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          const delta = event.clientX - startX.current;
          setOffset(delta > 0 ? 0 : delta);
        }}
        onPointerUp={(event) => {
          if (!dragging.current) return;
          dragging.current = false;
          releasePointer();

          const delta = event.clientX - startX.current;
          if (Math.abs(delta) >= SWIPE_THRESHOLD && delta < 0) {
            handleApprove();
            return;
          }
          resetOffset();
        }}
        onPointerCancel={() => {
          dragging.current = false;
          releasePointer();
          resetOffset();
        }}
      >
        <div className="flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-1 items-start gap-3 p-3">
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10">
                <Microscope className="h-5 w-5" color="#00BBD3" />
              </div>
              {request.isEmergency && (
                <div className="absolute -right-1 -top-1">
                  <Emergency />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-text">
                {request.title}
              </h3>
              <p className="mt-0.5 text-xs text-teal">
                {request.date} - {request.time}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-text/60">
                {request.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

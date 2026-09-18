"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const SWIPE_THRESHOLD = 72;
const APPROVE_WIDTH = 56;

interface SwipeableCardProps {
  action: ReactNode;
  children: ReactNode;
  onSwipeAction: () => void | Promise<void>;
  /** Play a peek/nudge hint so users discover swipe */
  showHint?: boolean;
  disabled?: boolean;
  actionClassName?: string;
  actionStyle?: CSSProperties;
  actionAriaLabel?: string;
}

export default function SwipeableCard({
  action,
  children,
  onSwipeAction,
  showHint = false,
  disabled = false,
  actionClassName = "bg-teal",
  actionStyle,
  actionAriaLabel,
}: SwipeableCardProps) {
  const startX = useRef(0);
  const dragging = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [hintActive, setHintActive] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!showHint || disabled) {
      setHintActive(false);
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    const startTimer = window.setTimeout(() => setHintActive(true), 450);
    const stopTimer = window.setTimeout(() => setHintActive(false), 4300);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(stopTimer);
    };
  }, [showHint, disabled]);

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

  const setOffset = (offset: number) => {
    const node = surfaceRef.current;
    if (!node) return;
    const clamped = Math.max(-APPROVE_WIDTH, Math.min(0, offset));
    node.style.transform = `translateX(${clamped}px)`;
  };

  const resetOffset = () => setOffset(0);

  const stopHint = () => {
    if (hintActive) setHintActive(false);
  };

  const triggerAction = () => {
    if (disabled || busy) return;
    setBusy(true);
    dragging.current = false;
    stopHint();
    const surface = surfaceRef.current;
    if (surface) surface.style.transform = "";
    releasePointer();

    void (async () => {
      try {
        await onSwipeAction();
      } finally {
        // Keep spinner if parent still marks this card disabled.
        setBusy(false);
      }
    })();
  };

  const showSpinner = busy || disabled;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={triggerAction}
        disabled={disabled}
        className={`absolute inset-y-0 right-0 flex w-14 flex-col items-center justify-center gap-1 text-white disabled:cursor-not-allowed disabled:opacity-60 ${actionClassName}`}
        style={actionStyle}
        aria-label={actionAriaLabel}
      >
        {action}
      </button>

      <div
        ref={surfaceRef}
        className={`relative touch-pan-y ease-out ${
          hintActive
            ? "swipe-hint-nudge"
            : "transition-transform duration-200"
        }`}
        onAnimationEnd={() => setHintActive(false)}
        onPointerDown={(event) => {
          if (disabled) return;
          stopHint();
          dragging.current = true;
          startX.current = event.clientX;
          pointerIdRef.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging.current || disabled) return;
          const delta = event.clientX - startX.current;
          setOffset(delta > 0 ? 0 : delta);
        }}
        onPointerUp={(event) => {
          if (!dragging.current) return;
          dragging.current = false;
          releasePointer();

          const delta = event.clientX - startX.current;
          if (Math.abs(delta) >= SWIPE_THRESHOLD && delta < 0) {
            triggerAction();
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
        {children}
      </div>

      {showSpinner && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/75 backdrop-blur-[1px] dark:bg-[#1a1a1a]/70">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder: string;
  disabled?: boolean;
  emptyText?: string;
};

export default function FormSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  emptyText = "",
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const showSearch = options.length > 6;
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && showSearch) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, showSearch]);

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className={open ? "relative z-30" : "relative"}>
      <button
        type="button"
        disabled={disabled || options.length === 0}
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-[45px] w-full items-center justify-between rounded-[13px] border border-[#E2E8F0] bg-[#FEFEFD] px-4 text-start disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`login-input min-w-0 flex-1 truncate text-[13px] ${
            selectedLabel ? "text-[#2671FD]" : "text-[#93B4F5]"
          }`}
        >
          {selectedLabel || placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={`ms-2 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="#2671FD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[13px] border border-[#E2E8F0] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
          {showSearch && (
            <div className="border-b border-[#E2E8F0] p-2">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="login-input h-9 w-full rounded-[10px] border border-[#E2E8F0] bg-[#FEFEFD] px-3 text-[13px] text-[#2671FD] placeholder:text-[#93B4F5] focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          )}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="login-text px-4 py-3 text-[12px] text-[#6B7280]">
                {emptyText || "—"}
              </p>
            ) : (
              filtered.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSelect(option.value);
                    }}
                    className={`login-text flex w-full px-4 py-2.5 text-start text-[13px] transition-colors ${
                      isSelected
                        ? "bg-[#2563EB] text-white"
                        : "text-[#2671FD] hover:bg-[#EFF6FF]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

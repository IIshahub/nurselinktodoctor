"use client";

import React, { useState } from "react";
import Link from "next/link";
import Modal from "./modal";
import { useTranslations } from "next-intl";

interface GridItem {
  id?: number;
  icon: React.ReactNode;
  title: string;
  route: string;
  additionalcss?: string;
  additional?: React.ReactNode;
}

interface GridProps {
  data: GridItem[];
  cols: number;
  additionalcss?: string;
}

export default function Grid({ data, cols, additionalcss }: GridProps) {
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);
  const t = useTranslations();

  const getGridCols = (columns: number): string => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    };
    return colsMap[columns] || "grid-cols-2";
  };

  if (!data?.length) {
    return null;
  }

  return (
    <>
      <div className={`grid ${getGridCols(cols)} gap-4 px-4`}>
        {data.map((item) => (
          <div
            key={item.id ?? item.title}
            className={additionalcss || ""}
            style={{ boxShadow: "none" }}
          >
            {item.route !== "#" ? (
              <Link href={item.route}>
                <div
                  className={`flex items-center justify-center py-4 ${
                    item.additionalcss || ""
                  }`}
                >
                  <div className="scale-125">{item.icon}</div>
                </div>
                <p className="pt-2 text-center text-[0.8rem] font-bold text-black dark:text-white">
                  {item.title}
                </p>
                {item.additional}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="w-full text-left"
              >
                <div
                  className={`flex items-center justify-center py-4 ${
                    item.additionalcss || ""
                  }`}
                >
                  <div className="scale-125">{item.icon}</div>
                </div>
                <p className="pt-2 text-center text-[0.8rem] font-bold text-black dark:text-white">
                  {item.title}
                </p>
                {item.additional}
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <Modal
          open
          position="middle"
          onClose={() => setSelectedItem(null)}
          additional={
            <div className="text-center">
              <div className="flex scale-125 justify-center py-4">
                {selectedItem.icon}
              </div>
              <p className="font-bold">{selectedItem.title}</p>
              <p className="mt-2 text-sm text-text/60">{t("comingsoon")}</p>
            </div>
          }
        />
      )}
    </>
  );
}

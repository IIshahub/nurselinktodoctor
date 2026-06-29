import { useTranslations } from "next-intl";
import {
  CaseSummary,
  PreviousPatients,
  Rollcall,
  Schedule,
} from "@/src/components/icon";

const PRIMARY = "#2068fe";

export default function useLabConfig() {
  const t = useTranslations();

  const StatsData = [
    { id: 1, value: "5", label: t("approved"), valueColor: "#9333EA" },
    { id: 2, value: "15", label: t("completed"), valueColor: "#16A34A" },
    { id: 3, value: "20", label: t("newRequests"), valueColor: "#EF4444" },
    { id: 4, value: "4.8", label: t("rating"), valueColor: "#EAB308", showStar: true },
  ];

  const MenuItems = [
    {
      id: 1,
      title: t("caseSummary"),
      additional: (
        <div className="text-center text-[0.8rem] text-gray-500 dark:text-gray-400">
          {t("viewPatientRecords")}
        </div>
      ),
      icon: <CaseSummary color={PRIMARY} className="scale-125" />,
      route: "/case-summary",
    },
    {
      id: 2,
      title: t("rollcall"),
      additional: (
        <div className="text-center text-[0.8rem] text-gray-500 dark:text-gray-400">
          {t("rollcallSubtitle")}
        </div>
      ),
      icon: <Rollcall color={PRIMARY} />,
      route: "/rollcall",
    },
    {
      id: 3,
      title: t("schedulingForm"),
      icon: <Schedule color={PRIMARY} />,
      route: "/scheduling",
    },
    {
      id: 4,
      title: t("previousPatients"),
      additional: (
        <div className="text-center text-[0.8rem] text-gray-500 dark:text-gray-400">
          {t("viewManagePatients")}
        </div>
      ),
      icon: <PreviousPatients />,
      route: "/previous-patients",
    },
  ];

  const LabData = {
    name: t("name"),
    image: "/assets/girl.png",
  };

  return { LabData, DoctorData: LabData, MenuItems, StatsData };
}

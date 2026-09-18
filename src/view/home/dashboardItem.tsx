import { useTranslations } from "next-intl";

export default function useLabConfig() {
  const t = useTranslations();

  const StatsData = [
    { id: 1, value: "5", label: t("approved"), valueColor: "#9333EA" },
    { id: 2, value: "15", label: t("completed"), valueColor: "#16A34A" },
    { id: 3, value: "20", label: t("newRequests"), valueColor: "#EF4444" },
    {
      id: 4,
      value: "4.8",
      label: t("rating"),
      valueColor: "#EAB308",
      showStar: true,
    },
  ];

  const LabData = {
    name: t("name"),
    image: "/assets/girl.png",
  };

  return { LabData, DoctorData: LabData, StatsData };
}

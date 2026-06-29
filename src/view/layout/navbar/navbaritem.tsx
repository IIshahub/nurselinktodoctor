import {
  Chat,
  Financial,
  Home,
  UserProfile,
} from "@/src/components/icon";
import { useTranslations } from "next-intl";

const PRIMARY = "#0D50FF";

export default function NavbarItem() {
  const t = useTranslations();

  return [
    {
      icon: <Home className="h-6 w-6" />,
      iconActive: <Home className="h-6 w-6" color={PRIMARY} />,
      title: t("home"),
      slug: "/",
    },
    {
      icon: <Financial className="h-6 w-6" />,
      iconActive: <Financial className="h-6 w-6" color={PRIMARY} />,
      title: t("financial"),
      slug: "/financial",
    },
    {
      icon: <Chat className="h-6 w-6" />,
      iconActive: <Chat className="h-6 w-6" color={PRIMARY} />,
      title: t("chatOnline"),
      slug: "/chat",
    },
    {
      icon: <UserProfile className="h-6 w-6" />,
      iconActive: <UserProfile className="h-6 w-6" color={PRIMARY} />,
      title: t("profile"),
      slug: "/profile",
    },
  ];
}

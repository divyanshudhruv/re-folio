"use client";

import {
  Column,
  Text,
  Row,
  Avatar,
  Button,
  useToast,
} from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import { supabase } from "@/app/lib/supabase";
// Removed unused Router import

export default function NavSettings({
  name = "User",
  descriptionWords = "Someone",
  location = "Earth",
  avatar = "",
}: {
  name?: string;
  descriptionWords?: string;
  location?: string;
  avatar?: string;
}) {
  const displayName = name || "User";
  const displayDescriptionWords = descriptionWords || "Someone";
  const displayLocation = location || "Earth";
  const { addToast } = useToast();

  const logoutFromSupabase = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      addToast({
        variant: "danger",
        message: <Text onBackground="neutral-medium">Failed to log out</Text>,
      });
    } else {
      addToast({
        variant: "success",
        message: (
          <Text onBackground="neutral-medium">Logged out successfully</Text>
        ),
      });
      const router = useRouter();
      router.push("/"); // Redirect to home page after logout
    }
  };
  return (
    <Row
      fillWidth
      fitHeight
      horizontal="space-between"
      vertical="center"
      padding="s"
    >
      <Row fitWidth fillHeight center gap="8">
        <Avatar size={2.7} src={avatar}></Avatar>
        <Column horizontal="start" vertical="center" fitWidth fitHeight gap="1">
          <Text
            variant="body-strong-s"
            onBackground="neutral-medium"
            className={inter.className}
          >
            {displayName}
          </Text>
          <Row>
            {" "}
            <Text
              variant="body-default-xs"
              style={{ color: "#6B6B6B" }}
              className={inter.className}
            >
              {displayDescriptionWords}
            </Text>
            <Text
              variant="body-default-xs"
              style={{ color: "#6B6B6B" }}
              className={inter.className}
            >
              &nbsp;•&nbsp;{displayLocation}
            </Text>
          </Row>
        </Column>
      </Row>
      <Row fitWidth fillHeight center gap="8">
        <Button
          variant="secondary"
          size="m"
          style={{ backgroundColor: "#1c1c1c", padding: "5px 7px" }}
          onClick={logoutFromSupabase}
        >
          <Text variant="body-default-m" style={{ color: "#6B6B6B" }}>
            <i className="ri-logout-box-r-line"></i>
          </Text>
        </Button>
        <Button
          variant="secondary"
          size="m"
          style={{ backgroundColor: "#1c1c1c", padding: "5px 12px" }}
        >
          <Text variant="body-default-m" style={{ color: "#6B6B6B" }}>
            <i className="ri-window-line"></i>&nbsp;Dashboard
          </Text>
        </Button>
      </Row>
    </Row>
  );
}

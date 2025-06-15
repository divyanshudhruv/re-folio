"use client";

import {
  Column,
  Text,
  Row,
  Avatar,
  Button,
  useToast,
  UserMenu,
  Option,
  Icon,
} from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function NavSettings({ id }: { id: string }) {
  const [userData, setUserData] = useState<{
    name: string;
    description: string;
    location: string;
    pfp?: string;
  } | null>(null);
  const { addToast } = useToast();
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("nav,username")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUserData(data.nav);
          setUsername(data.username);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUserData();
  }, [id]);

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

      window.location.href = "/";
    }
  };

  if (!userData) {
    return <Text></Text>;
  }

  const { name, description, location, pfp } = userData;

  return (
    <Row
      fillWidth
      fitHeight
      horizontal="space-between"
      vertical="center"
      padding="s"
    >
      <Row fitWidth fillHeight center gap="8">
        <Avatar size={2.7} src={pfp || ""}></Avatar>
        <Column horizontal="start" vertical="center" fitWidth fitHeight gap="1">
          <Text
            variant="body-strong-s"
            onBackground="neutral-medium"
            className={inter.className}
          >
            {name}
          </Text>
          <Row>
            <Text
              variant="body-default-xs"
              style={{ color: "#6B6B6B" }}
              className={inter.className}
            >
              {description}
            </Text>
            <Text
              variant="body-default-xs"
              style={{ color: "#6B6B6B" }}
              className={inter.className}
            >
              &nbsp;•&nbsp;{location}
            </Text>
          </Row>
        </Column>
      </Row>
      <Row fitWidth fillHeight center gap="8">
        {/* <Button
          variant="secondary"
          size="m"
          style={{ backgroundColor: "#1c1c1c", padding: "5px 7px" }}
          onClick={logoutFromSupabase}
        >
          <Text variant="body-default-m" style={{ color: "#6B6B6B" }}>
            <i className="ri-logout-box-r-line"></i>&nbsp;Logout
          </Text>
        </Button>
        <Button
          variant="secondary"
          size="m"
          style={{ backgroundColor: "#1c1c1c", padding: "5px 12px" }}
          onClick={() =>
            window.open(`https://re-folio.vercel.app/@${username}`, "blank")
          }
        >
          <Text variant="body-default-m" style={{ color: "#6B6B6B" }}>
            <i className="ri-window-line"></i>&nbsp;Preview
          </Text>
        </Button> */}
        <UserMenu
          name=""
          placement="right-start"
          avatarProps={{
            src: "https://i.pinimg.com/originals/6f/e1/02/6fe10243d59a6ee869d3da7302285245.png",
          }}
          dropdown={
            <Column gap="4" padding="4" minWidth={10}>
              <Option
                value=""
                hasPrefix={
                  <Icon size="xs" onBackground="neutral-weak" name="logout" />
                }
                onClick={logoutFromSupabase}
              >
                {" "}
                <Text variant="body-default-s" style={{ color: "#6B6B6B" }}>
                  <i className="ri-logout-box-r-line"></i>&nbsp;Logout
                </Text>{" "}
              </Option>
              <Option
                value=""
                hasPrefix={
                  <Icon size="xs" onBackground="neutral-weak" name="preview" />
                }
                onClick={() =>
                  window.open(
                    `https://re-folio.vercel.app/@${username}`,
                    "blank"
                  )
                }
              >
                {" "}
                <Text variant="body-default-s" style={{ color: "#6B6B6B" }}>
                  <i className="ri-window-line"></i>&nbsp;Preview
                </Text>
              </Option>
            </Column>
          }
        />
      </Row>
    </Row>
  );
}

"use client";

import "./../global.css";
import { Column, Text, Row, Avatar, Button, Flex } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface UserData {
  name: string;
  email: string;
  location: string;
  description: string;
  pfp?: string;
}

export default function Nav({ id }: { id: string }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("nav,name")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        } 

        if (data) {
          setUserData(data.nav);
        }
        
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUserData();
  }, [id]);

  
  useEffect(() => {
    const fetchUserPfp = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("pfp")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching user profile picture:", error);
          return;
        }

        if (data) {
          setUserData((prev) => (prev ? { ...prev, pfp: data.pfp } : prev));
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUserPfp();
  }, [id]);

  if (!userData) {
    return <Text></Text>;
  }

  const { name, email, location, description, pfp } = userData;

  return (
    <>
      <Row
        fillWidth
        fitHeight
        horizontal="space-between"
        vertical="center"
        padding="s"
      >
        <Row vertical="center" gap="8">
          {" "}
          <Avatar size={2.7} src={pfp || ""} />
          <Column
            horizontal="start"
            vertical="center"
            fitWidth
            fitHeight
            gap="1"
          >
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
              {location && (
                <Text
                  variant="body-default-xs"
                  style={{ color: "#6B6B6B" }}
                  className={inter.className}
                >
                  &nbsp;•&nbsp;{location}
                </Text>
              )}
            </Row>
          </Column>
        </Row>
        <Row fitWidth fillHeight center>
          <Button
            variant="secondary"
            size="m"
            style={{ backgroundColor: "#1c1c1c", padding: "5px 12px" }}
            onClick={() => window.open(`mailto:${email}`, "_blank")}
          >
            <Text variant="body-default-m" style={{ color: "#6B6B6B" }}>
              <i className="ri-links-line"></i>&nbsp;E-mail
            </Text>
          </Button>
        </Row>
      </Row>
      <Flex fillWidth height={2.5} />
    </>
  );
}

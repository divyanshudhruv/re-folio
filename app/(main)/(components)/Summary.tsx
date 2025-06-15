"use client";

import { Column, Flex, IconButton, Row, Text } from "@once-ui-system/core";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import { Cedarville_Cursive } from "next/font/google";
const cedarvilleCursive = Cedarville_Cursive({
  subsets: ["latin"],
  variable: "--font-cedarville-cursive",
  display: "swap",
  weight: ["400"],
});
import "./../global.css";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import React from "react";

export default function Summary({ id }: { id: string }) {
  const [socialLinks, setSocialLinks] = useState<{
    linkedin?: string;
    twitter?: string;
    github?: string;
  }>({});
  const [paragraph, setParagraph] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("summary,name")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          if (data.summary) {
            setSocialLinks(data.summary.socialLinks || {});
            setParagraph(data.summary.paragraph || "");
            setName(data.name || "User");
          } else {
            console.error("Summary data is undefined");
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
    <Column fillWidth fitHeight paddingX="s" gap="16">
      <Text
        variant="heading-strong-xs"
        onBackground="neutral-medium"
        className={inter.className}
      >
        Summary
      </Text>
      <Text
        className={
          inter.className + " text-paragraph text-responsive-paragraph"
        }
      >
        {paragraph.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Text>
      <Flex></Flex>
      <Row vertical="center" horizontal="space-between" fillWidth fitHeight>
        <SocialLinks links={socialLinks} />
        <Text className={cedarvilleCursive.className + " text-signature"}>
          {name}
        </Text>
      </Row>
    </Column>
     <Flex fillWidth height={2.5}></Flex></>
  );
}

function SocialLinks({
  links,
}: {
  links: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}) {
  return (
    <Flex gap="8" center fitWidth fitHeight>
      {links.linkedin && (
        <IconButton variant="secondary" href={links.linkedin}>
          <Text className="text-big-darker">
            <i className="ri-linkedin-line"></i>
          </Text>
        </IconButton>
      )}
      {links.twitter && (
        <IconButton variant="secondary" href={links.twitter}>
          <Text className="text-big-darker">
            <i className="ri-twitter-x-line"></i>
          </Text>
        </IconButton>
      )}
      {links.github && (
        <IconButton variant="secondary" href={links.github}>
          <Text className="text-big-darker">
            <i className="ri-github-line"></i>
          </Text>
        </IconButton>
      )}
    </Flex>
  );
}

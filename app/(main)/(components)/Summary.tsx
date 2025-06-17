"use client";

import { Column, Flex, IconButton, Row, Text } from "@once-ui-system/core";
import { Inter, Cedarville_Cursive } from "next/font/google";
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/app/lib/supabase";
import "./../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const cedarvilleCursive = Cedarville_Cursive({
  subsets: ["latin"],
  variable: "--font-cedarville-cursive",
  display: "swap",
  weight: ["400"],
});

interface SocialLinksProps {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface SummaryProps {
  id: string;
}

export default function Summary({ id }: SummaryProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>({});
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
          return;
        }

        if (data?.summary) {
          setSocialLinks(data.summary.socialLinks || {});
          setParagraph(data.summary.paragraph || "");
          setName(data.name || "User");
        } else {
          console.error("Summary data is undefined");
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
          className={`${inter.className} text-paragraph text-responsive-paragraph`}
        >
          {paragraph.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Text>
        <Flex />
        <Row vertical="center" horizontal="space-between" fillWidth fitHeight>
          <SocialLinks links={socialLinks} />
          <Text className={`${cedarvilleCursive.className} text-signature`}>
            {name}
          </Text>
        </Row>
      </Column>
      <Flex fillWidth height={2.5} />
    </>
  );
}

function SocialLinks({ links }: { links: SocialLinksProps }) {
  const renderIconButton = (href: string, iconClass: string) => (
    <IconButton variant="secondary" href={href}>
      <Text className="text-big-darker">
        <i className={iconClass}></i>
      </Text>
    </IconButton>
  );

  return (
    <Flex gap="8" center fitWidth fitHeight>
      {links.linkedin && renderIconButton(links.linkedin, "ri-linkedin-line")}
      {links.twitter && renderIconButton(links.twitter, "ri-twitter-x-line")}
      {links.github && renderIconButton(links.github, "ri-github-line")}
    </Flex>
  );
}

"use client";

import { Column, Text, Flex, Row, Kbd } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import "./../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface IntroData {
  tags: string[];
  heading: string;
  subheading: string;
  paragraphs: string[];
}

export default function Intro({ id }: { id: string }) {
  const [introData, setIntroData] = useState<IntroData | null>(null);
  const [usernameAuthorTag, setUsernameAuthorTag] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchIntroData = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("intro")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching intro data:", error);
          return;
        }
        setIntroData(data.intro as IntroData);

      
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    const fetchUsernameAuthorTag = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching username:", error);
        } else {
          setUsernameAuthorTag(data.username);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
    fetchIntroData();
    fetchUsernameAuthorTag();
  }, [id]);

  if (!introData) {
    return <Text></Text>;
  }

  const { tags, heading, subheading, paragraphs } = introData;

  const hasValidData = Object.keys(introData).some(
    (key) =>
      key !== "id" &&
      ["tags", "heading", "subheading", "paragraphs"].includes(key) &&
      introData[key as keyof IntroData]?.length > 0
  );

  if (!hasValidData) {
    return null;
  }

  return (
    <>
      <Column
        fillWidth
        fitHeight
        horizontal="space-between"
        vertical="center"
        paddingBottom="m"
        paddingX="s"
        gap="12"
      >
        <Text
          variant="heading-strong-xl"
          className={`${inter.className} text-responsive-heading`}
          style={{
            lineHeight: "1.4",
            fontSize: "30px",
            letterSpacing: "-0.1px",
            color: "#ddd",
          }}
        >
          {heading} <Text style={{ color: "#6B6B6B" }}>{subheading}</Text>
        </Text>
        <Flex fillWidth />
        {paragraphs.map((text, index) => (
          <Text
            key={index}
            className={`${inter.className} text-paragraph text-responsive-paragraph`}
          >
            {text}
          </Text>
        ))}
        <Flex />
        <Row gap="8">
          {tags.map((tag, index) => (
            <Kbd
              key={index}
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              onBackground="neutral-weak"
            >
              {tag}
            </Kbd>
          ))}

          {usernameAuthorTag === "divyanshudhruv" && (
            <Kbd
              background="accent-medium"
              border="accent-medium"
              onBackground="accent-weak"
              height={1.3}
            >
              Creator
            </Kbd>
          )}
        </Row>
      </Column>
      <Flex fillWidth height={2.5} />
    </>
  );
}

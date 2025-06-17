"use client";

import {
  Column,
  Text,
  Grid,
  Row,
  Kbd,
  Flex,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import "./../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface Language {
  name: string;
  proficiency: string;
}

interface LanguagesProps {
  id: string;
}

export default function Languages({ id }: LanguagesProps) {
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("languages")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching languages:", error);
          return;
        }

        if (data?.languages) {
          setLanguages(data.languages);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchLanguages();
  }, [id]);

  if (
    languages.length === 0 ||
    !languages.some((language) => language.name && language.proficiency)
  ) {
    return null;
  }

  return (
    <>
      <Column fillWidth fitHeight paddingX="s" gap="16">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Languages Spoken
        </Text>
        <Grid fillWidth fitHeight columns={1}>
          {languages.map((language, index) => (
            <LanguageCard
              key={index}
              name={language.name}
              proficiency={language.proficiency}
            />
          ))}
        </Grid>
      </Column>
      <Flex fillWidth height={2.5}></Flex>
    </>
  );
}

interface LanguageCardProps {
  name: string;
  proficiency: string;
}

const LanguageCard = ({ name, proficiency }: LanguageCardProps) => (
  <Row
    direction="row"
    padding="s"
    vertical="center"
    fillWidth
    flex={1}
    fitHeight
    maxHeight={2.5}
  >
    <Row vertical="center" gap="8" horizontal="space-between" fillWidth>
      <Text
        variant="label-default-s"
        className={`${inter.className} text-big-lighter`}
      >
        {name}
      </Text>
      <Kbd
        background="neutral-alpha-weak"
        border="neutral-alpha-weak"
        onBackground="neutral-weak"
      >
        {proficiency}
      </Kbd>
    </Row>
  </Row>
);

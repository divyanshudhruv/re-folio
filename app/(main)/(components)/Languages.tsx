"use client";

import {
  Column,
  Text,
  Grid,
  Row,
  Kbd,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import "./../global.css";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

export default function Languages({ id }: { id: string }) {
  const [languages, setLanguages] = useState<
    { name: string; proficiency: string }[]
  >([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("languages")
          .eq("username",id)
          .single();

        if (error) {
          console.error("Error fetching languages:", error);
        } else {
          setLanguages(data.languages);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchLanguages();
  }, [id]);

  return (
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
  );
}

const LanguageCard = ({
  name,
  proficiency,
}: {
  name: string;
  proficiency: string;
}) => {
  return (
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
          className={inter.className + " text-big-lighter"}
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
};

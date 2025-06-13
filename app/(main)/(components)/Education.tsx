"use client";

import { Column, Text, Flex, Card, Grid } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import "./../global.css";

export default function Education({ id }: { id: string }) {
  const [educationData, setEducationData] = useState<
    { title: string; institution: string; duration: string; description: string }[]
  >([]);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("education")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching education data:", error);
        } else {
          setEducationData(data.education);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchEducationData();
  }, [id]);

  return (
    <Column fillWidth fitHeight paddingX="s" gap="16">
      <Text
        variant="heading-strong-xs"
        onBackground="neutral-medium"
        className={inter.className}
      >
        Education
      </Text>
      <Grid fillWidth fitHeight gap="16" columns={1}>
        {educationData.map((education, index) => (
          <EducationCard
            key={index}
            title={education.title}
            institution={education.institution}
            duration={education.duration}
            description={education.description}
          />
        ))}
      </Grid>
    </Column>
  );
}

interface EducationCardProps {
  title: string;
  institution: string;
  duration: string;
  description: string;
}

const EducationCard: React.FC<EducationCardProps> = ({
  title,
  institution,
  duration,
  description,
}) => {
  return (
    <Card
      radius="l-4"
      direction="row"
      border="neutral-alpha-weak"
      background="surface"
      padding="m"
      fillWidth
      paddingX="m"
      flex={1}
      style={{
        backgroundColor: "#1C1C1C ",
        minHeight: "100px ",
      }}
      gap="12"
      className="responsive-padding-container"
    >
      <Column horizontal="start" vertical="start" gap="2">
        <Text
          variant="label-default-s"
          className={inter.className + " text-small"}
        >
          {title}
        </Text>
        <Flex fillWidth height={0.05}></Flex>
        <Text
          variant="label-default-s"
          className={inter.className + " text-more-big-lighter"}
        >
          {institution}
        </Text>
        <Text
          variant="label-default-s"
          className={inter.className + " text-small"}
        >
          {duration}
        </Text>
        <Flex fillWidth height={0.05}></Flex>
        <Text
          variant="label-default-s"
          className={inter.className + " text-big-darker"}
        >
          {description}
        </Text>
      </Column>
    </Card>
  );
};

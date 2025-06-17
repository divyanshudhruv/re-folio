"use client";

import {
  Column,
  Text,
  Flex,
  Card,
  Grid,
  Row,
  Media,
} from "@once-ui-system/core";
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

interface ExperienceProps {
  id: string;
}

interface ExperienceData {
  src: string;
  title: string;
  company: string;
  duration: string;
}

export default function Experience({ id }: ExperienceProps) {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("experiences")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching experiences:", error);
          return;
        }

        if (data?.experiences) {
          setExperiences(data.experiences);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchExperiences();
  }, [id]);

  const hasValidExperiences = experiences.some(
    (experience) =>
      experience.title &&
      experience.company &&
      experience.duration &&
      experience.src
  );

  return (
    <>
      {experiences.length > 0 && hasValidExperiences && (
        <>
          <Column fillWidth fitHeight paddingX="s" gap="16">
            <Text
              variant="heading-strong-xs"
              onBackground="neutral-medium"
              className={inter.className}
            >
              Experience
            </Text>
            <Grid
              fillWidth
              fitHeight
              gap="16"
              columns={2}
              className="responsive-container"
            >
              {experiences.map((experience, index) => (
                <ExperienceCard key={index} {...experience} />
              ))}
            </Grid>
          </Column>
          <Flex fillWidth height={2.5}></Flex>
        </>
      )}
    </>
  );
}

interface ExperienceCardProps extends ExperienceData {}

const ExperienceCard = ({
  title,
  company,
  duration,
  src,
}: ExperienceCardProps) => (
  <Card
    radius="l-4"
    direction="row"
    border="neutral-alpha-weak"
    background="surface"
    padding="m"
    vertical="center"
    fillWidth
    flex={1}
    style={{
      backgroundColor: "#1C1C1C",
      minHeight: "100px",
    }}
  >
    <Row gap="12">
      <Column horizontal="center" vertical="start" fillHeight fitWidth>
        <Media width={2} height={2} radius="l" src={src} unoptimized />
      </Column>
      <Column horizontal="start" vertical="start" gap="2" fillHeight>
        <Text
          variant="label-default-s"
          className={`${inter.className} text-big-lighter`}
        >
          {title}
        </Text>
        <Text
          variant="label-default-s"
          className={`${inter.className} text-big-darker`}
        >
          {company}
        </Text>
        <Flex fillWidth height={0.025}></Flex>
        <Text
          variant="label-default-s"
          className={`${inter.className} text-small`}
        >
          {duration}
        </Text>
      </Column>
    </Row>
  </Card>
);

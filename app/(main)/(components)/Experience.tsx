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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import "./../global.css";

export default function Experience({ id }: { id: string }) {
  const [experiences, setExperiences] = useState<
    { src: string; title: string; company: string; duration: string }[]
  >([]);

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
        } else {
          setExperiences(data.experiences);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchExperiences();
  }, [id]);
  return (
    <>
      {experiences.length > 0 &&
        experiences.some(
          (experience) =>
            experience.title && experience.company && experience.duration && experience.src
        ) && (
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
                <ExperienceCard
                  src={experience.src}
                  key={index}
                  title={experience.title}
                  company={experience.company}
                  duration={experience.duration}
                />
              ))}
            </Grid>
          </Column>
           <Flex fillWidth height={2.5}></Flex></>
        )}
    </>
  );
}

const ExperienceCard = ({
  title,
  company,
  duration,
  src,
}: {
  title: string;
  company: string;
  duration: string;
  src: string;
}) => {
  return (
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
        backgroundColor: "#1C1C1C ",
        minHeight: "100px !important",
      }}
    >
      <Row gap="12">
        <Column horizontal="center" vertical="start" fillHeight fitWidth>
          <Media width={2} height={2} radius="l" src={src} unoptimized></Media>
        </Column>
        <Column horizontal="start" vertical="start" gap="2" fillHeight>
          <Text
            variant="label-default-s"
            className={inter.className + " text-big-lighter"}
          >
            {title}
          </Text>

          <Text
            variant="label-default-s"
            className={inter.className + " text-big-darker"}
          >
            {company}
          </Text>
          <Flex fillWidth height={0.025}></Flex>
          <Text
            variant="label-default-s"
            className={inter.className + " text-small"}
          >
            {duration}
          </Text>
        </Column>
      </Row>
    </Card>
  );
};

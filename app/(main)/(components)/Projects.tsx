"use client";

import { Column, Text, Media, Grid, Card, Flex } from "@once-ui-system/core";
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
export default function Projects({ id }: { id: string }) {
  const [projectsData, setProjectsData] = useState<
    { title: string; description: string; src: string; href: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("projects")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setProjectsData(data.projects);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [id]);
  const projects = projectsData;

  return (
    <Column fillWidth fitHeight paddingX="s" gap="16">
      <Text
        variant="heading-strong-xs"
        onBackground="neutral-medium"
        className={inter.className}
      >
        Projects
      </Text>

      <Grid columns={2} fillWidth gap="16" className="responsive-container">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            src={project.src}
            title={project.title}
            description={project.description}
            href={project.href}
          />
        ))}
      </Grid>
    </Column>
  );
}

const ProjectCard = ({
  src,
  title,
  description,
  href,
}: {
  src: string;
  title: string;
  description: string;
  href?: string;
}) => {
  return (
    <Card
      radius="l"
      padding="xs"
      background="transparent"
      fillWidth
      style={{
        minHeight: "100px",
        borderWidth: "0",
      }}
      onClick={() => {
        if (href) {
          window.open(href, "_blank", "noopener noreferrer")?.focus();
        }
      }}
    >
      <Column fillWidth fitHeight gap="12">
        <Flex border="neutral-alpha-weak" radius="l" overflow="hidden">
          <Media
            src={src}
            unoptimized
            aspectRatio="16/10"
            objectFit="cover"
            fillWidth
            fillHeight
            className="responsive-image"
          ></Media>
        </Flex>
        <Column style={{ paddingInline: "5px" }}>
          <Text className={inter.className + " text-massive-lighter"}>
            {title}
          </Text>
          <Text
            variant="label-default-s"
            onBackground="neutral-weak"
            className={inter.className + " text-big-darker"}
          >
            {description}
          </Text>
        </Column>
      </Column>
    </Card>
  );
};

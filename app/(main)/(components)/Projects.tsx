"use client";

import { Column, Text, Media, Grid, Card, Flex } from "@once-ui-system/core";
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

interface Project {
  title: string;
  description: string;
  src: string;
  href: string;
}

interface ProjectsProps {
  id: string;
}

const Projects = ({ id }: ProjectsProps) => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("projects")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching data:", error);
          return;
        } 
        if (!data || !data.projects) {
          return;
        }
        // Set default image for projects with missing src
        setProjectsData(data.projects.map((project: Project) => ({
          ...project,
          src: project.src || 'https://farmshopmfg.com/wp-content/uploads/2023/03/placeholder.png'
        })));
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchProjects();
  }, [id]);

  const hasValidProjects = projectsData.some((project) =>
    Object.keys(project).some(
      (key) => key !== "id" && project[key as keyof Project]
    )
  );

  return (
    <>
      {projectsData.length > 0 && hasValidProjects && (
        <>
          <Column fillWidth fitHeight paddingX="s" gap="16">
            <Text
              variant="heading-strong-xs"
              onBackground="neutral-medium"
              className={inter.className}
            >
              Projects
            </Text>

            <Grid columns={2} fillWidth gap="16" className="responsive-container">
              {projectsData.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </Grid>
          </Column>
          <Flex fillWidth height={2.5}></Flex>
        </>
      )}
    </>
  );
};

interface ProjectCardProps {
  src: string;
  title: string;
  description: string;
  href?: string;
}

const ProjectCard = ({ src, title, description, href }: ProjectCardProps) => (
  <Card
    radius="l"
    padding="xs"
    background="transparent"
    fillWidth
    style={{
      minHeight: "100px !important",
      borderWidth: "0",
    }}
    onClick={() => href && window.open(href, "_blank", "noopener noreferrer")?.focus()}
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
        />
      </Flex>
      <Column style={{ paddingInline: "5px !important" }}>
        <Text className={`${inter.className} text-massive-lighter`}>{title}</Text>
        <Text
          variant="label-default-s"
          onBackground="neutral-weak"
          className={`${inter.className} text-big-darker`}
        >
          {description}
        </Text>
      </Column>
    </Column>
  </Card>
);

export default Projects;

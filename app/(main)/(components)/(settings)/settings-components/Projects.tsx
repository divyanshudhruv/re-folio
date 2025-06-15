"use client";

import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
  MediaUpload,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function ProjectSetting({ id }: { id: string }) {
  const [projects, setProjects] = useState<
    {
      id: number;
      src: string;
      title: string;
      description: string;
      href: string;
    }[]
  >([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setSessionId(session.user.id);
        } else {
          console.log("No active session found.");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchSession();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    if (!sessionId) return;

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("projects")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching projects:", error);
        } else if (data && data.projects) {
          const fetchedProjects = data.projects.map(
            (project: any, index: number) => ({
              id: index + 1,
              ...project,
            })
          );
          setProjects(fetchedProjects);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchProjects();
  }, [sessionId, id]); // Runs only when sessionId or id changes

  async function handleFileUpload(projectId: number, file: File) {
    if (!sessionId) return;

    try {
      const fileName = `projects/${sessionId}/${projectId}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (error) {
        throw new Error(
          `Failed to upload file for project ${projectId}: ${error.message}`
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl) {
        throw new Error(`Failed to get public URL for project ${projectId}`);
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, src: publicUrlData.publicUrl }
            : project
        )
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  function addProject() {
    if (projects.length < 8) {
      setProjects([
        ...projects,
        {
          id: projects.length + 1,
          src: "",
          title: "",
          description: "",
          href: "",
        },
      ]);
    }
  }

  function handleSave() {
    setLoading(true);
    const jsonOutput = projects.map(({ id, ...project }) => ({
      ...project,
      href: project.href ? `https://${project.href}` : "",
    }));
    const saveProjects = async () => {
      try {
        const { error } = await supabase
          .from("refolio_sections")
          .update({ projects: jsonOutput })
          .eq("id", id);

        if (error) {
          console.error("Error saving projects:", error);
        } else {
          console.log("Projects saved successfully:", jsonOutput);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    saveProjects();
  }

  function updateProject(id: number, field: string, value: any) {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  }

  function deleteLastProject() {
    if (projects.length > 1) {
      setProjects(projects.slice(0, -1));
    }
  }

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="intro">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Projects
        </Text>
      </HeadingLink>
      <Column gap="16" horizontal="start" fillWidth>
        {projects.map((project) => (
          <Row
            key={project.id}
            gap="16"
            fillWidth
            id={`project-row-${project.id}`}
          >
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              className={inter.className}
            >
              {project.id}.
            </Text>
            <Column fillWidth>
              <Input
                radius="top"
                id={`title-${project.id}`}
                label="Title"
                height="s"
                value={project.title}
                onChange={(e) =>
                  updateProject(project.id, "title", e.target.value)
                }
              />
              <Input
                radius="none"
                id={`href-${project.id}`}
                placeholder="Link to project"
                height="m"
                value={project.href}
                onChange={(e) => {
                  const value = e.target.value;

                  updateProject(project.id, "href", value);
                }}
                hasPrefix={<Text className="text-big-darker">https://</Text>}
              />

              <Input
                radius="none"
                id={`description-${project.id}`}
                label="Description"
                height="s"
                value={project.description}
                onChange={(e) =>
                  updateProject(project.id, "description", e.target.value)
                }
              />
              <MediaUpload
                style={{
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
                  backgroundColor: "#262626",
                  zIndex: "990",
                }}
                className="text-big-lightest"
                emptyState={"Cover Image"}
                onChange={(event) => {
                  const file = (event.target as HTMLInputElement).files?.[0];
                  if (file) handleFileUpload(project.id, file);
                }}
                initialPreviewImage={project.src}
              />
            </Column>
          </Row>
        ))}

        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            variant="secondary"
            onClick={deleteLastProject}
            disabled={projects.length <= 1}
          >
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={addProject}
            disabled={projects.length >= 4}
          >
            Add
          </Button>
            <Button
            variant="primary"
            onClick={async () => {
              handleSave();
            }}
            disabled={loading}
            >
            {loading ? "Saving..." : "Save"}
            </Button>
        </Row>
      </Column>
    </Column>
  );
}

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

interface Project {
  id: number;
  src: string;
  title: string;
  description: string;
  href: string;
}

export default function ProjectSetting({ id }: { id: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSessionId(session?.user.id || null);
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchSession();
  }, []);

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
          return;
        }

        if (data?.projects) {
          const formattedProjects = data.projects.map(
            (project: any, index: number) => ({
              id: index + 1,
              ...project,
            })
          );
          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [sessionId, id]);

  const handleFileUpload = async (projectId: number, file: File) => {
    if (!sessionId) return;

    try {
      const fileName = `projects/${sessionId}/${projectId}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (error) throw new Error(`File upload failed: ${error.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl) {
        throw new Error("Failed to retrieve public URL");
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, src: publicUrlData.publicUrl }
            : project
        )
      );
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const addProject = () => {
    if (projects.length < 8) {
      setProjects([
        ...projects,
        { id: projects.length + 1, src: "", title: "", description: "", href: "" },
      ]);
    }
  };

  const deleteLastProject = () => {
    if (projects.length > 1) {
      setProjects(projects.slice(0, -1));
    }
  };

  const updateProject = (projectId: number, field: keyof Project, value: any) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, [field]: value } : project
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const formattedProjects = await Promise.all(
        projects.map(async ({ id, src, ...project }) => {
          let formattedHref = project.href;

          if (formattedHref && !formattedHref.startsWith("https://")) {
            const { data, error } = await supabase
              .from("refolio_sections")
              .select("projects")
              .eq("id", id)
              .single();

            if (!error && data?.projects) {
              const existingProject = data.projects.find(
                (dbProject: any) => dbProject.href === project.href
              );
              if (!existingProject) {
                formattedHref = `https://${formattedHref}`;
              }
            }
          }

          return {
            ...project,
            src: src,
            href: formattedHref,
          };
        })
      );

      const { error } = await supabase
        .from("refolio_sections")
        .update({ projects: formattedProjects })
        .eq("id", id);

      if (error) {
        console.error("Error saving projects:", error);
      } else {
        console.log("Projects saved successfully");
      }
    } catch (err) {
      console.error("Error saving projects:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="projects">
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
          <Row key={project.id} gap="16" fillWidth>
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              className={inter.className}
            >
              {project.id}.
            </Text>
            <Column fillWidth>
              <Input
              id=""
                radius="top"
                label="Title"
                height="s"
                value={project.title}
                onChange={(e) => updateProject(project.id, "title", e.target.value)}
              />
              <Input
              id=""
                radius="none"
                placeholder="Link to project"
                height="m"
                value={project.href}
                onChange={(e) => updateProject(project.id, "href", e.target.value)}
                hasPrefix={<Text className="text-big-darker">https://</Text>}
              />
              <Input
              id=""
                radius="none"
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
                emptyState="Cover Image"
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
            data-theme="dark"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

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

interface Experience {
  id: number;
  src: string;
  title: string;
  company: string;
  duration: string;
}

export default function ExperienceSetting({ id }: { id: string }) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) fetchExperiences();
  }, [sessionId, id]);

  const fetchExperiences = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setSessionId(session.user.id);

        const { data, error } = await supabase
          .from("refolio_sections")
          .select("experiences")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching experiences:", error);
        } else if (data?.experiences) {
          const fetchedExperiences = data.experiences.map(
            (experience: any, index: number) => ({
              id: index + 1,
              ...experience,
            })
          );
          setExperiences(fetchedExperiences);
        }
      } else {
        console.log("No active session found.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleFileUpload = async (experienceId: number, file: File) => {
    if (!sessionId) return;

    try {
      const fileName = `experiences/${sessionId}/${experienceId}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (error) throw new Error(`Failed to upload file: ${error.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id === experienceId ? { ...exp, src: publicUrlData.publicUrl } : exp
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addExperience = () => {
    if (experiences.length < 8) {
      setExperiences((prev) => [
        ...prev,
        { id: prev.length + 1, src: "", title: "", company: "", duration: "" },
      ]);
    }
  };

  const deleteLastExperience = () => {
    if (experiences.length > 1) {
      setExperiences((prev) => prev.slice(0, -1));
    }
  };

  const updateExperience = (id: number, field: keyof Experience, value: any) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const jsonOutput = experiences.map(({ id, ...exp }) => exp);
      const { error } = await supabase
        .from("refolio_sections")
        .update({ experiences: jsonOutput })
        .eq("id", id);

      if (error) {
        console.error("Error saving experiences:", error);
      } else {
        console.log("Experiences saved successfully:", jsonOutput);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderExperienceRow = (experience: Experience) => (
    <Row key={experience.id} gap="16" fillWidth id={`experience-row-${experience.id}`}>
      <Text
        variant="heading-default-xs"
        onBackground="neutral-weak"
        className={inter.className}
      >
        {experience.id}.
      </Text>
      <Row fillWidth>
        <MediaUpload
          style={{
            borderBottomRightRadius: "0px",
            borderTopRightRadius: "0px",
            backgroundColor: "#262626",
            zIndex: "990",
          }}
          className="text-big-lightest"
          emptyState="Company logo"
          width={9}
          height={9}
          minWidth={9}
          onChange={(event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) handleFileUpload(experience.id, file);
          }}
          initialPreviewImage={experience.src}
        />
        <Column fillWidth>
          <Input
            radius="top-right"
            id={`title-${experience.id}`}
            label="Title"
            height="s"
            value={experience.title}
            onChange={(e) =>
              updateExperience(experience.id, "title", e.target.value)
            }
            style={{ borderTopRightRadius: "20px !important" }}
          />
          <Input
            radius="none"
            id={`company-${experience.id}`}
            label="Company"
            height="s"
            value={experience.company}
            onChange={(e) =>
              updateExperience(experience.id, "company", e.target.value)
            }
          />
          <Input
            radius="bottom-right"
            id={`duration-${experience.id}`}
            label="Year"
            height="s"
            value={experience.duration}
            onChange={(e) =>
              updateExperience(experience.id, "duration", e.target.value)
            }
          />
        </Column>
      </Row>
    </Row>
  );

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="experience">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Experience
        </Text>
      </HeadingLink>
      <Column gap="16" horizontal="start" fillWidth>
        {experiences.map(renderExperienceRow)}
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            variant="secondary"
            onClick={deleteLastExperience}
            disabled={experiences.length <= 1}
          >
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={addExperience}
            disabled={experiences.length >= 5}
          >
            Add
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading}
            data-theme="dark"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

import {
  Column,
  HeadingLink,
  Text,
  Input,
  Row,
  Button,
  Textarea,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function EducationSetting({ id }: { id: string }) {
  const [educationDetails, setEducationDetails] = useState<
    {
      id: number;
      title: string;
      duration: string;
      description: string;
      institution: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchEducationDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("education")
        .eq("id", id)
        .single();

      if (!data?.education) {
        setEducationDetails([
          { id: 1, title: "", duration: "", description: "", institution: "" },
        ]);
      }

      if (error) {
        console.error("Error fetching education details:", error);
      } else if (data?.education) {
        setEducationDetails(data.education);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchEducationDetails();
  }, [fetchEducationDetails]);

  const handleSave = async () => {
    setLoading(true);
    console.log(educationDetails);
    try {
      const { error } = await supabase
        .from("refolio_sections")
        .update({ education: educationDetails })
        .eq("id", id);

      if (error) {
        console.error("Error updating education details:", error);
      } else {
        console.log("Education details updated successfully");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback(
    (id: number, field: string, value: string | string[]) => {
      setEducationDetails((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const handleAdd = useCallback(() => {
    const newEntry = {
      id: educationDetails.length + 1,
      title: "",
      duration: "",
      description: "",
      institution: "",
    };
    setEducationDetails((prev) => [...prev, newEntry]);
  }, [educationDetails]);

  const removeLastItem = useCallback(() => {
    if (educationDetails.length > 1) {
      setEducationDetails((prev) => prev.slice(0, -1));
    }
  }, [educationDetails]);

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="education">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Education
        </Text>
      </HeadingLink>
      <Column gap="16">
        {educationDetails.map((education, index) => (
          <Row key={`${education.id}-${index}`} gap="16" fillWidth>
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              className={inter.className}
            >
              {index + 1}. {/* Numbering */}
            </Text>
            <Column fillWidth>
              <Input
                radius="top"
                id={`input-title-${education.id}`}
                label="Level"
                height="s"
                value={education.title}
                onChange={(e) =>
                  handleChange(education.id, "title", e.target.value)
                }
              />
              <Input
                radius="none"
                id={`input-institution-${education.id}`}
                label="Name of institute"
                height="s"
                value={education.institution}
                onChange={(e) =>
                  handleChange(education.id, "institution", e.target.value)
                }
              />
              <Input
                radius="none"
                id={`input-duration-${education.id}`}
                label="Year "
                height="s"
                value={education.duration}
                onChange={(e) =>
                  handleChange(education.id, "duration", e.target.value)
                }
              />
              <Textarea
                lines={6}
                id={`textarea-description-${education.id}`}
                radius="bottom"
                placeholder="Tell us about your education"
                value={education.description}
                onChange={(e) =>
                  handleChange(education.id, "description", e.target.value)
                }
              ></Textarea>
            </Column>
          </Row>
        ))}
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button variant="secondary" onClick={removeLastItem}>
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={handleAdd}
            disabled={educationDetails.length >= 4}
          >
            Add
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              handleSave();
            }}                        data-theme="light"

            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

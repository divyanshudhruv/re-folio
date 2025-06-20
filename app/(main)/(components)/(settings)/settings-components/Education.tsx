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

interface EducationDetail {
  id: number;
  title: string;
  duration: string;
  description: string;
  institution: string;
}

const defaultEducationDetail: EducationDetail = {
  id: 1,
  title: "",
  duration: "",
  description: "",
  institution: "",
};

export default function EducationSetting({ id }: { id: string }) {
  const [educationDetails, setEducationDetails] = useState<EducationDetail[]>([
    { ...defaultEducationDetail },
  ]);
  const [loading, setLoading] = useState(false);

  const fetchEducationDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("education")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching education details:", error);
        return;
      }

      setEducationDetails(
        data?.education?.length
          ? data.education
          : [{ ...defaultEducationDetail }]
      );
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchEducationDetails();
  }, [fetchEducationDetails]);

  const handleSave = async () => {
    setLoading(true);
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
    (id: number, field: keyof EducationDetail, value: string) => {
      setEducationDetails((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const handleAdd = useCallback(() => {
    setEducationDetails((prev) => [
      ...prev,
      { ...defaultEducationDetail, id: prev.length + 1 },
    ]);
  }, []);

  const removeLastItem = useCallback(() => {
    setEducationDetails((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const renderEducationFields = () =>
    educationDetails.map((education, index) => (
      <Row key={education.id} gap="16" fillWidth>
        <Text
          variant="heading-default-xs"
          onBackground="neutral-weak"
          className={inter.className}
        >
          {index + 1}.
        </Text>
        <Column fillWidth>
          <Input spellCheck={false}
            radius="top"
            id={`input-title-${education.id}`}
            label="Level"
            height="s"
            value={education.title}
            onChange={(e) =>
              handleChange(education.id, "title", e.target.value)
            }
          />
          <Input spellCheck={false}
            radius="none"
            id={`input-institution-${education.id}`}
            label="Name of institute"
            height="s"
            value={education.institution}
            onChange={(e) =>
              handleChange(education.id, "institution", e.target.value)
            }
          />
          <Input spellCheck={false}
            radius="none"
            id={`input-duration-${education.id}`}
            placeholder="Year (e.g., 2015-2019)"
            height="m"
            value={education.duration}
            onChange={(e) =>
              handleChange(education.id, "duration", e.target.value)
            }
          />
          <Textarea spellCheck={false}
            lines={6}
            id={`textarea-description-${education.id}`}
            radius="bottom"
            placeholder="Tell us about your education"
            value={education.description}
            onChange={(e) =>
              handleChange(education.id, "description", e.target.value)
            }
          />
        </Column>
      </Row>
    ));

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
        {renderEducationFields()}
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button variant="secondary" onClick={removeLastItem}>
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={handleAdd}
            disabled={educationDetails.length >= 5}
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

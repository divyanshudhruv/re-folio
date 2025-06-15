import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
  Textarea,
  TagInput,
  Kbd,
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

export default function Introduction({ id }: { id: string }) {
  const [introductionDetails, setIntroductionDetails] = useState({
    tags: [],
    heading: "",
    paragraphs: [],
    subheading: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchIntroductionDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("intro")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching introduction details:", error);
      } else if (data?.intro) {
        setIntroductionDetails(data.intro);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, [id]);

  const handleSave = useCallback(() => {
    setLoading(true);
    console.log(introductionDetails);
    const updateIntroductionDetails = async () => {
      try {
        const { error } = await supabase
          .from("refolio_sections")
          .update({ intro: introductionDetails })
          .eq("id", id);

        if (error) {
          console.error("Error updating introduction details:", error);
        } else {
          console.log("Introduction details updated successfully");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    updateIntroductionDetails();
  }, [introductionDetails, id]);

  const handleChange = useCallback(
    (field: string, value: string | string[]) => {
      setIntroductionDetails((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  useEffect(() => {
    fetchIntroductionDetails();
  }, [fetchIntroductionDetails]);

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="intro">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Introduction
        </Text>
      </HeadingLink>
      <Column>
        <Input
          radius="top"
          id="input-1"
          label="Heading"
          height="s"
          value={introductionDetails.heading}
          onChange={(e) => handleChange("heading", e.target.value)}
        />
        <Input
          radius="none"
          id="input-2"
          label="Subheading"
          height="s"
          value={introductionDetails.subheading}
          onChange={(e) => handleChange("subheading", e.target.value)}
        />
        <Textarea
          lines={6}
          id="textarea-1"
          radius="bottom"
          placeholder="Describe your introduction"
          description="Your description will be displayed on your public profile"
          value={introductionDetails.paragraphs.join("\n")}
          onChange={(e) =>
            handleChange("paragraphs", e.target.value.split("\n"))
          }
        ></Textarea>
        <Flex height={1}></Flex>
        <TagInput
          id="tag-input-example"
          value={introductionDetails.tags}
          onChange={(newTags) => handleChange("tags", newTags)}
          placeholder="Add tags"
          hasSuffix={
            <Kbd position="absolute" top="12" right="12">
              Enter
            </Kbd>
          }
        />
        <Flex height={1}></Flex>
        <Row fillWidth horizontal="end" vertical="center">
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

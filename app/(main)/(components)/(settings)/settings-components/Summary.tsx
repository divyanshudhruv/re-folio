import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
  Textarea,
  useToast,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function SummarySetting({ id }: { id: string }) {
  const { addToast } = useToast();
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    github: "",
  });
  const [paragraph, setParagraph] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        if (!id) {
          console.error("Invalid ID: ID is empty or undefined.");
          return;
        }

        const { data, error } = await supabase
          .from("refolio_sections")
          .select("summary")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching summary:", error.message);
        } else if (data && data.summary) {
          setSocialLinks(data.summary.socialLinks || {});
          setParagraph(data.summary.paragraph || "");
        }
      } else {
        console.log("No active session found.");
      }
    }

    fetchData();
  }, [id]); // Added dependency array to prevent repetitive rendering

  async function handleSave() {
    try {
      const summary = { socialLinks, paragraph };
      const { error } = await supabase
        .from("refolio_sections")
        .update({ summary })
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to save summary: ${error.message}`);
      }
    } catch (error: any) {
      console.error(error);
      addToast({
        variant: "danger",
        message: `Failed to save summary: ${error.message}`,
      });
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
          Summary
        </Text>
      </HeadingLink>
      <Column>
        <Column>
          <Input
            id="linkedin"
            label="Linkedin"
            radius="top"
            hasPrefix={<i className="ri-linkedin-line text-big-darker"></i>}
            value={socialLinks.linkedin}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, linkedin: e.target.value })
            }
          />
          <Input
            id="twitter"
            label="X"
            radius="none"
            hasPrefix={<i className="ri-twitter-x-line text-big-darker"></i>}
            value={socialLinks.twitter}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, twitter: e.target.value })
            }
          />
          <Input
            id="github"
            label="Github"
            radius="none"
            hasPrefix={<i className="ri-github-line text-big-darker"></i>}
            value={socialLinks.github}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, github: e.target.value })
            }
          />
        </Column>
        <Textarea
          lines={6}
          id="textarea"
          placeholder="Write your summary here..."
          radius="bottom"
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
        />
        <Flex height={1}></Flex>
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            variant="primary"
            onClick={async () => {
              setLoading(true);
              await handleSave();
              setLoading(false);
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

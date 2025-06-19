import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  DateInput,
  Button,
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

export default function AwardsSetting({ id }: { id: string }) {
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.log("No active session found.");
        return;
      }

      const { data, error } = await supabase
        .from("refolio_sections")
        .select("github_username")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching awards:", error.message);
        return;
      }

      if (data?.github_username) {
        setGithubUsername(data.github_username);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("refolio_sections")
        .update({ github_username: githubUsername })
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to save awards: ${error.message}`);
      }

      console.log("Awards saved successfully!");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="awards">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Github
        </Text>
      </HeadingLink>
      <Column gap="16">
        <Input
          id={`name-${id}`}
          label="Username"
          height="s"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          description="Your GitHub username to display your pinned repositories."
        />
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            data-theme="dark"
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

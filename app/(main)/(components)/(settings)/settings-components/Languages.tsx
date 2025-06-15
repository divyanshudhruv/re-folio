import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
  Select,
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

export default function LanguageSetting({ id }: { id: string }) {
  const { addToast } = useToast();
  const [rows, setRows] = useState([{ id: 1, name: "", proficiency: "" }]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSessionId(session.user.id);
        console.log("User Name:", session.user.user_metadata.name);
      } else {
        console.log("No active session found.");
      }
    }

    fetchSession();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    if (!sessionId) return;

    async function fetchLanguages() {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("languages")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching languages:", error.message);
      } else if (data && data.languages) {
        setRows(
          data.languages.map((language: any, index: number) => ({
            id: index + 1,
            name: language.name,
            proficiency: language.proficiency,
          }))
        );
      }
    }

    fetchLanguages();
  }, [sessionId, id]); // Runs only when sessionId or id changes

  async function handleSave() {
    try {
      const languages = rows.map(({ name, proficiency }) => ({
        name,
        proficiency,
      }));

      const { error } = await supabase
        .from("refolio_sections")
        .update({ languages })
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to save languages: ${error.message}`);
      }
    } catch (error: any) {
      console.error(error);
      addToast({
        variant: "danger",
        message: `Failed to save languages: ${error.message}`,
      });
    }
  }

  function newRow() {
    if (rows.length < 8) {
      setRows([...rows, { id: rows.length + 1, name: "", proficiency: "" }]);
    }
  }

  function updateRow(id: number, field: string, value: string) {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }

  function deleteLastRow() {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  }

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="lannguages">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Languages
        </Text>
      </HeadingLink>
      <Column gap="16">
        {rows.map((row) => (
          <Row key={row.id} gap="16" fillWidth>
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              className={inter.className}
            >
              {row.id}.
            </Text>
            <Row fillWidth>
              <Input
                id={`input-${row.id}`}
                label="Language"
                height="s"
                radius="left"
                value={row.name}
                onChange={(e) => updateRow(row.id, "name", e.target.value)}
              />
              <Select
                id={`fluency-select-${row.id}`}
                label="Fluency Level"
                options={[
                  { label: "Native", value: "native" },
                  { label: "Fluent", value: "fluent" },
                  { label: "Advanced", value: "advanced" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Beginner", value: "beginner" },
                ]}
                radius="right"
                height="s"
                value={row.proficiency}
                onSelect={(e) => updateRow(row.id, "proficiency", e)}
              />
            </Row>
          </Row>
        ))}
        <Flex height={1}> </Flex>
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            variant="secondary"
            onClick={deleteLastRow}
            disabled={rows.length <= 1}
          >
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={newRow}
            disabled={rows.length >= 7}
          >
            Add
          </Button>
          <Button
            variant="primary"
            data-theme="dark"
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

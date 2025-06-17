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

interface AwardRow {
  id: number;
  name: string;
  year: number;
  description: string;
}

export default function AwardsSetting({ id }: { id: string }) {
  const [rows, setRows] = useState<AwardRow[]>([
    { id: 1, name: "", year: new Date().getFullYear(), description: "" },
  ]);
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
        .select("awards")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching awards:", error.message);
        return;
      }

      if (data?.awards) {
        setRows(data.awards);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("refolio_sections")
        .update({ awards: rows })
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

  const addRow = () => {
    if (rows.length < 8) {
      setRows((prevRows) => [
        ...prevRows,
        {
          id: prevRows.length + 1,
          name: "",
          year: new Date().getFullYear(),
          description: "",
        },
      ]);
    }
  };

  const updateRow = (id: number, field: keyof AwardRow, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const removeLastRow = () => {
    if (rows.length > 1) {
      setRows((prevRows) => prevRows.slice(0, -1));
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
          Awards
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
            <Column fillWidth>
              <Input
                radius="top"
                id={`name-${row.id}`}
                label="Championship"
                height="s"
                value={row.name}
                onChange={(e) => updateRow(row.id, "name", e.target.value)}
              />
              <Input
                radius="none"
                id={`description-${row.id}`}
                label="Award"
                height="s"
                value={row.description}
                onChange={(e) =>
                  updateRow(row.id, "description", e.target.value)
                }
              />
              <DateInput
                id={`year-${row.id}`}
                label="Select Year"
                value={new Date(row.year, 0, 1)}
                height="s"
                radius="bottom"
                onChange={(date) =>
                  updateRow(row.id, "year", date.getFullYear())
                }
                cursor="interactive"
              />
            </Column>
          </Row>
        ))}
        <Flex height={1}></Flex>
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            variant="secondary"
            onClick={removeLastRow}
            disabled={rows.length <= 1}
          >
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={addRow}
            disabled={rows.length >= 5}
          >
            Add
          </Button>
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

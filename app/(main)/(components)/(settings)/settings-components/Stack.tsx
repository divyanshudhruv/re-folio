import {
  Column,
  HeadingLink,
  Text,
  Input,
  Row,
  Button,
  MediaUpload,
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

export default function StackSetting({ id }: { id: string }) {
  const { addToast } = useToast();
  const [rows, setRows] = useState([
    { id: 1, src: "", name: "", description: "" },
  ]);
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
    async function fetchStacks() {
      if (!sessionId) return;

      const { data, error } = await supabase
        .from("refolio_sections")
        .select("stacks")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching stacks:", error.message);
      } else if (data && data.stacks) {
        setRows(data.stacks);
      }
    }

    fetchStacks();
  }, [sessionId, id]); // Runs only when sessionId or id changes

  async function handleFileUpload(rowId: number, file: File) {
    if (!sessionId) return;

    try {
      const fileName = `stacks/${sessionId}/${rowId}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (error) {
        throw new Error(
          `Failed to upload file for row ${rowId}: ${error.message}`
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl) {
        throw new Error(`Failed to get public URL for row ${rowId}`);
      }

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === rowId ? { ...row, src: publicUrlData.publicUrl } : row
        )
      );
    } catch (error: any) {
      console.error(error);
      addToast({
        variant: "danger",
        message: `Failed to upload file: ${error.message}`,
      });
    }
  }

  async function handleSave() {
    try {
      const { error } = await supabase
        .from("refolio_sections")
        .update({ stacks: rows })
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Failed to save stacks: ${error.message}`);
      }
    } catch (error: any) {
      console.error(error);
      addToast({
        variant: "danger",
        message: `Failed to save stacks: ${error.message}`,
      });
    }
  }

  function newRow() {
    if (rows.length < 8) {
      setRows([
        ...rows,
        { id: rows.length + 1, src: "", name: "", description: "" },
      ]);
    }
  }

  function updateRow(id: number, field: any, value: any) {
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
      <HeadingLink as="h6" id="stacks">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Stacks
        </Text>
      </HeadingLink>
      <Column gap="16" horizontal="start" fillWidth>
        {rows.map((row) => (
          <Row key={row.id} gap="16" fillWidth id={`stack-row-${row.id}`}>
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              className={inter.className}
            >
              {row.id}.
            </Text>
            <MediaUpload
              style={{
                backgroundColor: "#262626",
                zIndex: "990",
                fontSize: "10px !important",
                maxHeight: "45px",
                minHeight: "45px",
                minWidth: "45px",
                maxWidth: "45px",
              }}
              className="text-big-lightest"
              emptyState={"Logo"}
              onChange={(event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (file) handleFileUpload(row.id, file);
              }}
              initialPreviewImage={row.src}
            />
            <Row>
              <Input
                id={`name-${row.id}`}
                placeholder="Name"
                radius="left"
                height="m"
                value={row.name}
                onChange={(e) => updateRow(row.id, "name", e.target.value)}
              />
              <Input
                id={`description-${row.id}`}
                placeholder="Description"
                radius="right"
                height="m"
                value={row.description}
                onChange={(e) =>
                  updateRow(row.id, "description", e.target.value)
                }
              />
            </Row>
          </Row>
        ))}

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
            disabled={rows.length >= 8}
          >
            Add
          </Button>
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

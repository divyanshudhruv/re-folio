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

interface RowData {
  id: number;
  src: string;
  name: string;
  description: string;
}

export default function StackSetting({ id }: { id: string }) {
  const { addToast } = useToast();
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, src: "", name: "", description: "" },
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSessionId(session.user.id);
        console.log("User Name:", session.user.user_metadata.name);
      } else {
        console.log("No active session found.");
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchStacks = async () => {
      if (!sessionId) return;

      const { data, error } = await supabase
        .from("refolio_sections")
        .select("stacks")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching stacks:", error.message);
      } else if (data?.stacks) {
        setRows(data.stacks);
      }
    };

    fetchStacks();
  }, [sessionId, id]);

  const handleFileUpload = async (rowId: number, file: File) => {
    if (!sessionId) return;

    try {
      const fileName = `stacks/${sessionId}/${rowId}-${file.name}`;
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
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("refolio_sections")
        .update({ stacks: rows })
        .eq("id", id)
        .single();

      if (error) throw new Error(`Failed to save stacks: ${error.message}`);
    } catch (error: any) {
      console.error(error);
      addToast({
        variant: "danger",
        message: `Failed to save stacks: ${error.message}`,
      });
    }
  };

  const addRow = () => {
    
      setRows([
        ...rows,
        { id: rows.length + 1, src: "", name: "", description: "" },
      ]);
    
  };

  const updateRow = (rowId: number, field: keyof RowData, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  const removeLastRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

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
              emptyState={"Icon"}
              onChange={(event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (file) handleFileUpload(row.id, file);
              }}
              initialPreviewImage={row.src}
            />
            <Row>
              <Input spellCheck={false}
                id={`name-${row.id}`}
                placeholder="Name"
                radius="left"
                height="m"
                value={row.name}
                onChange={(e) => updateRow(row.id, "name", e.target.value)}
              />
              <Input spellCheck={false}
                id={`description-${row.id}`}
                label="Description"
                radius="right"
                height="s"
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
            onClick={removeLastRow}
            disabled={rows.length <= 1}
          >
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={addRow}
            disabled={rows.length >= 10}
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

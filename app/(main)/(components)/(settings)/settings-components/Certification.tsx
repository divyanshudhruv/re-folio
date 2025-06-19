import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
  Textarea,
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

interface Certificate {
  id: number;
  title: string;
  institution: string;
  duration: string;
  description: string;
}

export default function CertificationSetting({ id }: { id: string }) {
  const [certificates, setCertificates] = useState<Certificate[]>([
    { id: 1, title: "", institution: "", duration: "", description: "" },
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setSessionId(session.user.id);

        const { data, error } = await supabase
          .from("refolio_sections")
          .select("certificates")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching certificates:", error.message);
        } else if (data?.certificates) {
          setCertificates(
            data.certificates.map((cert: any, index: number) => ({
              id: index + 1,
              ...cert,
            }))
          );
        }
      } else {
        console.log("No active session found.");
      }
    };

    if (!sessionId) fetchData();
  }, [sessionId, id]);

  const handleSave = async () => {
    try {
      const updatedCertificates = certificates.map(({ id, ...rest }) => rest);
      const { error } = await supabase
        .from("refolio_sections")
        .update({ certificates: updatedCertificates })
        .eq("id", id)
        .single();

      if (error)
        throw new Error(`Failed to save certificates: ${error.message}`);

      console.log("Certificates saved successfully!");
    } catch (error: any) {
      console.error(error);
    }
  };

  const addRow = () => {
    if (certificates.length < 8) {
      setCertificates([
        ...certificates,
        {
          id: certificates.length + 1,
          title: "",
          institution: "",
          duration: "",
          description: "",
        },
      ]);
    }
  };

  const updateRow = (id: number, field: keyof Certificate, value: string) => {
    setCertificates((prevCertificates) =>
      prevCertificates.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const deleteLastRow = () => {
    if (certificates.length > 1) {
      setCertificates(certificates.slice(0, -1));
    }
  };

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="certifications">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Certifications
        </Text>
      </HeadingLink>
      <Column gap="16">
        {certificates.map((cert) => (
          <Row key={cert.id} gap="16" fillWidth>
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              className={inter.className}
            >
              {cert.id}.
            </Text>
            <Column fillWidth>
              <Input spellCheck={false}
                radius="top"
                id={`title-${cert.id}`}
                label="Certification Name"
                height="s"
                value={cert.title}
                onChange={(e) => updateRow(cert.id, "title", e.target.value)}
              />
              <Input spellCheck={false}
                radius="none"
                id={`institution-${cert.id}`}
                label="Issuing Organization"
                height="s"
                value={cert.institution}
                onChange={(e) =>
                  updateRow(cert.id, "institution", e.target.value)
                }
              />
              <Input spellCheck={false}
                radius="none"
                id={`duration-${cert.id}`}
                placeholder="Year (YYYY) or Duration (e.g., 2015-2019)"
                height="m"
                value={cert.duration}
                onChange={(e) => updateRow(cert.id, "duration", e.target.value)}
              />
              <Textarea
                lines={6}
                id={`description-${cert.id}`}
                radius="bottom"
                placeholder="Tell us about your certification"
                description="Your certificates will be displayed on your public profile"
                value={cert.description}
                onChange={(e) =>
                  updateRow(cert.id, "description", e.target.value)
                }
              />
            </Column>
          </Row>
        ))}
        {/* <Flex height={1} /> */}
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            variant="secondary"
            onClick={deleteLastRow}
            disabled={certificates.length <= 1}
          >
            Remove last
          </Button>
          <Button
            variant="secondary"
            onClick={addRow}
            disabled={certificates.length >= 10}
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

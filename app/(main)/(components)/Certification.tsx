"use client";

import { Column, Text, Flex, Card, Grid } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import "./../global.css";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface Certification {
  title: string;
  institution: string;
  duration: string;
  description: string;
}

interface CertificationCardProps extends Certification {}

const CertificationCard: React.FC<CertificationCardProps> = ({
  title,
  institution,
  duration,
  description,
}) => (
  <Card
    radius="l-4"
    direction="row"
    border="neutral-alpha-weak"
    background="surface"
    padding="m"
    fillWidth
    style={{
      backgroundColor: "#1C1C1C",
      minHeight: "100px",
    }}
    gap="12"
    className="responsive-padding-container"
  >
    <Column horizontal="start" vertical="start" gap="2">
      <Text variant="label-default-s" className={`${inter.className} text-small`}>
        {title}
      </Text>
      <Flex fillWidth height={0.05} />
      <Text
        variant="label-default-s"
        className={`${inter.className} text-more-big-lighter`}
      >
        {institution}
      </Text>
      <Text variant="label-default-s" className={`${inter.className} text-small`}>
        {duration}
      </Text>
      <Flex fillWidth height={0.05} />
      <Text
        variant="label-default-s"
        className={`${inter.className} text-big-darker`}
      >
        {description}
      </Text>
    </Column>
  </Card>
);

export default function Certifications({ id }: { id: string }) {
  const [certificates, setCertificates] = useState<Certification[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("certificates")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching certificates:", error);
          return;
        }

        if (data?.certificates) {
          setCertificates(data.certificates);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchCertificates();
  }, [id]);

  const hasValidCertificates = certificates.some(
    (cert) =>
      cert.title && cert.institution && cert.duration && cert.description
  );

  if (!certificates.length || !hasValidCertificates) return null;

  return (
    <>
      <Column fillWidth fitHeight paddingX="s" gap="16">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Certifications
        </Text>
        <Grid
          fillWidth
          fitHeight
          gap="16"
          columns={2}
          className="responsive-container"
        >
          {certificates.map((certification, index) => (
            <CertificationCard key={index} {...certification} />
          ))}
        </Grid>
      </Column>
      <Flex fillWidth height={2.5} />
    </>
  );
}

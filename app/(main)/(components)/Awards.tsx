"use client";

import { Column, Text, Flex, Grid, Row, Kbd } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import "./../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface Award {
  name: string;
  description: string;
  year?: number;
}

interface AwardsProps {
  id: string;
}

const Awards = ({ id }: AwardsProps) => {
  const [awardsData, setAwardsData] = useState<Award[]>([]);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("awards")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching awards:", error);
          return;
        }

        if (data?.awards) {
          setAwardsData(data.awards);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchAwards();
  }, [id]);

  const hasValidAwards = awardsData.some(
    (award) =>
      award.name &&
      award.description &&
      (award.year || award.year === undefined)
  );

  if (!hasValidAwards) return null;

  return (
    <Column fillWidth fitHeight paddingX="s" gap="16">
      <Text
        variant="heading-strong-xs"
        onBackground="neutral-medium"
        className={inter.className}
      >
        Awards
      </Text>
      <Grid fillWidth fitHeight columns={1}>
        {awardsData.map((award, index) => (
          <AwardsCard
            key={index}
            name={award.name}
            description={award.description}
            year={award.year}
          />
        ))}
      </Grid>
      <Flex fillWidth height={2.5} />
    </Column>
  );
};

interface AwardsCardProps {
  name: string;
  description: string;
  year?: number;
}

const AwardsCard = ({ name, description, year }: AwardsCardProps) => (
  <Row
    direction="row"
    padding="s"
    vertical="center"
    horizontal="space-between"
    fillWidth
    flex={1}
    fitHeight
    maxHeight={2.5}
  >
    <Row center gap="8">
      <Text
        variant="label-default-s"
        className={`${inter.className} text-big-lightest`}
      >
        {name}
      </Text>
      <Text
        variant="label-default-s"
        className={`${inter.className} text-big-darker`}
      >
        {description}
      </Text>
    </Row>
    {year && (
      <Kbd
        background="neutral-alpha-weak"
        border="neutral-alpha-weak"
        onBackground="neutral-weak"
      >
        {year}
      </Kbd>
    )}
  </Row>
);

export default Awards;

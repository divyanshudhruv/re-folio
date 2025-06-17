"use client";

import {
  Column,
  Text,
  Flex,
  Card,
  Grid,
  Media,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import "./../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface StackData {
  name: string;
  description: string;
  src: string;
}

interface StackProps {
  id: string;
}

const Stack = ({ id }: StackProps) => {
  const [stacksData, setStacksData] = useState<StackData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("stacks")
          .eq("username", id)
          .single();

        if (error) {
          console.error("Error fetching data:", error);
        } else if (data?.stacks) {
          setStacksData(data.stacks);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [id]);

  const hasValidStacks = stacksData.some(
    (stack) => stack.name && stack.description && stack.src
  );

  return (
    <>
      {stacksData.length > 0 && hasValidStacks && (
        <>
          <Column fillWidth fitHeight paddingX="s" gap="16">
            <Text
              variant="heading-strong-xs"
              onBackground="neutral-medium"
              className={inter.className}
            >
              Tools & Stacks
            </Text>
            <Grid
              fillWidth
              fitHeight
              gap="16"
              columns={2}
              className="responsive-container"
            >
              {stacksData.map((stack, index) => (
                <StackCard
                  key={index}
                  name={stack.name}
                  description={stack.description}
                  src={stack.src}
                />
              ))}
            </Grid>
          </Column>
          <Flex fillWidth height={2.5}></Flex>
        </>
      )}
    </>
  );
};

interface StackCardProps {
  name: string;
  description: string;
  src: string;
}

const StackCard = ({ name, description, src }: StackCardProps) => (
  <Card
    radius="l"
    direction="row"
    border="neutral-alpha-weak"
    background="transparent"
    padding="s"
    vertical="center"
    fillWidth
    flex={1}
    style={{
      minHeight: "60px",
      maxHeight: "60px",
      borderWidth: "0",
    }}
    gap="12"
  >
    <Media
      src={src}
      width={2.3}
      height={2.3}
      overflow="hidden"
      radius="m"
      unoptimized
    />
    <Column horizontal="start" vertical="start" gap="2">
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
    </Column>
  </Card>
);

export default Stack;

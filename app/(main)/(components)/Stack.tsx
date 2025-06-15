"use client";

import {
  Column,
  Text,
  Flex,
  Card,
  Grid,
  Avatar,
  Media,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import "./../global.css";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
export default function Stack({ id }: { id: string }) {
  const [stacksData, setStacksData] = useState<
    { name: string; description: string; src: string }[]
  >([]);

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
        } else {
          setStacksData(data.stacks);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [id]);
  const stacks = stacksData;

  return (
    <>
      {stacks.length > 0 && stacks.some(stack => stack.name && stack.description && stack.src) && (
       <> <Column fillWidth fitHeight paddingX="s" gap="16">
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
            {stacks.map((stack, index) => (
              <StackCard
                key={index}
                name={stack.name}
                description={stack.description}
                src={stack.src}
              />
            ))}
          </Grid>
        </Column>
         <Flex fillWidth height={2.5}></Flex></>
      )}
    </>
  );
}

const StackCard = ({
  name,
  description,
  src,
}: {
  name: string;
  description: string;
  src: string;
}) => {
  return (
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
        minHeight: "60px !important",
        maxHeight: "60px !important",
        borderWidth: "0 ",
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
          className={inter.className + " text-big-lightest"}
        >
          {name}
        </Text>

        <Text
          variant="label-default-s"
          className={inter.className + " text-big-darker"}
        >
          {description}
        </Text>
      </Column>
    </Card>
  );
};

"use client";

import { Column, Text, Flex, Row, Kbd } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import "./../global.css";

export default function Intro({ id }: { id: string }) {
    const [introData, setIntroData] = useState<{
        tags: string[];
        heading: string;
        subheading: string;
        paragraphs: string[];
    } | null>(null);

    useEffect(() => {
        const fetchIntroData = async () => {
            try {
                const { data, error } = await supabase
                    .from("refolio_sections")
                    .select("intro")
                    .eq("username", id)
                    .single();

                if (error) {
                    console.error("Error fetching intro data:", error);
                } else {
                    setIntroData(data.intro);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        fetchIntroData();
    }, [id]);

    if (!introData) {
        return <Text></Text>;
    }

    const { tags, heading, subheading, paragraphs } = introData;
    return (
        introData &&
        Object.keys(introData).some(
            (key) =>
                key !== "id" &&
                (key === "tags" || key === "heading" || key === "subheading" || key === "paragraphs") &&
                introData[key] &&
                introData[key].length > 0
        ) && (
            <>
            <Column
                fillWidth
                fitHeight
                horizontal="space-between"
                vertical="center"
                paddingBottom="m"
                paddingX="s"
                gap="12"
            >
                <Text
                    variant="heading-strong-xl"
                    className={inter.className + " text-responsive-heading"}
                    style={{
                        lineHeight: "1.4",
                        fontSize: "30px",
                        letterSpacing: "-0.1px",
                        color: "#ddd",
                    }}
                >
                    {heading}{" "}
                    <Text style={{ color: "#6B6B6B" }}>{subheading}</Text>
                </Text>
                <Flex fillWidth></Flex>
                {paragraphs.map((text, index) => (
                    <Text
                        key={index}
                        className={inter.className + " text-paragraph text-responsive-paragraph"}
                    >
                        {text}
                    </Text>
                ))}
                <Flex></Flex>
                <Row gap="8">
                    {tags.map((tag, index) => (
                        <Kbd
                            key={index}
                            background="neutral-alpha-weak"
                            border="neutral-alpha-weak"
                            onBackground="neutral-weak"
                        >
                            {tag}
                        </Kbd>
                    ))}
                </Row>
            </Column>
             <Flex fillWidth height={2.5}></Flex></>
        )
    );
}

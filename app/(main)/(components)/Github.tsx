"use client";

import { Column, Text, Flex, Card, Grid, Row } from "@once-ui-system/core";
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

interface GithubProps {
    id: string;
}

interface RepositoryData {
    name: string;
    description: string;
    primaryLanguage: { name: string } | null;
    url: string;
    stargazerCount: number;
}

export default function Github({ id }: GithubProps) {
    const [repositories, setRepositories] = useState<RepositoryData[]>([]);

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                // Get the GitHub username from your database
                const { data: userData, error: userError } = await supabase
                    .from("refolio_sections")
                    .select("github_username")
                    .eq("username", id)
                    .single();

                if (userError) {
                    console.error("Error fetching GitHub username:", userError);
                    return;
                }

                if (userData?.github_username) {
                    // Fetch pinned repositories using GitHub GraphQL API
                    const query = `
                        query($login: String!) {
                            user(login: $login) {
                                pinnedItems(first: 6, types: REPOSITORY) {
                                    nodes {
                                        ... on Repository {
                                            name
                                            description
                                            url
                                            primaryLanguage {
                                                name
                                            }
                                            stargazerCount
                                        }
                                    }
                                }
                            }
                        }
                    `;
                    const response = await fetch("https://api.github.com/graphql", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                        },
                        body: JSON.stringify({
                            query,
                            variables: { login: userData.github_username },
                        }),
                    });
                    const result = await response.json();
                    const repos = result.data?.user?.pinnedItems?.nodes || [];
                    setRepositories(repos);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        fetchGithubData();
    }, [id]);

    return (
        <>
            {repositories.length > 0 && (
                <>
                    <Column fillWidth fitHeight paddingX="s" gap="16">
                        <Text
                            variant="heading-strong-xs"
                            onBackground="neutral-medium"
                            className={inter.className}
                        >
                            Github Repositories
                        </Text>
                        <Grid
                            fillWidth
                            fitHeight
                            gap="16"
                            columns={2}
                            className="responsive-container"
                        >
                            {repositories.map((repo, index) => (
                                <RepositoryCard key={index} {...repo} />
                            ))}
                        </Grid>
                    </Column>
                    <Flex fillWidth height={2.5}></Flex>
                </>
            )}
        </>
    );
}

interface RepositoryCardProps extends RepositoryData {}

const RepositoryCard = ({
    name,
    description,
    primaryLanguage,
    url,
    stargazerCount,
}: RepositoryCardProps) => (
    <Card
        radius="l-4"
        direction="row"
        border="neutral-alpha-weak"
        background="surface"
        padding="m"
        vertical="center"
        fillWidth
        flex={1}
        style={{
            backgroundColor: "#1C1C1C",
            minHeight: "100px",
        }}
        onClick={() => window.open(url, "_blank")}
        rel="noopener noreferrer"
    >
        <Row gap="12">
            <Column horizontal="start" vertical="start" gap="2" fillHeight>
                <Text
                    variant="label-strong-s"
                    className={`${inter.className} text-big-lighter`}
                >
                    <>{name}</>
                </Text>
                <Flex fillWidth height={0.15}></Flex>
                <Text
                    variant="label-default-s"
                    className={`${inter.className} text-big-darker`}
                >
                    {description}
                </Text>
                <Flex fillWidth height={0.2}></Flex>
                <Flex horizontal="space-between" vertical="center" fillWidth fitHeight>
                    <Text
                        variant="label-default-s"
                        className={`${inter.className} text-small`}
                    >
                        <>{primaryLanguage?.name}</>
                    </Text>
                    <Text
                        variant="label-default-s"
                        className={`${inter.className} text-small`}
                    >
                        <i className="ri-star-line"></i> {stargazerCount}
                    </Text>
                </Flex>
            </Column>
        </Row>
    </Card>
);

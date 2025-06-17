"use client";

import { Button, Row, SmartLink, Text } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import "./../global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Footer() {
  const handleCreateClick = () => {
    window.open("https://re-folio.vercel.app/user/me", "_self");
  };

  return (
    <Row
      fillWidth
      fitHeight
      paddingX="s"
      horizontal="space-between"
      vertical="center"
      marginTop="20"
    >
      <Text
        className={`${inter.className} text-big-darker`}
        variant="label-default-s"
      >
        Built with{" "}
        <SmartLink href="/">
          <Text onBackground="neutral-weak">
            <u>re-folio</u>
          </Text>
        </SmartLink>
        ✨
      </Text>
      <Row gap="8">
        <Button
          variant="secondary"
          size="m"
          style={{ backgroundColor: "#1c1c1c", padding: "5px 8px" }}
          onClick={() =>
            window.open("https://github.com/divyanshudhruv/re-folio", "_blank")
          }
        >
          <Text variant="body-default-m" style={{ color: "#6B6B6B" }}>
            <i className="ri-github-line"></i>
          </Text>
        </Button>
        <Button
          variant="secondary"
          size="m"
          style={{ backgroundColor: "#1c1c1c", padding: "5px 5px" }}
          onClick={handleCreateClick}
        >
          <Text variant="body-default-m" style={{ color: "#6B6B6B" }}>
            Create <i className="ri-arrow-right-s-line"></i>
          </Text>
        </Button>
      </Row>
    </Row>
  );
}

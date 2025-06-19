"use client";

import { Column, Text, Flex, Button, Row } from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

import PersonalDetailsSetting from "./settings-components/PersonalDetails";
import AwardsSetting from "./settings-components/Awards";
import ExperienceSetting from "./settings-components/Experience";
import CertificationSetting from "./settings-components/Certification";
import LanguagesSetting from "./settings-components/Languages";
import StackSetting from "./settings-components/Stack";
import ProjectSetting from "./settings-components/Projects";
import SummarySetting from "./settings-components/Summary";
import EducationSetting from "./settings-components/Education";
import IntroductionSetting from "./settings-components/Introduction";
import PasswordProtection from "./settings-components/PasswordProtection";
import Footer from "../Footer";
import Github from "./settings-components/Github";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Space = () => <Flex fillWidth height={0.5} />;

export default function BodySettings() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setId(session?.user.id || null);
    };

    fetchData();
  }, []);

  const renderSettingsComponents = () => {
    const components = [
      <PersonalDetailsSetting id={id!} />,
      <Space />,
      <IntroductionSetting id={id!} />,
      <Space />,

      <ExperienceSetting id={id!} />,
      <Space />,

      <ProjectSetting id={id!} />,
      <Space />,

      <Github id={id!} />,
      <Space />,

      <EducationSetting id={id!} />,
      <Space />,

      <StackSetting id={id!} />,
      <Space />,

      <CertificationSetting id={id!} />,
      <Space />,

      <AwardsSetting id={id!} />,
      <Space />,

      <LanguagesSetting id={id!} />,
      <Space />,

      <SummarySetting id={id!} />,
      <Space />,

      <PasswordProtection id={id!} />,
      <Space />,
    ];

    return components.map((Component, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.25, duration: 0.5 }}
      >
        {Component}
        <Space />
      </motion.div>
    ));
  };

  return (
    <Column
      fillWidth
      fitHeight
      horizontal="space-between"
      vertical="center"
      paddingBottom="m"
      paddingX="s"
      gap="12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text
          variant="heading-strong-xl"
          onBackground="neutral-medium"
          className={`${inter.className} text-responsive-heading`}
          style={{
            lineHeight: "1.4",
            fontSize: "30px",
            letterSpacing: "-0.1px",
          }}
        >
          Welcome to your settings page.{" "}
          <Text style={{ color: "#6B6B6B" }}>
            Customize your portfolio effortlessly.
          </Text>
        </Text>
        <Flex fillWidth height={1} />
        <Text
          className={`${inter.className} text-paragraph text-responsive-paragraph`}
        >
          We're working hard to improve the user interface and settings to
          ensure that customizing your portfolio is as seamless and intuitive as
          possible. Whether it's refining the design, adding new features, or
          enhancing the overall user experience, we're committed to making
          continuous improvements.
          <br />
          <br />
          Your feedback is invaluable to us, and we encourage you to share your
          thoughts, ideas, or suggestions. Additionally, if you're interested in
          contributing to this project, we'd love to have you on board.
          Together, we can create something truly remarkable!
        </Text>

        {!id && (
          <Flex marginTop="16" data-theme="dark">
            <Button
              size="s"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              SignIn
            </Button>
          </Flex>
        )}
      </motion.div>

      <Flex fillWidth />

      {id && (
        <>
          {renderSettingsComponents()}
          <Row fillWidth style={{ minWidth: "100%", width: "100%" }} center>
            <Footer />
          </Row>
        </>
      )}
    </Column>
  );
}

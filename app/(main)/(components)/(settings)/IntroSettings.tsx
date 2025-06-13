"use client";

import {
  Column,
  Text,
  Flex,
  Row,
  Kbd,
  Input,
  Textarea,
  Select,
  Button,
  TagInput,
  DateRangeInput,
  MediaUpload,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function IntroSettings() {
  const [tags, setTags] = useState<string[]>(["React", "Next.js"]);

  const handleChange = (newTags: string[]) => {
    setTags(newTags);
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
      <Text
        variant="heading-strong-xl"
        onBackground="neutral-medium"
        className={inter.className + " text-responsive-heading"}
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
      <Flex fillWidth></Flex>
      <Text
        className={
          inter.className + " text-paragraph text-responsive-paragraph"
        }
      >
        We are excited to announce that we are working tirelessly to bring you a
        suite of incredible features designed to make your portfolio management
        seamless and efficient. From one-click deployment to advanced
        customization options, our upcoming updates aim to empower you to
        showcase your skills and projects like never before.
        <br />
        <br />
        Stay tuned as we continue to innovate and refine our platform to deliver
        the best possible experience for developers, designers, and creators
        alike. Your journey to building a stunning portfolio is about to get
        even better!
      </Text>
      <Flex></Flex>
      <Row gap="8">
        <Kbd
          background="neutral-alpha-weak"
          border="neutral-alpha-weak"
          onBackground="neutral-weak"
        >
          coming soon
        </Kbd>

        <Kbd
          background="neutral-alpha-weak"
          border="neutral-alpha-weak"
          onBackground="neutral-weak"
        >
          @beta
        </Kbd>
      </Row>
      {/* <Space></Space>
      <Column fillWidth fitHeight gap="16">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Personal Details
        </Text>
        <Column>
          <Input radius="top" id="input-1" label="Name" height="s" />
          <Input radius="bottom" id="input-2" label="Expertise" height="s" />
          <Flex height={1}></Flex>
          <Row fillWidth horizontal="space-between" vertical="center">
            <Select
              id="basic-select"
              label="Where are you from?"
              options={[
                { label: "United States", value: "us" },
                { label: "Canada", value: "ca" },
                { label: "United Kingdom", value: "uk" },
                { label: "Australia", value: "au" },
              ]}
              maxWidth={1}
              style={{ maxWidth: "fit-content" }}
              height="s"
            />
            <Button variant="primary">Save</Button>
          </Row>
        </Column>
      </Column>
      
      <Space />
      <Column fillWidth fitHeight gap="16">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Introduction
        </Text>
        <Column>
          <Input radius="top" id="input-1" label="Name" height="s" />
          <Input radius="none" id="input-2" label="Expertise" height="s" />
          <Textarea
            lines={6}
            id="textarea-1"
            radius="bottom"
            placeholder="Tell us about yourself"
            description="Your bio will be displayed on your public profile"
          ></Textarea>
          <Flex height={1}></Flex>
          <TagInput
            id="tag-input-example"
            value={tags}
            onChange={handleChange}
            placeholder="Add interest"
            hasSuffix={
              <Kbd position="absolute" top="12" right="12">
                Enter
              </Kbd>
            }
          />
          <Flex height={1}> </Flex>
          <Row fillWidth horizontal="end" vertical="center">
            <Button variant="primary">Save</Button>
          </Row>
        </Column>
      </Column>
      <Flex fillWidth height={0.5} />
      <Column fillWidth fitHeight gap="16">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Experience
        </Text>
        <Column>
          <Row gap="20" fillWidth>
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              className={inter.className}
            >
              1.
            </Text>
            <Column fillWidth>
              {" "}
              <Input radius="top" id="input-1" label="Name" height="s" />
              <Input radius="none" id="input-2" label="Expertise" height="s" />
              <DateRangeInput
                id="basic-date-range-example"
                startLabel="Start date"
                endLabel="End date"
                value={undefined}
                height="s"
                radius="none"
                onChange={() => {}}
                style={{ zIndex: "999" }}
              />
              <MediaUpload
                style={{
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
                  backgroundColor: "#262626",
                  zIndex: "990",
                }}
                className="text-big-lightest"
              />
            </Column>{" "}
          </Row>
          <Flex height={1}> </Flex>
          <Row fillWidth horizontal="end" vertical="center" gap="8">
            <Button variant="secondary">Add</Button>

            <Button variant="primary">Save</Button>
          </Row>{" "}
        </Column>
      </Column> */}
    </Column>
  );
}

const Space = () => <Flex fillWidth height={0.5} />;

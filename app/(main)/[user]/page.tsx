"use client";

import {
  Column,
  Flex,
  Spinner,
  Text,
  Button,
  PasswordInput,
  Kbd,
  Row,
} from "@once-ui-system/core";
import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";

import Summary from "../(components)/Summary";
import Intro from "../(components)/Intro";
import Experience from "../(components)/Experience";
import Education from "../(components)/Education";
import Projects from "../(components)/Projects";
import Nav from "../(components)/Nav";
import Stack from "../(components)/Stack";
import Awards from "../(components)/Awards";
import Language from "../(components)/Languages";
import Certifications from "../(components)/Certification";
import Footer from "../(components)/Footer";
import { supabase } from "@/app/lib/supabase";
import "./../global.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const [state, setState] = useState({
    username: "",
    loading: true,
    isPasswordProtected: false,
    password: "",
    isAuthenticated: false,
    error: false,
    errorMessage: "",
  });

  const {
    username,
    loading,
    isPasswordProtected,
    password,
    isAuthenticated,
    error,
    errorMessage,
  } = state;
  const [submitText, setSubmitText] = useState("Submit");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [authorUserSlugDescription, setAuthorUserSlugDescription] =
    useState("");

  useEffect(() => {
    const userSlug =
      window.location.pathname.split("/").pop()?.replace(/^@/, "") || "";
    setState((prev) => ({ ...prev, username: userSlug }));

    fetchPasswordProtection(userSlug);
    setAuthorUserSlugDescription(userSlug);
  }, []);

  // Time for Spinner to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, loading: false }));
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchPasswordProtection = useCallback(async (userSlug: string) => {
    try {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("is_password_protected, refolio_password")
        .eq("username", userSlug)
        .single();

      if (error) {
        console.error("Error fetching password protection:", error);
        return;
      }

      if (data) {
        setState((prev) => ({
          ...prev,
          isPasswordProtected: data.is_password_protected,
        }));

        if (!data.is_password_protected || !data.refolio_password) {
          setTimeout(() => {
            setState((prev) => ({ ...prev, isAuthenticated: true }));
          }, 500);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, []);

  const handlePasswordSubmit = async () => {
    setSubmitText("Submitting...");
    setIsSubmitDisabled(true);
    try {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("refolio_password")
        .eq("username", username)
        .single();

      if (error) {
        console.error("Error fetching password:", error);
        setState((prev) => ({
          ...prev,
          error: true,
          errorMessage: "An error occurred. Please try again.",
        }));
        return;
      }

      if (data && password === data.refolio_password) {
        setState((prev) => ({
          ...prev,
          error: false,
          errorMessage: "",
          isAuthenticated: true,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: true,
          errorMessage: "Incorrect password. Please try again.",
          password: "",
        }));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setState((prev) => ({
        ...prev,
        error: true,
        errorMessage: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setSubmitText("Submit");
      setIsSubmitDisabled(false);
    }
  };

  const renderPasswordPrompt = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0, duration: 0.5 }}
      className="password-prompt-container"
      style={{
        display: !isAuthenticated ? "flex" : "none",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        maxWidth: "37.5rem",
        width: "100%",
        height: "100%",
        gap: "1rem",
      }}
    >
      <Column
        maxWidth={37.5}
        vertical="center"
        horizontal="start"
        fillWidth
        fillHeight
        gap="4"
      >
        {authorUserSlugDescription === "divyanshudhruv" ? (
          <Text
            variant="heading-strong-xl"
            className={`${inter.className} text-responsive-heading`}
            style={{
              lineHeight: "1.4",
              fontSize: "30px",
              letterSpacing: "-0.1px",
              color: "#ddd",
            }}
          >
            <Row vertical="center">
              {" "}
              Password Protected&nbsp;
              <Kbd
                background="accent-medium"
                border="accent-medium"
                onBackground="accent-weak"
                height={1.3}
              >
                Creator
              </Kbd>
            </Row>
          </Text>
        ) : (
          <Text
            variant="heading-strong-xl"
            className={`${inter.className} text-responsive-heading`}
            style={{
              lineHeight: "1.4",
              fontSize: "30px",
              letterSpacing: "-0.1px",
              color: "#ddd",
            }}
          >
            Password Protected
          </Text>
        )}

        <Text variant="label-default-s" className="text-big-darker">
          Please enter the password to access this page.
        </Text>
        <Flex fillWidth height={0.5} />
        <PasswordInput
          id=""
          type="text"
          placeholder="Enter password"
          className="password-input"
          value={password}
          onChange={(e) =>
            setState((prev) => ({ ...prev, password: e.target.value }))
          }
          error={error}
          errorMessage={errorMessage}
          description={
            authorUserSlugDescription === "divyanshudhruv" ? (
              <Text className="text-small">
                The password is <b className="text-small-lighter">ax8dr</b>
              </Text>
            ) : null
          }
        />
        <Flex fillWidth height={0.5} />
        <Button onClick={handlePasswordSubmit} disabled={isSubmitDisabled}>
          {submitText}
        </Button>
      </Column>
    </motion.div>
  );

  const renderLoadingState = (text: string) => (
    <Column maxWidth={37.5} center fillWidth fillHeight>
      <Spinner size="xl" />
      <Flex fillWidth height={0.1} />
      <Text variant="label-default-s" className="text-small">
        {text}
      </Text>
    </Column>
  );

  const renderContent = () => {
    const components = [
      <Nav id={username} />,
      <Space />,
      <Intro id={username} />,
      <Experience id={username} />,
      <Projects id={username} />,
      <Education id={username} />,
      <Stack id={username} />,
      <Certifications id={username} />,
      <Awards id={username} />,
      <Language id={username} />,
      <Summary id={username} />,
      <Footer />,
    ];

    return (
      <Column
        maxWidth={37.5}
        center
        fillWidth
        fitHeight
        className="body-container"
        style={{ display: loading ? "none" : "flex" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5 }}
        >
          {components.map((Component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.15, duration: 0.5 }}
            >
              {Component}
            </motion.div>
          ))}
        </motion.div>
      </Column>
    );
  };

  return (
    <Column
      fillWidth
      style={{ minHeight: "100vh", backgroundColor: "#1A1A1A" }}
      background="surface"
      paddingY="l"
      horizontal="center"
      vertical="start"
      data-theme="dark"
    >
      {loading && renderLoadingState("checking security...")}
      {!loading &&
        isPasswordProtected &&
        !isAuthenticated &&
        renderPasswordPrompt()}
      {!loading && isAuthenticated && renderContent()}
    </Column>
  );
}

const Space = () => <Flex fillWidth height={2.5} />;

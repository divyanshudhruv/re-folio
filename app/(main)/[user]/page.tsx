"use client";

import {
  Column,
  Flex,
  Spinner,
  Text,
  Button,
  Input,
  PasswordInput,
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
    loadingIntermediate: true,
    isPasswordProtected: false,
    password: "",
    isAuthenticated: false,
    isAuthenticatedLoading: false,
    correctPassword: "",
    error: false,
    errorMessage: "",
    buttonText: "Submit",
    buttonDisabled: false,
  });

  const {
    username,
    loading,
    loadingIntermediate,
    isPasswordProtected,
    password,
    isAuthenticated,
    isAuthenticatedLoading,
    correctPassword,
    error,
    errorMessage,
    buttonText,
    buttonDisabled,
  } = state;

  useEffect(() => {
    const userSlug =
      window.location.pathname.split("/").pop()?.replace(/^@/, "") || "";
    setState((prev) => ({
      ...prev,
      username: userSlug,
      loadingIntermediate: false,
    }));

    fetchPasswordProtection(userSlug);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, loading: false }));
    }, 5000);
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
          correctPassword: data.refolio_password,
        }));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, []);

  const handlePasswordSubmit = () => {
    setState((prev) => ({
      ...prev,
      buttonDisabled: true,
      buttonText: "Checking...",
    }));

    setTimeout(() => {
      if (password === correctPassword) {
        setState((prev) => ({
          ...prev,
          error: false,
          errorMessage: "",
          isAuthenticatedLoading: true,
        }));

        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            isAuthenticatedLoading: false,
          }));
        }, 3000);
      } else {
        setState((prev) => ({
          ...prev,
          error: true,
          errorMessage: "Incorrect password. Please try again.",
          isAuthenticated: false,
          password: "",
        }));
      }
      setState((prev) => ({
        ...prev,
        buttonText: "Submit",
        buttonDisabled: false,
      }));
    }, 2000);
  };

  const renderPasswordPrompt = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
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
        <Text variant="label-default-s" className="text-big-darker">
          Please enter the password to access this page.
        </Text>
        <Flex fillWidth height={0.5} />
        <PasswordInput
          type="text"
          name="fakeusernameremembered"
          id=""
          placeholder="Enter password"
          className="password-input"
          value={password}
          onChange={(e) =>
            setState((prev) => ({ ...prev, password: e.target.value }))
          }
          error={error}
          errorMessage={errorMessage}
        />
        <Flex fillWidth height={0.5} />
        <Button onClick={handlePasswordSubmit} disabled={buttonDisabled}>
          {buttonText}
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
      {loadingIntermediate && renderLoadingState("checking security...")}
      {!loadingIntermediate &&
        isPasswordProtected &&
        !isAuthenticated &&
        !isAuthenticatedLoading &&
        renderPasswordPrompt()}
      {isAuthenticatedLoading && renderLoadingState(`loading ${username}...`)}
      {!loadingIntermediate && isAuthenticated && renderContent()}
    </Column>
  );
}

const Space = () => <Flex fillWidth height={2.5} />;

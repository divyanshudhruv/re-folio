"use client";

import { Column, Flex, Spinner } from "@once-ui-system/core";
import { motion } from "framer-motion";

import Summary from "../(components)/Summary";
import Intro from "../(components)/Intro";
import Experience from "../(components)/Experience";
import Education from "../(components)/Education";
import Projects from "../(components)/Projects";
import "./../global.css";
import Nav from "../(components)/Nav";
import Stack from "../(components)/Stack";
import Awards from "../(components)/Awards";
import Language from "../(components)/Languages";
import Certifications from "../(components)/Certification";
import Footer from "../(components)/Footer";
import { useState, useEffect } from "react";
import React from "react";

export default function Home() {
  const [username, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingIntermediate, setLoadingIntermediate] = useState(true);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const userSlug = pathSegments[pathSegments.length - 1].replace(/^@/, "");
    setUser(userSlug);
    setLoadingIntermediate(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
      <Column
        maxWidth={37.5}
        center
        fillWidth
        fillHeight
        style={{ display: loading ? "flex" : "none" }}
      >
        <Spinner size="xl" />
      </Column>
      {!loadingIntermediate && (
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
            transition={{ delay: 5, duration: 0.5 }}
          >
            {[
              <Nav id={username} />,
              <Space />,

              <Intro id={username} />,
              <Space />,

              <Experience id={username} />,
              <Space />,

              <Projects id={username} />,
              <Space />,

              <Education id={username} />,
              <Space />,

              <Stack id={username} />,
              <Space />,

              <Certifications id={username} />,
              <Space />,

              <Awards id={username} />,
              <Space />,

              <Language id={username} />,
              <Space />,

              <Summary id={username} />,
              <Space />,

              <Footer />,
            ].map((Component, index) => (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5.5 + index * 0.15, duration: 0.5 }}
                >
                  {Component}
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        </Column>
      )}
    </Column>
  );
}

const Space = () => <Flex fillWidth height={2.5}></Flex>;

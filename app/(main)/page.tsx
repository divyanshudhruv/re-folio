"use client";

import {
  Column,
  Text,
  Button,
  Row,
  Input,
  useToast,
  Spinner,
  Line,
  Flex,
  Media,
  SmartLink,
  ThemeSwitcher,
} from "@once-ui-system/core";
import { useState } from "react";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  return (
    <Column
      fillWidth
      style={{ minHeight: "100vh", backgroundColor: "#1A1A1A" }}
      background="surface"
      paddingY="l"
      horizontal="center"
      vertical="center"
    >
      <Column
        maxWidth={37.5}
        center
        fillWidth
        fitHeight
        className="body-container"
      >
        <LoginCard />
        <Text className="text-small" style={{ marginTop: "-30px" }}>
          sign up for early access
        </Text>{" "}
        <Text className="text-small" style={{ marginTop: "-0px" }}>
          already logged in? <SmartLink href="/user/me">click here</SmartLink>
        </Text>
      </Column>
    </Column>
  );
}

function LoginCard() {
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { addToast } = useToast();

  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/user/me`,
          queryParams: {
            prompt: "select_account",
            access_type: "offline", // Optional, for refresh token
            response_type: "code", // ✅ Ensures code is sent in search params
          },
        },
      });

      if (error) throw error;
      addToast({ message: "Redirecting to Google...", variant: "success" });
    } catch (err) {
      addToast({ message: `Google login failed`, variant: "danger" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const signInWithEmail = async () => {
    try {
      setEmailLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
      addToast({
        message: "Magic link sent to your email.",
        variant: "success",
      });
    } catch (err) {
      addToast({ message: `Email sign-in failed`, variant: "danger" });
    } finally {
      setEmailLoading(false);
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Column
      width={25}
      fitHeight
      border="neutral-alpha-weak"
      borderStyle="solid"
      radius="l"
      padding="l"
      gap="12"
      paddingY="l"
      style={{ scale: "0.8" }}
      className="responsive-login-card"
    >
      <Text
        variant="heading-strong-xl"
        style={{ fontSize: "29px" }}
        className={inter.className + " text-big-lightest"}
      >
        Sign Up
      </Text>
      <Text
        variant="body-default-xl"
        className={inter.className + " text-small"}
      >
        Create a free{" "}
        <SmartLink href={"/"}>
          <u>re-folio</u>
        </SmartLink>{" "}
        account
      </Text>

      <Input
        id=""
        placeholder="Enter your email"
        height="m"
        size={32}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginTop: "16px", height: "52px !important" }}
      />

      <Button
        size="l"
        variant="primary"
        fillWidth
        style={{ marginTop: "-4px" }}
        onClick={signInWithEmail}
        disabled={!isEmailValid || emailLoading || googleLoading}
      >
        <Row center fillWidth fillHeight horizontal="center" vertical="center">
          {emailLoading ? (
            <>
              <Spinner size="s" />
              &nbsp;&nbsp;Sending link...
            </>
          ) : (
            <>
              <Text variant="label-default-xl">
                {" "}
                <i className="ri-mail-line"></i>&nbsp;&nbsp;Send me a magic link
              </Text>
            </>
          )}
        </Row>
      </Button>

      <Flex />

      <Column fillWidth center>
        <Line
          fillWidth
          width={25}
          height={0.08}
          style={{
            marginTop: "0px",
            position: "absolute",
            backgroundColor: "#262626",
          }}
          zIndex={9}
        />
        <Flex zIndex={10}>
          <Text
            variant="label-default-xl"
            className={inter.className}
            onBackground="neutral-weak"
            style={{ backgroundColor: "#1A1A1A" }}
          >
            OR CONTINUE WITH
          </Text>
        </Flex>
      </Column>

      <Flex />

      <Button
        size="l"
        variant="secondary"
        fillWidth
        onClick={signInWithGoogle}
        disabled={googleLoading || emailLoading}
      >
        <Row center fillWidth fillHeight horizontal="center" vertical="center">
          {googleLoading ? (
            <>
              <Spinner size="s" />
              &nbsp;&nbsp;Redirecting...
            </>
          ) : (
            <>
              <Media
                src="https://companieslogo.com/img/orig/google-9646e5e7.png?t=1700059830"
                width={1.1}
                height={1.1}
                unoptimized
              />
              &nbsp;&nbsp;
              <Text variant="heading-default-s" className={inter.className}>
                Google
              </Text>
            </>
          )}
        </Row>
      </Button>
    </Column>
  );
}

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
} from "@once-ui-system/core";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import { motion } from "framer-motion";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Column
      fillWidth
      style={{ minHeight: "100vh", backgroundColor: "#1A1A1A" }}
      background="surface"
      paddingY="l"
      paddingX="l"
      horizontal="center"
      vertical="center"
      data-theme="dark"
    >
      {loading ? <LoadingScreen /> : <MainContent />}
    </Column>
  );
}

function LoadingScreen() {
  return (
    <Column maxWidth={37.5} center fillWidth fillHeight>
      <Spinner size="xl" />
      <Flex fillWidth height={0.1} />
      <Text variant="label-default-s" className="text-small">
        starting...
      </Text>
    </Column>
  );
}

function MainContent() {
  return (
    <Row
      horizontal="space-between"
      vertical="center"
      fillWidth
      fillHeight
      className="body-container responsive-landing-main-container"
      style={{ maxWidth: "1000px" }}
    >
      <LoginText />
      <LoginCard />
    </Row>
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
      setEmailLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code",
          },
        },
      });
      if (error) throw error;
      // addToast({ message: "Redirecting to Google...", variant: "success" });
    } catch {
      addToast({ message: "Google login failed", variant: "danger" });
    } finally {
      setGoogleLoading(false);
      setEmailLoading(false);
    }
  };

  const signInWithEmail = async () => {
    try {
      setEmailLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      // addToast({ message: "Magic link sent to your email.", variant: "success" });
    } catch {
      addToast({ message: "Email sign-in failed", variant: "danger" });
    } finally {
      setEmailLoading(false);
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Column maxWidth={37.5} center fillWidth fitHeight className="body-container">
        <CardContent
          email={email}
          setEmail={setEmail}
          isEmailValid={isEmailValid}
          emailLoading={emailLoading}
          googleLoading={googleLoading}
          signInWithEmail={signInWithEmail}
          signInWithGoogle={signInWithGoogle}
        />
        <FooterLinks />
      </Column>
    </motion.div>
  );
}

function CardContent({
  email,
  setEmail,
  isEmailValid,
  emailLoading,
  googleLoading,
  signInWithEmail,
  signInWithGoogle,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  isEmailValid: boolean;
  emailLoading: boolean;
  googleLoading: boolean;
  signInWithEmail: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}) {
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
      <Text variant="body-default-xl" className={inter.className + " text-small"}>
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
        <Row center fillWidth fillHeight>
          {emailLoading ? (
            <>
              <Spinner size="s" />
              &nbsp;&nbsp;Sending link...
            </>
          ) : (
            <>
              <Text variant="label-default-xl">
                <i className="ri-mail-line"></i>&nbsp;&nbsp;Send me a magic link
              </Text>
            </>
          )}
        </Row>
      </Button>
      <Divider />
      <Button
        size="l"
        variant="secondary"
        fillWidth
        onClick={signInWithGoogle}
        disabled={googleLoading || emailLoading}
      >
        <Row center fillWidth fillHeight>
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

function Divider() {
  return (
    <Column fillWidth center>
      <Line
        fillWidth
        width={25}
        height={0.08}
        style={{ backgroundColor: "#262626" }}
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
  );
}

function FooterLinks() {
  return (
    <>
      <Text className="text-small" style={{ marginTop: "-30px" }}>
        sign up for early access
      </Text>
      <Text className="text-small" style={{ marginTop: "-0px" }}>
        already logged in? <SmartLink href="/user/me">click here</SmartLink>
      </Text>
    </>
  );
}

function LoginText() {
  return (
    <Column maxWidth={32} className="responsive-landing-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text
          variant="heading-strong-xl"
          onBackground="neutral-medium"
          className={inter.className + " text-responsive-heading"}
          style={{
            lineHeight: "1.4",
            fontSize: "40px",
            letterSpacing: "-0.1px",
          }}
        >
          Welcome to Re-Folio, your resume{" "}
          <Text style={{ color: "#6B6B6B" }}>in a portfolio style.</Text>
        </Text>
      </motion.div>
      <Flex fillWidth height={1} />
      <Flex maxWidth={26}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text
            style={{ fontSize: "15px" }}
            className={inter.className + " text-paragraph text-responsive-paragraph"}
          >
            Re-Folio is designed to help you create stunning resume portfolios
            with ease. Whether you're a designer, developer, or creative
            professional, showcase your skills and stand out with our platform's
            tools.
            <br />
            <br />
            Join our community and start building your resume portfolio today.
            Share your feedback, contribute to the project, and help us shape
            the future of Re-Folio!
          </Text>
        </motion.div>
      </Flex>
    </Column>
  );
}

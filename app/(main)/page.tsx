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
  Kbd,
  Scroller,
  Card,
  RevealFx,
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
      <Column
        maxWidth={37.5}
        center
        fillWidth
        fitHeight
        className="body-container"
      >
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
        <Row vertical="center">
          Sign Up&nbsp;
          <Kbd
            background="accent-medium"
            border="accent-medium"
            onBackground="accent-weak"
            height={1.3}
          >
            Beta
          </Kbd>
        </Row>
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
    <Column fillWidth center height={2.25}>
      <Line
        fillWidth
        width={25}
        height={0.1}
        style={{ backgroundColor: "#262626", position: "absolute" }}
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
        signup for early access
      </Text>
      <Text className="text-small" style={{ marginTop: "0px" }}>
        already logged in? <SmartLink href="/user/me">click here</SmartLink>
      </Text>
    </>
  );
}

function LoginText() {
  const [scrollerUsers, setScrollerUsers] = useState<
    { username: string; name: string; pfp: string }[]
  >([]);

  useEffect(() => {
    async function fetchScrollerData() {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("username,name,nav")
        .eq("is_published", true)
        .limit(20);

      if (!error && data && data.length > 0) {
        const users = data
          .filter((item: any) => item.nav?.pfp && item.nav.pfp.trim() !== "")
          .map((item: any) => ({
            username: item.username ?? "",
            name: item.name ?? "",
            pfp: item.nav.pfp,
          }));
        setScrollerUsers(users);
      }
    }
    fetchScrollerData();
  }, []);

  return (
    <Column maxWidth={32} className="responsive-landing-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RevealFx>
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
        </RevealFx>
      </motion.div>
      <Flex fillWidth height={1} />
      <Flex maxWidth={26}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RevealFx delay={0.2}>
            <Text
              style={{ fontSize: "15px" }}
              className={
                inter.className + " text-paragraph text-responsive-paragraph"
              }
            >
              Re-Folio is designed to help you create stunning resume portfolios
              with ease. Whether you're a designer, developer, or creative
              professional, showcase your skills and stand out with our
              platform's tools.
            </Text>
          </RevealFx>
          <Flex height={3}></Flex>{" "}
          <RevealFx>
            <Scroller maxWidth={32} fadeColor="transparent">
              <Row gap="12">
                {scrollerUsers.map((user) => (
                  <Card
                    key={user.username}
                    radius="l-4"
                    direction="row"
                    border="neutral-alpha-weak"
                    background="surface"
                    padding="s"
                    vertical="center"
                    style={{
                      backgroundColor: "#1C1C1C",
                      cursor: user.username ? "pointer" : "default",
                      width: "auto",
                      minWidth: "220px",
                    }}
                    onClick={() => {
                      if (user.username) {
                        window.open(`/@${user.username}`, "_blank");
                      }
                    }}
                  >
                    <Row gap="12" center>
                      <Column
                        horizontal="center"
                        vertical="start"
                        fillHeight
                        fitWidth
                      >
                        <Media
                          width={1.7}
                          height={1.7}
                          radius="l"
                          src={user.pfp}
                          unoptimized
                        />
                      </Column>
                      <Text
                        variant="label-default-s"
                        className={`${inter.className} text-big-lighter`}
                        style={
                          {
                            // Remove maxWidth so text can expand Card
                          }
                        }
                        title={user.name}
                      >
                        {user.name}
                      </Text>
                    </Row>
                  </Card>
                ))}
              </Row>
            </Scroller>{" "}
          </RevealFx>
          <Flex height={1}></Flex>
          <Row paddingX="20">
            {" "}
            <RevealFx delay={0.4}>
              <Text className="text-small" style={{ fontSize: "13px" }}>
                <i className="ri-information-line"></i>&nbsp;Only published
                re-folios are shown here.
              </Text>
            </RevealFx>
          </Row>
        </motion.div>
      </Flex>
    </Column>
  );
}

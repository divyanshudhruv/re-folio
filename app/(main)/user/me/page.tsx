"use client";

import { Column, Flex, Text, useToast, Spinner } from "@once-ui-system/core";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavSettings from "../../(components)/(settings)/NavSettings";
import BodySettings from "../../(components)/(settings)/BodySettings";
import { supabase } from "@/app/lib/supabase";
import "./../../../(main)/global.css";

export default function MePage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
        } else if (data.session) {
          console.log("Session fetched successfully");
          setUserId(data.session.user.id);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchSession();

    const timer = setTimeout(() => setLoading(false), 3000); // Spinner for 3 seconds
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
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Content userId={userId} />
      )}
    </Column>
  );
}

const LoadingSpinner = () => (
  <Column
    maxWidth={37.5}
    center
    fillWidth
    fillHeight
    style={{ display: "flex" }}
  >
    <Spinner size="xl" />
    <Flex fillWidth height={0.1} />
    <Text variant="label-default-s" className="text-small">
      loading your data...
    </Text>
  </Column>
);

const Content = ({ userId }: { userId: string | null }) => (
  <Column
    maxWidth={37.5}
    center
    fillWidth
    fitHeight
    className="body-container"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ width: "100%" }}
    >
      {userId && <NavSettings id={userId} />}
      <Space />
    </motion.div>
    <BodySettings />
  </Column>
);

const Space = () => <Flex fillWidth height={2.5} />;

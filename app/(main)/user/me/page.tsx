"use client";
import { Column, Flex, Text, useToast, Spinner } from "@once-ui-system/core";
import { useEffect, useState } from "react";
import NavSettings from "../../(components)/(settings)/NavSettings";
import "./../../../(main)/global.css";
import IntroSettings from "../../(components)/(settings)/IntroSettings";
import { supabase } from "@/app/lib/supabase";
import { motion } from "framer-motion";

export default function MePage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error fetching session:", error.message);
        
      } else if (data.session) {
          console.log("Successful")
      }
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Spinner will display for 3 seconds
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
      ) : (
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
            <NavSettings name="" descriptionWords={""} location="" /> <Space />
          </motion.div>
          <IntroSettings />
        </Column>
      )}
    </Column>
  );
}

const Space = () => <Flex fillWidth height={2.5}></Flex>;

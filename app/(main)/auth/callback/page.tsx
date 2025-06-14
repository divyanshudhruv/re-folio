"use client";
import { supabase } from "@/app/lib/supabase";
import { Spinner, Column, useToast, Text, Flex } from "@once-ui-system/core";
import { create } from "domain";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { addToast } = useToast();
  const { push } = useRouter();

  const handleCallback = async () => {
    const { data: session, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error.message);
      addToast({
        variant: "danger",
        message: "No active session found.",
      });
    } else if (session?.session?.user) {
      const user = session.session.user;
      const username = (user.user_metadata?.name || "default_username")
        .toLowerCase()
        .replace(/\s+/g, "");
      const email = user.email || "default_email@example.com";

      console.log("User Name:", username);
      console.log("User ID:", user.id);

      // Insert into `refolio_sections` table
      const { error: refolioError } = await supabase
        .from("refolio_sections")
        .upsert({
          id: user.id, // Ensure the ID is included for upsert
          username,
          name: session.session.user.user_metadata?.name || "Default Name",
          email,
          updated_at: new Date().toISOString(),
        });

      if (refolioError) {
        console.error(
          "Error inserting into refolio_sections:",
          refolioError.message
        );
      }

      // Insert into `users` table
      const { error: usersError } = await supabase.from("users").upsert({
        id: user.id,
        name: username,
        email,
        is_admin: false,
        created_at: new Date().toISOString(),
      });
      addToast({
        variant: "success",
        message: "Callback successful!",
      });

      push("/user/me");
      if (usersError) {
        addToast({
          variant: "danger",
          message: `Error inserting into users: ${usersError.message}`,
        });
      }
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <Column
      fillWidth
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1A1A",
        minWidth: "100vw",
      }}
      background="surface"
      horizontal="center"
      vertical="center"
      data-theme="dark"
    >
      <Spinner size="xl" />
      <Flex fillWidth height={0.1} />
      <Text variant="label-default-s" className="text-small">
        loading...
      </Text>
    </Column>
  );
}

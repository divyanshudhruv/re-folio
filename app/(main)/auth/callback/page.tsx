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

      push("/");
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

      // Check if user already exists in `users` table
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching user:", fetchError.message);
      }

      // Insert into `users` table
      const { error: usersError } = await supabase.from("users").upsert({
        id: user.id,
        username: username,
        email,
        is_admin: false,
        created_at: new Date().toISOString(),
        pfp: existingUser ? undefined : user.user_metadata?.avatar_url || "",
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

"use client";
import { supabase } from "@/app/lib/supabase";
import { Spinner, Column, useToast, Text, Flex } from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { addToast } = useToast();
  const { push } = useRouter();

  const handleCallback = async () => {
    try {
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        push("/");
        return;
      }

      const user = session?.session?.user;
      if (!user) {
        push("/");
        return;
      }

      const username = (user.user_metadata?.name || "default_username")
        .toLowerCase()
        .replace(/\s+/g, "");
      const email = user.email || "default_email@example.com";

      

      await upsertRefolioSections({ user, username, email });
      await upsertUsers({ user, username, email });

      push("/user/me");
    } catch (error) {
      console.error("Error in handleCallback:", error);
      addToast({
        variant: "danger",
        message: "An unexpected error occurred.",
      });
    }
  };

  interface User {
    id: string;
    user_metadata?: {
      name?: string;
      avatar_url?: string;
    };
    email?: string;
  }

  interface UpsertRefolioSectionsParams {
    user: User;
    username: string;
    email: string;
  }

  const upsertRefolioSections = async ({
    user,
    username,
    email,
  }: UpsertRefolioSectionsParams): Promise<void> => {
    const { error } = await supabase.from("refolio_sections").upsert({
      id: user.id,
      username,
      name: user.user_metadata?.name || "Default Name",
      email,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error inserting into refolio_sections:", error.message);
    }
  };

  interface UpsertUsersParams {
    user: User;
    username: string;
    email: string;
  }

  interface ExistingUser {
    id: string;
  }

  const upsertUsers = async ({
    user,
    username,
    email,
  }: UpsertUsersParams): Promise<void> => {
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError.message);
    }

    const { error: usersError } = await supabase.from("users").upsert({
      id: user.id,
      username,
      email,
      is_admin: false,
      created_at: new Date().toISOString(),
      pfp: existingUser ? undefined : user.user_metadata?.avatar_url || "",
    });

    if (usersError) {
      console.error("Error inserting into users:", usersError.message);
      addToast({
        variant: "danger",
        message: `Error inserting into users: ${usersError.message}`,
      });
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

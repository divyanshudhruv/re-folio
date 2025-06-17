import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
  useToast,
  Switch,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function PasswordProtection({ id }: { id: string }) {
  const { addToast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchPassword = useCallback(async () => {
    if (!id) {
      console.error("Invalid ID: ID is empty or undefined.");
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        console.log("No active session found.");
        return;
      }

      const { data, error } = await supabase
        .from("refolio_sections")
        .select("refolio_password, is_password_protected")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching password data:", error.message);
        return;
      }

      if (data) {
        setPassword(data.refolio_password || "");
        setIsPasswordProtected(data.is_password_protected || false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPassword();
  }, [fetchPassword]);

  useEffect(() => {
    setIsChecked(isPasswordProtected);
  }, [isPasswordProtected]);
  const handleUpdate = async () => {
    if (!id) {
      console.error("Invalid ID: ID is empty or undefined.");
      return;
    }

    const trimmedPassword = password.trim();
    if (isChecked && !trimmedPassword) {
      setError(true);
      setErrorMessage("Password cannot be empty when enabling protection.");
      return;
    }
    setPassword(trimmedPassword);

    try {
      const { error } = await supabase
        .from("refolio_sections")
        .update({
          refolio_password: isChecked ? password : null,
          is_password_protected: isChecked,
        })
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(
          `Failed to update password protection: ${error.message}`
        );
      }

      setError(false);
      setErrorMessage("Password updated successfully.");
      // addToast({
      //     variant: "success",
      //     message: "Password protection updated successfully.",
      // });
    } catch (error) {
      console.error(error);
      addToast({
        variant: "danger",
        message: "Failed to update password protection.",
      });
    }
  };

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="summary">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Password Protection
        </Text>
      </HeadingLink>
      <Column gap="16">
        <Switch
          label="Enable Password Protection"
          description="Toggle to enable or disable password protection for your re-folio."
          reverse
          isChecked={isChecked}
          onToggle={() => setIsChecked(!isChecked)}
        />
        {isChecked && (
          <Input
            id="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            height="m"
            error={error}
            errorMessage={errorMessage}
          />
        )}
        <Row fillWidth horizontal="end" vertical="center" gap="8">
          <Button
            data-theme="dark"
            variant="primary"
            onClick={async () => {
              setLoading(true);
              await handleUpdate();
              setLoading(false);
            }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

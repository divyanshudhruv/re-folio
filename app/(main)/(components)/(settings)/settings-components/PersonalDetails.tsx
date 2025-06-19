import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
  MediaUpload,
  Kbd,
} from "@once-ui-system/core";
import { Inter } from "next/font/google";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function PersonalDetailsSetting({ id }: { id: string }) {
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
    location: "",
    description: "",
    pfp: "",
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [usernameConditions, setUsernameConditions] = useState<boolean>(true);
  const [usernameMessages, setUsernameMessages] = useState<string>("");
  const [usernameMessagesError, setUsernameMessagesError] =
    useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const [{ data: userData }, { data: avatarData }, { data: navData }] =
        await Promise.all([
          supabase
            .from("refolio_sections")
            .select("username")
            .eq("id", id)
            .single(),
          supabase.from("users").select("pfp").eq("id", id).single(),
          supabase.from("refolio_sections").select("nav").eq("id", id).single(),
        ]);

      if (userData?.username) setUsername(userData.username);
      if (avatarData?.pfp)
        setPersonalDetails((prev) => ({ ...prev, pfp: avatarData.pfp }));
      if (navData?.nav) setPersonalDetails(navData.nav);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [id]);

  const fetchSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setSessionId(session.user.id);
    } catch (err) {
      console.error("Error fetching session:", err);
    }
  }, []);

  const checkUsernameChangePermission = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("can_change_username")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data?.can_change_username) {
      } else {
        setUsernameConditions(false);
      }
    } catch (err) {
      console.error("Error checking username change permission:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    fetchSession();
    checkUsernameChangePermission();
  }, [fetchData, fetchSession, checkUsernameChangePermission]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: existingEmails, error: emailFetchError } = await supabase
        .from("users")
        .select("email, id");

      if (emailFetchError) throw emailFetchError;

      const isEmailTaken = (existingEmails ?? []).some(
        (user) => user.email === personalDetails.email && user.id !== id
      );

      if (isEmailTaken) {
        console.error("This email is already in use. Please use another.");
        setEmailError(true);
        setEmailErrorMessage(
          "This email is already in use. Please use another."
        );
        setLoading(false);
        return;
      }

      await Promise.all([
        supabase
          .from("refolio_sections")
          .update({ nav: personalDetails })
          .eq("id", id),
        supabase
          .from("users")
          .update({ pfp: personalDetails.pfp })
          .eq("id", id),
        supabase
          .from("refolio_sections")
          .update({ name: personalDetails.name })
          .eq("id", id),
        supabase.from("users").update({ username: username }).eq("id", id),

        changeUsername(username),
      ]);
      console.log("Personal details and avatar updated successfully");
      setEmailError(false);
      setEmailErrorMessage("");
    } catch (err) {
      console.error("Error saving data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (userId: string, file: File) => {
    if (!userId) return;

    try {
      const fileName = `avatars/${sessionId}/${userId}-${Date.now()}-${
        file.name
      }`;
      const { data, error } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (error) throw new Error(`Failed to upload file: ${error.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("attachments")
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

      setPersonalDetails((prev) => ({ ...prev, pfp: publicUrlData.publicUrl }));
      console.log("File uploaded successfully:", publicUrlData.publicUrl);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const changeUsername = async (usernameArgs: string) => {
    usernameArgs = usernameArgs.trim();
    if (usernameArgs.includes(" ")) {
      setUsernameMessagesError(
        "Username should not contain spaces. Please choose another."
      );
      setUsernameMessages("");
      return;
    }
    try {
      const { data: existingUsernames, error: fetchError } = await supabase
        .from("refolio_sections")
        .select("username, id");

      if (fetchError) throw fetchError;

      const isUsernameTaken = existingUsernames.some(
        (user) => user.username === usernameArgs && user.id !== id
      );

      if (isUsernameTaken) {
        setUsernameMessagesError(
          "This username is already taken. Please choose another."
        );
        setUsernameMessages("");

        return;
      }

      const currentUser = existingUsernames.find((user) => user.id === id);

      if (currentUser?.username === usernameArgs) {
        setUsernameMessages("");
        setUsernameConditions(false);
        setUsernameMessagesError("");
        return;
      }

      const { data, error } = await supabase
        .from("refolio_sections")
        .select("can_change_username")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data?.can_change_username) {
        await supabase
          .from("refolio_sections")
          .update({
            username: usernameArgs.replaceAll(" ", "-"),
            can_change_username: false,
          })
          .eq("id", id);

        setUsernameMessages("Username updated successfully!");
        setUsernameMessagesError("");
        setUsernameConditions(false);
      } else {
        setUsernameMessagesError(
          "You can only change your username once. Please contact support."
        );
        setUsernameMessages("");
      }
    } catch (err) {
      setUsernameMessages("");
      setUsernameMessagesError("Error changing username. Try again later.");
    }
  };

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="personal-details">
        <Text
          variant="heading-strong-xs"
          onBackground="neutral-medium"
          className={inter.className}
        >
          Personal Details
        </Text>
      </HeadingLink>
      <Column>
        <Input
          spellCheck={false}
          radius="top"
          id="input-1"
          label="Name"
          height="s"
          value={personalDetails.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Input
          spellCheck={false}
          radius="none"
          id="input-username"
          placeholder="username"
          height="m"
          hasPrefix={<i className="ri-at-line text-big-darker"></i>}
          hasSuffix={<Kbd className="text-big-lighter">once</Kbd>}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={usernameConditions}
          description={usernameMessages}
          errorMessage={usernameMessagesError}
        />
        <Input
          spellCheck={false}
          radius="none"
          id="input-2"
          label="Email"
          height="s"
          value={personalDetails.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={emailError}
          errorMessage={emailErrorMessage}
        />
        <Input
          spellCheck={false}
          radius="none"
          id="input-3"
          label="Expertise"
          height="s"
          value={personalDetails.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <Row fillWidth horizontal="space-between" vertical="start">
          <MediaUpload
            style={{
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              backgroundColor: "#262626",
              zIndex: "990",
            }}
            className="text-big-lightest"
            emptyState={"Avatar"}
            width={7}
            minWidth={7}
            height={7}
            minHeight={7}
            onChange={(event) => {
              const file = (event.target as HTMLInputElement).files?.[0];
              if (file) handleFileUpload(id, file);
            }}
            initialPreviewImage={personalDetails.pfp}
          />
          <Column fillWidth horizontal="end" gap="16">
            <Input
              id="input-4"
              label="Where are you from?"
              radius="bottom-right"
              height="s"
              value={personalDetails.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <Button
              variant="primary"
              data-theme="dark"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Column>
        </Row>
      </Column>
    </Column>
  );
}

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
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("username")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching username:", error);
        } else if (data?.username) {
          setUsername(data.username);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchUsername();
  }, [id]);

  const [username_conditions, setUsernameConditions] = useState<boolean>(true);
  const [username_messages, setUsernameMessages] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setSessionId(session.user.id);
        } else {
          console.log("No active session found.");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchSession();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("pfp")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching avatar URL:", error);
        } else if (data?.pfp) {
          setPersonalDetails((prev) => ({
            ...prev,
            pfp: data.pfp,
          }));
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchAvatarUrl();
  }, []);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("nav")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching personal details:", error);
        } else if (data && data.nav) {
          setPersonalDetails(data.nav);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchPersonalDetails();
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    console.log(personalDetails);
    const updatePersonalDetails = async () => {
      try {
        const { error } = await supabase
          .from("refolio_sections")
          .update({ nav: personalDetails })
          .eq("id", id);

        if (error) {
          console.error("Error updating personal details:", error);
        } else {
          console.log("Personal details updated successfully");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    const updateAvatarUrl = async () => {
      try {
        const { error: userError } = await supabase
          .from("users")
          .update({ pfp: personalDetails.pfp })
          .eq("id", id);

        if (userError) {
          console.error("Error updating avatar URL in users table:", userError);
        } else {
          console.log("Avatar URL updated successfully in users table");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    await updatePersonalDetails();
    await updateAvatarUrl();
    await changeUsername(username);
    setLoading(false);
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
        .from("attachments") // Replace with your bucket name
        .upload(fileName, file);

      if (error) {
        throw new Error(
          `Failed to upload file for user ${userId}: ${error.message}`
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("attachments") // Replace with your bucket name
        .getPublicUrl(data.path);

      if (!publicUrlData.publicUrl) {
        throw new Error(`Failed to get public URL for user ${userId}`);
      }

      setPersonalDetails((prev) => ({
        ...prev,
        pfp: publicUrlData.publicUrl,
      }));

      console.log("File uploaded successfully:", publicUrlData.publicUrl);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkUsernameChangePermission = async () => {
      try {
        const { data, error } = await supabase
          .from("refolio_sections")
          .select("can_change_username")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching can_change_username:", error);
          return;
        }

        if (data?.can_change_username) {
          setUsernameMessages(
            "You can change your username only once. Please choose wisely."
          );
        } else {
          setUsernameConditions(false);
          setUsernameMessages(
            "Username change is disabled. You can only change it once."
          );
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    checkUsernameChangePermission();
  }, [id]);

  async function changeUsername(username_args: string) {
    try {
      const { data: existingUsernames, error: fetchError } = await supabase
        .from("refolio_sections")
        .select("username, id");

      if (fetchError) {
        console.error("Error fetching existing usernames:", fetchError);
        return;
      }

      const isUsernameTaken = existingUsernames.some(
        (user) => user.username === username_args && user.id !== id
      );

      if (isUsernameTaken) {
        setUsernameMessages(
          "This username is already taken. Please choose another."
        );
        return;
      }

      const currentUser = existingUsernames.find((user) => user.id === id);

      if (currentUser?.username === username_args) {
        const { error: updateError } = await supabase
          .from("refolio_sections")
          .update({
            username: username_args.replaceAll(" ", "-"),
          })
          .eq("id", id);

        if (updateError) {
          console.error("Error updating username:", updateError);
        } else {
          console.log("Username updated successfully");
          setUsernameMessages("Current username is already set.");
        }
        return;
      }

      const { data, error } = await supabase
        .from("refolio_sections")
        .select("can_change_username")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching can_change_username:", error);
        return;
      }

      if (data?.can_change_username) {
        const { error: updateError } = await supabase
          .from("refolio_sections")
          .update({
            username: username_args.replaceAll(" ", "-"),
            can_change_username: false,
          })
          .eq("id", id);

        if (updateError) {
          console.error("Error updating username:", updateError);
        } else {
          console.log("Username updated successfully");
          setUsernameMessages("Username updated successfully!");
        }
      } else {
        setUsernameMessages(
          "You can only change your username once. Please contact support."
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

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
          radius="top"
          id="input-1"
          label="Name"
          height="s"
          value={personalDetails.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Flex></Flex>
        <Input
          radius="none"
          id="input-1"
          placeholder="username"
          height="m"
          hasPrefix={<i className="ri-at-line text-big-darker"></i>}
          value={username}
          onChange={(e) => {
            const value = e.target.value;
            setUsername(value);
          }}
          // hasSuffix={
          //   <Flex minWidth={5}>
          //     <Kbd className="text-big-lighter">only once</Kbd>
          //   </Flex>
          // }
          error={username_conditions}
          errorMessage={username_messages}
        />
        <Input
          radius="none"
          id="input-2"
          label="Email"
          height="s"
          value={personalDetails.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
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
          ></MediaUpload>
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
              onClick={async () => {
                handleSave();
              }}
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

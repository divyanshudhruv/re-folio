import {
  Column,
  HeadingLink,
  Text,
  Input,
  Flex,
  Row,
  Button,
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
  });

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
  }, [id]); // Added dependency array to prevent repetitive rendering

  const handleSave = () => {
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

    updatePersonalDetails();
  };

  const handleChange = (field: string, value: string) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Column fillWidth fitHeight gap="16">
      <HeadingLink as="h6" id="intro">
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
        <Input
          radius="none"
          id="input-2"
          label="Email"
          height="s"
          value={personalDetails.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          radius="bottom"
          id="input-3"
          label="Expertise"
          height="s"
          value={personalDetails.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <Flex height={1}></Flex>
        <Row fillWidth horizontal="space-between" vertical="center">
          <Input
            id="input-4"
            label="Where are you from?"
            height="s"
            style={{ maxWidth: "200px" }}
            value={personalDetails.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

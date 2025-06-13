"use client";
import { supabase } from "@/app/lib/supabase";
import { Column, Flex, Text } from "@once-ui-system/core";
import { useRouter } from "next/navigation";
import { useEffect ,useState} from "react";
import NavSettings from "../../(components)/(settings)/NavSettings";
import "./../../../(main)/global.css";
import IntroSettings from "../../(components)/(settings)/IntroSettings";

export default function MePage() {
  
  return (
    <Column
      fillWidth
      style={{ minHeight: "100vh", backgroundColor: "#1A1A1A" }}
      background="surface"
      paddingY="l"
      horizontal="center"
      vertical="start"
    >
      <Column
        maxWidth={37.5}
        center
        fillWidth
        fitHeight
        className="body-container"
      >
        <NavSettings name="" descriptionWords={""} location="" /> <Space />
        <IntroSettings/>
      </Column>
    </Column>
  );
}

const Space = () => <Flex fillWidth height={2.5}></Flex>;

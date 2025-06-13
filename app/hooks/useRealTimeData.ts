// hooks/useRealTimeData.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useRealTimeSection = (username: string) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("refolio_sections")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "refolio_sections",
          filter: `username=eq.${username}`,
        },
        (payload) => {
          if (payload.new) {
            setData([payload.new]); // or handle merge logic
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  return data;
};

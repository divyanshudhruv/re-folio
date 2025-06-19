import { Column, Text, Switch } from "@once-ui-system/core";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function PublishPermission({ id }: { id: string }) {
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current publish state
    const fetchPublish = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("refolio_sections")
        .select("is_published")
        .eq("id", id)
        .single();
      if (!error && data) setIsPublished(!!data.is_published);
    };
    fetchPublish();
  }, [id]);

  const handlePublishToggle = async () => {
    setLoading(true);
    await supabase
      .from("refolio_sections")
      .update({ is_published: !isPublished })
      .eq("id", id);
    setIsPublished((prev) => !prev);
    setLoading(false);
  };

  return (
    <Column fillWidth fitHeight gap="16">
      <Text variant="heading-strong-xs" onBackground="neutral-medium">
        Publish your re-folio
      </Text>
      <Column gap="16">
        <Switch
          label="Do you want to publish this section?"
          description="Toggle to publish or unpublish this section."
          reverse
          isChecked={isPublished}
          onToggle={handlePublishToggle}
          disabled={loading}
        />
      </Column>
    </Column>
  );
}

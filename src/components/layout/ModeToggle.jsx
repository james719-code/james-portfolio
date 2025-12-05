"use client";

import { Switch } from "@/components/ui/switch";

export function ModeToggle({ isCreative, setIsCreative }) {
  return (
    <Switch
      checked={isCreative}
      onCheckedChange={() => setIsCreative(!isCreative)}
    />
  );
}

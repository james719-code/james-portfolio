"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Switch disabled />; // Or a skeleton
    }

    return (
        <Switch
            // Check resolvedTheme so the switch is accurate even if using "System" mode
            checked={resolvedTheme === "dark"}
            onCheckedChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />
    );
}
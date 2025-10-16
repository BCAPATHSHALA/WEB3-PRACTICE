"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center relative p-2 bg-primary text-primary-foreground dark:bg-[#1F1F23] rounded-full transition-colors"
    >
      <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all dark:hidden" />
      <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

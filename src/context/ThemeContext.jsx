// context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import changeSoundPath from "../assets/sounds/change.mp3";

const ThemeContext = createContext();
let themeWipeTimer;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [profileIndex, setProfileIndex] = useState(() => {
    const savedIndex = Number(localStorage.getItem("profileIndex"));
    return savedIndex === 1 || savedIndex === 2 ? savedIndex : 0;
  });

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);

    // Apply theme to document
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    window.clearTimeout(themeWipeTimer);
    root.classList.remove("theme-wipe", "theme-wipe-to-dark", "theme-wipe-to-light");
    void root.offsetWidth;

    root.classList.toggle("dark", newTheme === "dark");
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    root.classList.add(
      "theme-wipe",
      newTheme === "dark" ? "theme-wipe-to-dark" : "theme-wipe-to-light",
    );

    themeWipeTimer = window.setTimeout(() => {
      root.classList.remove("theme-wipe", "theme-wipe-to-dark", "theme-wipe-to-light");
    }, 750);
  };

  const cycleProfile = () => {
    const nextIndex = (profileIndex + 1) % 3;
    setProfileIndex(nextIndex);
    localStorage.setItem("profileIndex", String(nextIndex));
    try {
      const audio = new Audio(changeSoundPath);
      audio.volume = 0.5;
      void audio.play().catch(() => {});
    } catch {
      // Profile switching should still work if audio playback is unavailable.
    }
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    profileIndex,
    cycleProfile,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

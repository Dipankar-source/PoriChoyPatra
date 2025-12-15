// templates/utils/use-theme.js
// Simple light/dark theme hook using data-theme on <html>
import { useState, useEffect } from "react";

export function useTheme(defaultMode = "system") {
    // defaultMode: 'light' | 'dark' | 'system'
    const [mode, setMode] = useState(() => {
        try {
            const saved = localStorage.getItem("ishani-theme");
            return saved || defaultMode;
        } catch {
            return defaultMode;
        }
    });

    useEffect(() => {
        function apply(m) {
            const root = document.documentElement;
            if (m === "system") {
                const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                root.setAttribute("data-theme", isDark ? "dark" : "light");
            } else {
                root.setAttribute("data-theme", m);
            }
        }
        apply(mode);
        try {
            localStorage.setItem("ishani-theme", mode);
        } catch { }
    }, [mode]);

    return { mode, setMode };
}

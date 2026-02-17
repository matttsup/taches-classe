"use client";

import { useEffect, useState } from "react";
import { themes, type Theme } from "@/lib/themes";

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");

  useEffect(() => {
    const saved = localStorage.getItem("classe-theme") as Theme;
    if (saved && themes[saved]) {
      setCurrentTheme(saved);
      applyTheme(saved);
    }
  }, []);

  function changeTheme(theme: Theme) {
    setCurrentTheme(theme);
    localStorage.setItem("classe-theme", theme);
    applyTheme(theme);
  }

  function applyTheme(themeName: Theme) {
    const theme = themes[themeName];
    document.body.style.background = theme.gradient;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-base font-semibold text-gray-700">Thème :</span>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(themes) as Theme[]).map((themeKey) => {
          const theme = themes[themeKey];
          return (
            <button
              key={themeKey}
              onClick={() => changeTheme(themeKey)}
              className={`rounded-[10px] px-3 py-2 text-2xl transition-all ${
                currentTheme === themeKey
                  ? "scale-110 ring-2 ring-classe-purple"
                  : "opacity-60 hover:opacity-100"
              }`}
              title={theme.name}
            >
              {theme.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}

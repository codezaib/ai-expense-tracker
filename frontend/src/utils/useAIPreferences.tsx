import { useState, useEffect } from "react";

const KEY = "ai_preferences";

const defaults = {
  model: "",
  apiKey: "",
  systemPrompt: "",
};

export const useAIPreferences = () => {
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY);
      return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    } catch {
      return defaults;
    }
  });

  const updatePrefs = (updates: Partial<typeof defaults>) => {
    setPrefs((prev: any) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetPrefs = () => {
    localStorage.removeItem(KEY);
    setPrefs(defaults);
  };

  return { prefs, updatePrefs, resetPrefs };
};

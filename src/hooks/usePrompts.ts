import { useState, useEffect } from "react";
import { Prompt } from "@/types/prompt";
import { samplePrompts } from "@/data/samplePrompts";

const STORAGE_KEY = "prompt-hub-prompts";

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPrompts(JSON.parse(stored));
    } else {
      setPrompts(samplePrompts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePrompts));
    }
  }, []);

  const addPrompt = (newPrompt: Omit<Prompt, "id" | "createdAt">) => {
    const prompt: Prompt = {
      ...newPrompt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [prompt, ...prompts];
    setPrompts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getPromptById = (id: string) => {
    return prompts.find((p) => p.id === id);
  };

  return { prompts, addPrompt, getPromptById };
}

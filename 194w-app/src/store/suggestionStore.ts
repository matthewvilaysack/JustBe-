import { create } from "zustand";

type SuggestionStore = {
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
};

export const useSuggestionStore = create<SuggestionStore>((set) => ({
  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),
}));

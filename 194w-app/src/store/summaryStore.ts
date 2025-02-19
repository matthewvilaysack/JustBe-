import { create } from "zustand"; 

type KeywordStore = {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
};

export const useKeywordStore = create<KeywordStore>((set) => ({
  keywords: [],
  setKeywords: (keywords) => set({ keywords }),
}));

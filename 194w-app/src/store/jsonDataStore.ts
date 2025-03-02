import { create } from "zustand";

type JSONDataStore = {
  jsonData: unknown; // Allows any JSON structure
  setJSONData: (jsonData: unknown) => void;
};

export const useJSONDataStore = create<JSONDataStore>((set) => ({
  jsonData: null, // Start with `null` since it can be any JSON type
  setJSONData: (jsonData) => set({ jsonData }),
}));

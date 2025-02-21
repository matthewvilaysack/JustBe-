import { create } from "zustand";

type PainLevelStore = {
  painLevel: number;
  setPainLevel: (value: number) => void;
};

export const usePainLevelStore = create<PainLevelStore>((set) => ({
  painLevel: 0,
  setPainLevel: (value) => set({ painLevel: value }),
}));

import { create } from "zustand";

type UserPainStore = {
  painType: string;
  painDuration: string;
  setPainType: (type: string) => void;
  setPainDuration: (duration: string) => void;
  initializePainData: (type: string, duration: string) => void;
};

export const useUserPainStore = create<UserPainStore>((set) => ({
  painType: "",
  painDuration: "",

  setPainType: (type) => set({ painType: type }),
  setPainDuration: (duration) => set({ painDuration: duration }),

  initializePainData: (type, duration) => set({ 
    painType: type, 
    painDuration: duration 
  }),
}));

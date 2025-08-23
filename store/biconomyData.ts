// lib/store.ts
import { create } from "zustand";

type Store = {
  smartAccount: any | null;
  setSmartAccount: (smartAccount: any) => void;
  resetSmartAccount: () => void;
};

export const useSmartAccountStore = create<Store>((set) => ({
  smartAccount: null,
  setSmartAccount: (smartAccount) => set({ smartAccount }),
  resetSmartAccount: () => set({ smartAccount: null }),
}));

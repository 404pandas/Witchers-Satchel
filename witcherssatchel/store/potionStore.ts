import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PotionType = {
  id: string;
  name: string;
  stiringFrequencyDays: number;
  lastStirredAtTimestamp?: number;
};

type PotionsState = {
  nextId: number;
  potions: PotionType[];
  addPotion: (name: string, stiringFrequencyDays: number) => void;
  removePotion: (potionId: string) => void;
  stirPotion: (potionId: string) => void;
};

export const usePotionStore = create(
  persist<PotionsState>(
    (set) => ({
      potions: [],
      nextId: 1,
      addPotion: (name: string, stiringFrequencyDays: number) => {
        return set((state) => {
          return {
            ...state,
            nextId: state.nextId + 1,
            potions: [
              {
                id: String(state.nextId),
                name,
                stiringFrequencyDays,
              },
              ...state.potions,
            ],
          };
        });
      },
      removePotion: (potionId: string) => {
        return set((state) => {
          return {
            ...state,
            potions: state.potions.filter((potion) => potion.id !== potionId),
          };
        });
      },
      stirPotion: (potionId: string) => {
        return set((state) => {
          return {
            ...state,
            potions: state.potions.map((potion) => {
              if (potion.id === potionId) {
                return {
                  ...potion,
                  lastStirredAtTimestamp: Date.now(),
                };
              }
              return potion;
            }),
          };
        });
      },
    }),
    {
      name: "witchers-satchell-potions-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

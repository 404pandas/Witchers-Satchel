import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import { copyAsync } from "expo-file-system/legacy";

export type PotionType = {
  id: string;
  name: string;
  stiringFrequencyDays: number;
  lastStirredAtTimestamp?: number;
  imageUri?: string;
};

type PotionsState = {
  nextId: number;
  potions: PotionType[];
  addPotion: (
    name: string,
    stiringFrequencyDays: number,
    imageUri?: string
  ) => Promise<void>;
  removePotion: (potionId: string) => void;
  stirPotion: (potionId: string) => void;
};

export const usePotionStore = create(
  persist<PotionsState>(
    (set) => ({
      potions: [],
      nextId: 1,
      addPotion: async (
        name: string,
        stiringFrequencyDays: number,
        imageUri?: string
      ) => {
        const savedImageUri =
          FileSystem.Directory +
          `${new Date().getTime()}-${imageUri?.split("/").slice(-1)[0]}`;
        if (imageUri) {
          await copyAsync({
            from: imageUri,
            to: savedImageUri,
          });
        }
        set((state) => {
          return {
            ...state,
            nextId: state.nextId + 1,
            potions: [
              {
                id: String(state.nextId),
                name,
                stiringFrequencyDays,
                imageUri: imageUri ? savedImageUri : undefined,
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

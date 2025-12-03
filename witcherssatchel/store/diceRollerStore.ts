// /store/diceRollerStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

export type DiceSelection = {
  die: DieType;
  amount: number;
};

export type RollResult = {
  die: DieType;
  value: number;
};

type DiceState = {
  selectedDice: DiceSelection[]; // selections the user made
  results: RollResult[]; // array of rolled dice (one item per die)
  total: number;

  setSelectedDice: (dice: DiceSelection[]) => void;
  finalizeRoll: () => void; // perform random rolls and compute total
  clearResults: () => void;
};

const rollSingleDie = (die: DieType) => {
  const max = Number(die.replace("d", ""));
  return Math.floor(Math.random() * max) + 1;
};

export const useDiceStore = create(
  persist<DiceState>(
    (set, get) => ({
      selectedDice: [],
      results: [],
      total: 0,

      setSelectedDice: (dice) => {
        // normalize amounts (no negative)
        const normalized = dice.map((d) => ({
          die: d.die,
          amount: Math.max(0, Math.floor(d.amount || 0)),
        }));
        set({ selectedDice: normalized, results: [], total: 0 });
      },

      finalizeRoll: () => {
        const selections = get().selectedDice || [];
        const rolled: RollResult[] = [];

        selections.forEach((s) => {
          for (let i = 0; i < s.amount; i++) {
            rolled.push({ die: s.die, value: rollSingleDie(s.die) });
          }
        });

        const total = rolled.reduce((acc, r) => acc + r.value, 0);
        set({ results: rolled, total });
      },

      clearResults: () => set({ results: [], total: 0 }),
    }),
    {
      name: "dice-roller-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

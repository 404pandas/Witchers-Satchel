// /store/diceRollerStore.ts
import {
  DiceRecord,
  DieType,
  RollHistoryRecord,
  RollResult,
} from "@/types/diceTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type DiceState = {
  selectedDice: DiceRecord[];
  results: RollResult[];
  total: number;
  rollHistory: RollHistoryRecord[];

  setSelectedDice: (dice: DiceRecord[]) => void;
  finalizeRoll: () => void;
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
      rollHistory: [],

      setSelectedDice: (dice) => {
        const normalized = dice.map((d) => ({
          die: d.die,
          amount: Math.max(0, Math.floor(d.amount || 0)),
        }));
        set({ selectedDice: normalized, results: [], total: 0 });
      },

      finalizeRoll: () => {
        const selections = get().selectedDice || [];
        const rolled: RollResult[] = [];

        // roll dice
        selections.forEach((s) => {
          for (let i = 0; i < s.amount; i++) {
            rolled.push({ die: s.die, value: rollSingleDie(s.die) });
          }
        });

        const total = rolled.reduce((acc, r) => acc + r.value, 0);

        // build history entry
        const historyEntry = {
          id: Date.now(),
          expression: selections.map((s) => `${s.amount}${s.die}`).join(" + "),
          result: total,
          diceulatedAt: new Date().toISOString(),
        };

        set((state) => ({
          results: rolled,
          total,
          rollHistory: [...state.rollHistory, historyEntry],
        }));
      },

      clearResults: () => set({ results: [], total: 0 }),

      clearHistory: () => set({ rollHistory: [] }),
    }),
    {
      name: "dice-roller-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nanoid } from "nanoid/non-secure";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bestiary from "@/assets/beastiary.json";

/* -------------------------------- Types -------------------------------- */

export type ContractDifficulty = "Easy" | "Medium" | "Hard";

export type ContractStatus = "available" | "active" | "completed" | "failed";

export type SignType = "Aard" | "Igni" | "Quen" | "Yrden" | "Axii";

export type Contract = {
  id: string;
  monsterId: string;
  monsterName: string;
  location: string;
  difficulty: ContractDifficulty;
  reward: number;
  vulnerability: SignType;
  status: ContractStatus;

  acceptedAt?: number;
  completedAt?: number;
  expiresAt?: number;
};

/* -------------------------- Bestiary Types ------------------------------ */

type BestiaryBeast = {
  beastName: string;
  imageUrl: string;
  stats: {
    vitality: number;
    attack: number;
    defense: number;
    speed: number;
    intelligence: number;
  };
  signVulnerability: SignType;
  loot: string[];
};

const getRandomBeast = (): BestiaryBeast => {
  return randomItem(bestiary as BestiaryBeast[]);
};

/* ------------------------------ Store Shape ------------------------------ */

type ContractsState = {
  contracts: Contract[];

  /* Selectors */
  availableContracts: () => Contract[];
  activeContracts: () => Contract[];
  completedContracts: () => Contract[];

  /* Actions */
  generateContracts: (count?: number) => void;
  acceptContract: (id: string) => void;
  completeContract: (id: string) => void;
  failContract: (id: string) => void;
  clearExpiredContracts: () => void;
};

/* ------------------------- Helper Data / Logic --------------------------- */

const LOCATIONS = ["Velen", "Skellige", "Novigrad", "Toussaint", "Kaer Morhen"];

const SIGNS: SignType[] = ["Aard", "Igni", "Quen", "Yrden", "Axii"];

const difficultyConfig: Record<
  ContractDifficulty,
  { reward: number; durationMinutes?: number }
> = {
  Easy: { reward: 50 },
  Medium: { reward: 120, durationMinutes: 60 },
  Hard: { reward: 300, durationMinutes: 30 },
};

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomDifficulty = (): ContractDifficulty => {
  const roll = Math.random();
  if (roll < 0.5) return "Easy";
  if (roll < 0.8) return "Medium";
  return "Hard";
};

/* ------------------------------ Store ----------------------------------- */

export const useContractsStore = create<ContractsState>()(
  persist(
    (set, get) => ({
      contracts: [],

      /* ------------------------------ Selectors ------------------------------ */

      availableContracts: () =>
        get().contracts.filter((c) => c.status === "available"),

      activeContracts: () =>
        get().contracts.filter((c) => c.status === "active"),

      completedContracts: () =>
        get().contracts.filter(
          (c) => c.status === "completed" || c.status === "failed"
        ),

      /* ------------------------------ Actions ------------------------------- */

      generateContracts: (count = 3) => {
        const newContracts: Contract[] = Array.from({ length: count }).map(
          () => {
            const difficulty = randomDifficulty();
            const config = difficultyConfig[difficulty];

            const now = Date.now();
            const expiresAt = config.durationMinutes
              ? now + config.durationMinutes * 60 * 1000
              : undefined;

            const beast = getRandomBeast();

            return {
              id: nanoid(),
              monsterId: nanoid(),
              monsterName: beast.beastName,
              location: randomItem(LOCATIONS),
              difficulty,
              reward: config.reward,
              vulnerability: beast.signVulnerability,
              status: "available",
              expiresAt,
            };
          }
        );

        set((state) => ({
          contracts: [...newContracts, ...state.contracts],
        }));
      },

      acceptContract: (id) =>
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: "active",
                  acceptedAt: Date.now(),
                }
              : c
          ),
        })),

      completeContract: (id) =>
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: "completed",
                  completedAt: Date.now(),
                }
              : c
          ),
        })),

      failContract: (id) =>
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: "failed",
                  completedAt: Date.now(),
                }
              : c
          ),
        })),

      clearExpiredContracts: () => {
        const now = Date.now();

        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.status === "active" && c.expiresAt && c.expiresAt < now
              ? { ...c, status: "failed", completedAt: now }
              : c
          ),
        }));
      },
    }),
    {
      name: "contracts-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

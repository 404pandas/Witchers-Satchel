export interface DiceRecord {
  die: DieType;
  amount: number;
}

export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

export type RollResult = {
  die: DieType;
  value: number;
};

export type RollHistoryRecord = {
  id: number;
  expression: string;
  result: number;
  diceulatedAt: string;
};

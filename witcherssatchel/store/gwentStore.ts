import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type GwentCard = {
  id: {
    art: number;
    card: number;
    audio: number;
  };
  name: string;
  category?: string;
  attributes: {
    set: string;
    type: string;
    armor: number;
    color: string;
    power: number;
    rarity: string;
    faction: string;
    provision: number;
    artist?: string;
  };
  flavor?: string;
  ability?: string;
  ability_html?: string;
  keyword_html?: string;
};

type GwentState = {
  cards: GwentCard[];
  loading: boolean;
  error?: string;
  fetchCards: () => Promise<void>;
};

export const useGwentStore = create(
  persist<GwentState>(
    (set, get) => ({
      cards: [],
      loading: false,
      error: undefined,

      fetchCards: async () => {
        if (get().cards.length > 0) return;

        try {
          set({ loading: true });

          const url =
            "https://api.gwent.one/?key=data&language=en&response=json&html=info.art.keywords.";

          const res = await fetch(url);
          const json = await res.json();

          // Normalization step:
          // Convert the keyed object (0,1,2...) into an array
          const obj = json.response;
          const cardsArray: GwentCard[] = Object.values(obj);

          set({
            cards: cardsArray,
            loading: false,
          });
        } catch (err: any) {
          set({
            error: err.message,
            loading: false,
          });
        }
      },
    }),
    {
      name: "gwent-cache",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

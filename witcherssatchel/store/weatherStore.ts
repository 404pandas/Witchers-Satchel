import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_OPEN_WEATHER_API_KEY } from "@env";
import { WeatherType } from "@/types/weatherTypes";

const API_KEY = EXPO_PUBLIC_OPEN_WEATHER_API_KEY;

// Shape of each weather entry stored in history
export type StoredWeather = WeatherType & {
  id: string;
  lastUpdatedAt: number;
};

type WeatherStore = {
  // latest fetched weather (single item)
  weather: StoredWeather | null;

  // history of all previous fetches
  currentWeather: StoredWeather[];

  loading: boolean;
  error: string | null;

  fetchWeather: (lat: number, lon: number) => Promise<void>;
  removeWeather: (id: string) => void;
  clearWeatherHistory: () => void;
};

export const useWeatherStore = create(
  persist<WeatherStore>(
    (set, get) => ({
      weather: null,
      currentWeather: [],
      loading: false,
      error: null,

      fetchWeather: async (lat, lon) => {
        try {
          set({ loading: true, error: null });

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
          );

          if (!response.ok) throw new Error("Failed to fetch weather data");

          const data: WeatherType = await response.json();

          console.log(data);

          const weatherWithId: StoredWeather = {
            ...data,
            id: Date.now().toString(),
            lastUpdatedAt: Date.now(),
          };

          // Update both the "current" weather and history list
          set((state) => ({
            weather: weatherWithId,
            currentWeather: [weatherWithId, ...state.currentWeather],
            loading: false,
          }));
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      removeWeather: (id: string) => {
        set((state) => ({
          currentWeather: state.currentWeather.filter((w) => w.id !== id),
        }));
      },

      clearWeatherHistory: () => {
        set({ currentWeather: [] });
      },
    }),
    {
      name: "witchers-satchel-weather-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

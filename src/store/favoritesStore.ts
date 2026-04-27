"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  favoriteCodes: string[];
  showFavoritesOnly: boolean;
  toggleFavorite: (productCode: string) => void;
  setShowFavoritesOnly: (showFavoritesOnly: boolean) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteCodes: [],
      showFavoritesOnly: false,
      toggleFavorite: (productCode) =>
        set((state) => ({
          favoriteCodes: state.favoriteCodes.includes(productCode)
            ? state.favoriteCodes.filter((code) => code !== productCode)
            : [...state.favoriteCodes, productCode],
        })),
      setShowFavoritesOnly: (showFavoritesOnly) => set({ showFavoritesOnly }),
    }),
    {
      name: "innovation_favorite_products",
      partialize: (state) => ({
        favoriteCodes: state.favoriteCodes,
      }),
    },
  ),
);

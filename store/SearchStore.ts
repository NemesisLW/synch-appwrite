import { create } from "zustand";

interface SearchState {
  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchString: "",
  setSearchString(searchString) {
    set({ searchString });
  },
}));

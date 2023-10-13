import { createContext } from "react";
import { Feed, FeedWithEpisodes, Item } from "../interfaces/responses";

interface ContextProps {
  favoritePodcasts: Feed[];
  addFavorite: (feeds: Feed) => void;
  removeFavorite: (feeds: Feed) => void;
  selectPodcast: (feed: FeedWithEpisodes) => void;
  selectedPodcast: FeedWithEpisodes | null;
  updateEpisodes: (items: Item[]) => void;
}

export const PodcastContext = createContext({} as ContextProps);

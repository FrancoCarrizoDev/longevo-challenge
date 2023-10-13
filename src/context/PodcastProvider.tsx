import { FC, useReducer } from "react";
import { PodcastContext, podcastReducer } from ".";
import { Feed, FeedWithEpisodes, Item } from "../interfaces/responses";

export interface PodcastProviderProps {
  favoritePodcasts: Feed[];
  selectedPodcast: FeedWithEpisodes | null;
}

const favoritePodcast: PodcastProviderProps = {
  favoritePodcasts: [],
  selectedPodcast: null,
};

type Props = { children: React.ReactNode };

export const PodcastProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(podcastReducer, favoritePodcast);

  const addFavorite = (feed: Feed) => {
    dispatch({
      type: "[Favorites] - Save",
      payload: feed,
    });
  };

  const removeFavorite = (feed: Feed) => {
    dispatch({
      type: "[Favorites] - Delete",
      payload: feed,
    });
  };

  const selectPodcast = (feed: FeedWithEpisodes) => {
    dispatch({
      type: "[Podcast] - Selected",
      payload: feed,
    });
  };

  const updateEpisodes = (items: Item[]) => {
    dispatch({
      type: "[Podcast] - Update Episodes",
      payload: items,
    });
  };

  return (
    <PodcastContext.Provider
      value={{
        ...state,
        addFavorite,
        removeFavorite,
        selectPodcast,
        updateEpisodes,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
};

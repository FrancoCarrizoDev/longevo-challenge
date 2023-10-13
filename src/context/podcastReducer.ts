import { PodcastProviderProps } from ".";
import { Feed, FeedWithEpisodes, Item } from "../interfaces/responses";
type NameActionType =
  | {
      type: "[Favorites] - Save";
      payload: Feed;
    }
  | { type: "[Favorites] - Delete"; payload: Feed }
  | { type: "[Podcast] - Selected"; payload: FeedWithEpisodes }
  | { type: "[Podcast] - Update Episodes"; payload: Item[] };

export const podcastReducer = (
  state: PodcastProviderProps,
  action: NameActionType
): PodcastProviderProps => {
  switch (action.type) {
    case "[Favorites] - Save":
      return {
        ...state,
        favoritePodcasts: [...state.favoritePodcasts, action.payload],
      };
    case "[Favorites] - Delete":
      return {
        ...state,
        favoritePodcasts: state.favoritePodcasts.filter(
          (feed) => feed.id !== action.payload.id
        ),
      };
    case "[Podcast] - Selected":
      return {
        ...state,
        selectedPodcast: action.payload,
      };
    case "[Podcast] - Update Episodes":
      return {
        ...state,
        selectedPodcast: {
          ...state.selectedPodcast!,
          episodes: action.payload || [],
        },
      };
    default:
      return state;
  }
};

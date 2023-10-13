export interface TrendingPodcastResponse {
  status: string;
  feeds: Feed[];
  count: number;
  max: null;
  since: number;
  description: string;
}

export interface Feed {
  id: number;
  url: string;
  title: string;
  description: string;
  author: string;
  image: string;
  artwork: string;
  newestItemPublishTime: number;
  itunesID: number | null;
  trendScore: number;
  language: string;
  categories: { [key: string]: string };
}

export interface FeedWithEpisodes extends Feed {
  episodes: Item[];
  isFavorite: boolean;
}

export interface EdpisodesByFeedResponse {
  status: string;
  liveItems: any[];
  items: Item[];
  count: number;
  query: string;
  description: string;
}

export interface Item {
  id: number;
  title: string;
  link: string;
  description: string;
  guid: string;
  datePublished: number;
  datePublishedPretty: string;
  dateCrawled: number;
  enclosureUrl: string;
  enclosureType: EnclosureType;
  enclosureLength: number;
  duration: number;
  explicit: number;
  episode: number;
  episodeType: EpisodeType;
  season: number;
  image: string;
  feedItunesID: number;
  feedImage: string;
  feedID: number;
  feedLanguage: FeedLanguage;
  feedDead: number;
  feedDuplicateOf: null;
  chaptersURL: null;
  transcriptURL: string;
  transcripts: Transcript[];
  socialInteract?: SocialInteract[];
}

export enum EnclosureType {
  AudioMPEG = "audio/mpeg",
}

export enum EpisodeType {
  Full = "full",
}

export enum FeedLanguage {
  En = "en",
}

export interface SocialInteract {
  uri: string;
  protocol: string;
  accountID: string;
  accountURL: string;
  priority: number;
}

export interface Transcript {
  url: string;
  type: Type;
}

export enum Type {
  ApplicationJSON = "application/json",
  ApplicationSrt = "application/srt",
  TextVtt = "text/vtt",
}

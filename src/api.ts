import sha1 from "crypto-js/sha1";
import enc from "crypto-js/enc-hex";

const baseUrl = "https://api.podcastindex.org/api/1.0";
const authKey = "BSF8RLDX4MB7XVEQKR3D";
const secretKey = "WVf3ENMTwZcS8d#vwxcv3tubJKwxUzxhupuyU8h3";

const apiHeaderTime = new Date().getTime() / 1000;
const hash = sha1(authKey + secretKey + apiHeaderTime).toString(enc);

const headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("X-Auth-Key", authKey);
headers.append("X-Auth-Date", apiHeaderTime + "");
headers.append("Authorization", hash);

export const getTrending = ({ maxResults = 10 }: { maxResults: number }) =>
  fetch(`${baseUrl}/podcasts/trending?max=${maxResults}`, { headers });

export const getEpisodesByFeed = (feedId: number, maxResults = 10) => {
  return fetch(`${baseUrl}/episodes/byfeedid?id=${feedId}&max=${maxResults}`, {
    headers,
  });
};

export const searchPodcasts = (query: string, maxResults = 10) => {
  return fetch(
    `${baseUrl}/search/byterm?q=${encodeURIComponent(query)}&max=${maxResults}`,
    {
      headers,
    }
  );
};

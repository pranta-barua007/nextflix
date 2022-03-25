import videoMockData from "../data/videos.json";
import { getWatchedVideos, getMyListVideos } from "./db/hasura";

const fethVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "https://youtube.googleapis.com/youtube/v3";

  const response = await fetch(
    `${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
  );
  return await response.json();
};

export const getCommonVideos = async (url) => {
  const isDev = process.env.DEVELOPMENT;
  try {
    const videoData = isDev ? videoMockData : await fethVideos(url);

    if (videoData?.error) {
      console.error("Youtube API error", videoData.error);
      return [];
    }

    return videoData.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        id: id,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        title: snippet?.title,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        viewCount: item.statistics ? item.statistics.viewCount : 0,
      };
    });
  } catch (err) {
    console.error("Something went wrong fetching videos", err);
    return [];
  }
};

export const getVideos = async (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = (regionCode = "US") => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=${regionCode}`;
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || []
  );
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || []
  );
};

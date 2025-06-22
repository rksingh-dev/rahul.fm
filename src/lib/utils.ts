import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Track } from "@/pages/Index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const YOUTUBE_API_KEYS = [
  'AIzaSyAecTrwCptOUDUtfcKd4_EEec92tts3jxU',
  'AIzaSyDlNlMEHHOU1TlB_frHBvhJlI24d92pzUU',
];

export async function fetchRecommendedTracks(videoId: string): Promise<Track[]> {
  let data = null;
  let success = false;
  for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
    const key = YOUTUBE_API_KEYS[i];
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&relatedToVideoId=${videoId}&type=video&key=${key}`
    );
    if (response.status === 403) {
      continue;
    }
    data = await response.json();
    success = true;
    break;
  }
  if (success && data && data.items) {
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title.replace(/[^\u0000-\u007F]+/g, ''),
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      duration: '3:45',
      videoId: item.id.videoId,
    }));
  }
  return [];
}

export async function fetchRecommendedTracksBySearch(title: string, artist: string): Promise<Track[]> {
  let data = null;
  let success = false;
  const query = `${title} ${artist} music`;
  for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
    const key = YOUTUBE_API_KEYS[i];
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${key}`
    );
    if (response.status === 403) {
      continue;
    }
    data = await response.json();
    success = true;
    break;
  }
  if (success && data && data.items) {
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title.replace(/[^\u0000-\u007F]+/g, ''),
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      duration: '3:45',
      videoId: item.id.videoId,
    }));
  }
  return [];
}

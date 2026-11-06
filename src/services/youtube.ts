import type { TrackDetails } from "../types/track"

let API = "https://youtube.googleapis.com/youtube/v3/";
let KEY = import.meta.env.VITE_YOUTUBE_API_KEY;


interface VideoListResponse {
    items: {
        snippet: {
            title: string,
            channelTitle: string,
            tags: string[]
        },
        kind: string
    }[],
    kind: string
}

interface SearchResponse {
    items: {
        id: {
            videoId: string
        }
    }[],
    kind: string
}

export async function getVideoDetails(videoId: string): Promise<TrackDetails | null> {
    const params = new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: KEY,
    });

    const response = await fetch(`${API}videos?${params}`)
    if (!response.ok) return null
    
    const videoList = await response.json() as VideoListResponse
    const snippet = videoList.items[0]?.snippet

    return {
        artist: snippet.tags[0],
        album: snippet.tags[1],
        // album: snippet.tags.length > 2 ? snippet.tags[1] : "",
        track: snippet.tags[snippet.tags.length > 2 ? 2 : 1]
    }
}


export async function search(query: { artist: string, album: string, track: string }) {
    const params = new URLSearchParams({
        part: "snippet",
        q: `${query.track} ${query.artist} ${query.album}`,
        maxResults: "1",
        key: KEY,
    });

    const response = await fetch(`${API}search?${params}`)
    if (!response.ok) return null

    const responseData = await response.json() as SearchResponse
    const videoId = responseData.items[0]?.id.videoId
    
    return `https://music.youtube.com/watch?v=${videoId}`
}

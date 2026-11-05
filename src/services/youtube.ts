import type { TrackDetails } from "../types/track"

let API = "https://youtube.googleapis.com/youtube/v3/";
let KEY = import.meta.env.VITE_YOUTUBE_API_KEY;


interface VideoListResponse {
    items: VideoListResponseItem[],
    kind: string
}

interface VideoListResponseItem {
    snippet: VideoListResponseItemSnippet
    kind: string
}

interface VideoListResponseItemSnippet {
    title: string,
    channelTitle: string
    tags: string[]
}

// https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc&key=AIzaSyAA1PTL6ioqlBUylfdXwD4GhSOF1npcdxU
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
    
    // await fetch(`${API}videos?${params}`).then(async results => {
    //     const videoList : VideoListResponse = await results.json() as unknown as VideoListResponse;
    //     const snippet : VideoListResponseItemSnippet = videoList.items[0].snippet;
    //     console.log("snippet", snippet);
    //     return snippet
    // }).catch(err => {
    //     console.log("err", err)
    //     return null
    // })
}



// https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=YOUR_API_KEY
   //  &part=snippet,contentDetails,statistics,status
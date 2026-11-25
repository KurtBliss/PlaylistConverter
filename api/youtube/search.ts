import { findTrackDetails } from "../_lib/google.ts";

interface SearchResponse {
    items: {
        id: {
            videoId: string
        },
        snippet: {
            title: string,
            channelTitle: string,
            tags: string[]
        },
    }[],
    kind: string
}

export default { async fetch(request: Request) {
    const { searchParams } = new URL(request.url);
    let searchedArtist = clean(searchParams.get("artist"));
    // let searchedAlbum = clean(searchParams.get("album"));
    let searchedTrack = clean(searchParams.get("track"));

    const q = [searchedTrack, searchedArtist]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");

    const params = new URLSearchParams({
        part: "snippet",
        q: decodeURIComponent(q),
        type: "video",
        maxResults: "1",
        safeSearch: "none",
        key: process.env.VERCEL_YOUTUBE_API_KEY as string,
    });

    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?${params}`);
    if (!response.ok) {
        return Response.json({ ok: false, error: "Failed to search YouTube" });
    }
    const data = await response.json() as SearchResponse
    if (!data.items || data.items.length === 0) {
        return Response.json({ ok: false, error: "No results found" });
    }
    const videoId = data.items[0].id.videoId;
    const snippet = data.items[0].snippet;
    const trackDetails = findTrackDetails(snippet.title, snippet.channelTitle, snippet.tags);

    return Response.json({ 
        ok: true ,
        url: `https://music.youtube.com/watch?v=${videoId}`,
        videoId,
        foundTrack: trackDetails.foundTrack,
        foundArtist: trackDetails.foundArtist,
        foundAlbum: trackDetails.foundAlbum,
    });
}}

function clean(value: string | null) {
  if (!value) return "";
  return value.replace(/\+/g, " ").replace(/\s+/g, " ").trim();
}
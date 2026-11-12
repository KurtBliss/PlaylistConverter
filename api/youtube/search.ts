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

export default {
    async fetch(request: Request) {
        const { searchParams } = new URL(request.url);
        let searchedArtist = searchParams.get("artist");
        let searchedAlbum = searchParams.get("album");
        let searchedTrack = searchParams.get("track");

        const params = new URLSearchParams({
            part: "snippet",
            q: `${searchedTrack} ${searchedArtist} ${searchedAlbum}`,
            maxResults: "1",
            key: process.env.VERCEL_YOUTUBE_API_KEY as string,
        });

        console.log("internal youtube api params", params.toString());

        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?${params}`);
        if (!response.ok) {
            return Response.json({ ok: false, error: "Failed to search YouTube" });
        }
        const data = await response.json() as SearchResponse
        const videoId = data.items[0].id.videoId;
        console.log("internal youtube api got videoId", videoId);

        const snippet = data.items[0].snippet;
        console.log('snippet:', snippet);

        const trackDetails = findTrackDetails(snippet.title, snippet.channelTitle, snippet.tags);

        return Response.json({ 
            ok: true ,
            url: `https://music.youtube.com/watch?v=${videoId}`,
            videoId,
            searchedTrack,
            searchedArtist,
            searchedAlbum,
            foundTrack: trackDetails.foundTrack,
            foundArtist: trackDetails.foundArtist,
            foundAlbum: trackDetails.foundAlbum,
        });
    }
}
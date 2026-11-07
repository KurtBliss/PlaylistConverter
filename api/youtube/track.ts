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

export default {
    async fetch(request: Request) {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get("videoId");
        console.log("internal youtube api got videoId", videoId);
        if (!videoId) {
            return Response.json({ ok: false, error: "videoId is required" });
        }

        const params = new URLSearchParams({
            part: "snippet,contentDetails,statistics",
            id: videoId,
            key: process.env.YOUTUBE_API_KEY as string,
        });
        console.log("internal youtube api params", params.toString());
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?${params}`);
        if (!response.ok) {
            return Response.json({ ok: false, error: "Failed to fetch track from YouTube" });
        }
        const data = await response.json() as VideoListResponse;
        const snippet = data.items[0].snippet;

        return Response.json({ 
            ok: true, 
            artist: snippet.tags[0],
            album: snippet.tags[1],
            track: snippet.tags[snippet.tags.length > 2 ? 2 : 1]
        });
    }
}
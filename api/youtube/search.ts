interface SearchResponse {
    items: {
        id: {
            videoId: string
        }
    }[],
    kind: string
}

export default {
    async fetch(request: Request) {
        const { searchParams } = new URL(request.url);
        const artist = searchParams.get("artist");
        const album = searchParams.get("album");
        const track = searchParams.get("track");

        const params = new URLSearchParams({
            part: "snippet",
            q: `${track} ${artist} ${album}`,
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

        return Response.json({ 
            ok: true ,
            url: `https://music.youtube.com/watch?v=${videoId}`
        });
    }
}
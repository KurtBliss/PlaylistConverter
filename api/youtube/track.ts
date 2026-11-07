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

function cleanTitle(title: string): string {
  return title
    .replace(/\(.*?\)|\[.*?\]/g, "")          // remove (Lyric Video), [Official Video], etc.
    .replace(/official|lyric|video|audio|hq|hd/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanChannel(channel: string): string {
  return channel
    .replace(/VEVO|Official|Music|Topic/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function removeArtistFromTitle(title: string, artist: string): string {
  const regex = new RegExp(`^${artist}\\s*[-–—:]\\s*`, "i");
  return title.replace(regex, "").trim();
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
            key: process.env.VERCEL_YOUTUBE_API_KEY as string,
        });
        console.log("internal youtube api params", params.toString());
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?${params}`);
        if (!response.ok) {
            return Response.json({ ok: false, error: "Failed to fetch track from YouTube" });
        }
        const data = await response.json() as VideoListResponse;
        const snippet = data.items[0].snippet;

        console.log('snippet:', snippet);
        
        let artist = "";
        let album = "";
        let track = "";
        
        if (snippet.tags.length == 3) {
            artist = snippet.tags[0];
            album = snippet.tags[1];
            track = snippet.tags[2];
        } else if (snippet.tags.length == 2) {
            artist = snippet.tags[0];
            track = snippet.tags[1];
        } else {
            artist = cleanChannel(snippet.channelTitle);
            track = cleanTitle(snippet.title);
            track = removeArtistFromTitle(track, artist);
        }

        return Response.json({ 
            ok: true, 
            artist,
            album,
            track
        });
    }
}
import { getSpotifyToken } from "../_lib/spotify.ts"

interface SearchResponse {
    tracks: {
        items: {
            name: string,
            id: string,
            artists: {
                name: string,
                id: string
            }[],
            album: {
                name: string,
                id: string
            }
        }[]
    }
}

export default { async fetch(request: Request) {
    const { access_token } = await getSpotifyToken() as { access_token: string };
    if (typeof access_token != "string") {
        return Response.json({ error: "Failed to retrieve Spotify token" });
    }

    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");
    const track = searchParams.get("track");

    const params = new URLSearchParams({
        q: `${track} artist:${artist} ${album != "" ? `album:${album}` : ""}`,
        type: "track",
        limit: "1"
    });

    const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })
    if (!response.ok) {
        return Response.json({ok: false, error: "Failed to fetch track from Spotify"});
    }

    const data = await response.json() as SearchResponse;
    const trackData = data.tracks.items[0];
    const url = `https://open.spotify.com/track/${trackData.id}`

    return Response.json({ok: true, 
        url, 
        id: trackData.id,
        track: trackData.name, 
        artist: trackData.artists[0].name,
        album: trackData.album.name
    });
}}


// https://developer.spotify.com/documentation/web-api/reference/search

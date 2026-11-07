import { getSpotifyToken } from "../_lib/spotify.ts"

type SearchResponse = {
    tracks: Tracks
}

type Tracks = {
    items: Track[]
}

type Track = {
    name: string,
    id: string,
    artists: Artist[],
    album: Album
}

type Artist = {
    name: string,
    id: string
}

type Album = {
    name: string,
    id: string
}

export default {
  async fetch(request: Request) {
    const { access_token } = await getSpotifyToken() as { access_token: string };
    if (typeof access_token != "string") {
        return Response.json({ error: "Failed to retrieve Spotify token" });
    }

    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");
    const track = searchParams.get("track");

    const params = new URLSearchParams({
        q: `${track} artist:${artist} album:${album}`,
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
    const spotifyTrack = data.tracks.items[0];
    console.log('spotifyTrack:', spotifyTrack);
    const spotifyUrl = `https://open.spotify.com/track/${spotifyTrack.id}`
    return Response.json({ok: true, 
        spotifyUrl, 
        track: spotifyTrack.name, 
        artist: spotifyTrack.artists[0].name,
        album: spotifyTrack.album.name
    });
  },
};


// https://developer.spotify.com/documentation/web-api/reference/search

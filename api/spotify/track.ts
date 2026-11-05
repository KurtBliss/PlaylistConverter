import { getSpotifyToken } from "../_lib/spotify"

type SearchResponse = {
    tracks: Tracks
}

type Tracks = {
    items: Track[]
}

type Track = {
    name: string,
    id: string
}

export default {
  async fetch(request: Request) {
    console.log("Received request for Spotify track search");
    const { access_token } = await getSpotifyToken();
    if (typeof access_token != "string") {
        return Response.json({ error: "Failed to retrieve Spotify token" });
    }
    console.log("Spotify access token:", access_token);
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");
    const track = searchParams.get("track");
    const params = new URLSearchParams({
        q: `${track} artist:${artist}`,
        type: "track",
        limit: "1"
    });
    console.log("Spotify search params:", params);
    await fetch(`https://api.spotify.com/v1/search?${params}`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then(async (response) => {
        console.log("Spotify search response:", response);
        const data = await response.json() as SearchResponse;
        console.log("Spotify search results:", data.tracks.items[0]);
        console.log(`Spotify track URL: https://open.spotify.com/track/${data.tracks.items[0].id}`);
        // return Response.json(data);
    });
    // https://developer.spotify.com/documentation/web-api/reference/search
    return Response.json({ ok: true });
  },
};


/*

curl --request GET \
  --url 'https://api.spotify.com/v1/search?q=badflower&type=artist%2Calbum%2Ctrack' \
  --header 'Authorization: Bearer BQC7wps7n7yBovDGBSlBSQ1tPVg5iBST-Fc7ULPUY1dO-5P71MUzyvxWXrDFhsj5-_0JNqLNFSA7XMlANtWjwJ0yiBGZLHfob6_ZKD1EKjbwptlH-CO4fNpfrDU5pUlHAeB6I94P9oBO'


*/
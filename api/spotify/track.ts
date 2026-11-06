import { getSpotifyToken } from "../_lib/spotify";

type TrackResponse = {
    album: {
        name: string;
    };
    artists: {
        name: string;
    }[];
    name: string;
}

export default {
    async fetch(request: Request) {
        const { access_token } = await getSpotifyToken();
        if (typeof access_token != "string") {
            return Response.json({ error: "Failed to retrieve Spotify token" });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return Response.json({ error: "Missing track ID" });
        }

        const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!response.ok) {
            return Response.json({ ok: false,error: "Failed to retrieve track" });
        }

        const data = await response.json();
        // console.log("Retrieved track data:", data);



        return Response.json({ ok: true,
            album: data.album.name,
            artist: data.artists[0].name,
            track: data.name,
         });
    }
}


















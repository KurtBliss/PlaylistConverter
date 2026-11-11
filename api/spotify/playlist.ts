import { getSpotifyToken } from "../_lib/spotify.ts";

interface SpotifyPlaylist {
    id: string;
    name: string;
    description?: string;
    tracks: {
        items: {
            track: {
                id: string;
                name: string;
                artists: {
                    name: string;
                }[];
                album: {
                    name: string;
                };
            };
        }[];
    };
}

export default {
    async fetch(request: Request) {
        const { access_token } = await getSpotifyToken() as { access_token: string };
        if (typeof access_token != "string") {
            return Response.json({ ok: false, error: "Failed to retrieve Spotify token" });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return Response.json({ ok: false, error: "Missing playlist ID" });
        }

        const playlistRes = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        if (!playlistRes.ok) {
            return Response.json({ ok: false, error: "Failed to retrieve Spotify playlist" });
        }
        const playlistData = await playlistRes.json() as SpotifyPlaylist;
        console.log('playlistData:', playlistData.tracks.items);
        const tracks = playlistData.tracks.items

        return Response.json({ok: true, tracks: tracks.map(({ track }) => ({
            id: track.id,
            track: track.name,
            album: track.album.name,
            artists: track.artists[0].name
        }))});
    }
}
import { useState } from "react"
import { parseTrackUrl, type ParsedTrack } from "../utils/urlParser"
import { type ConversionResult, type TrackInfo, type PlaylistInfo } from "../../shared/conversion"

export function useTrackSearch() {
    const [url, setUrl] = useState("")
    const [result, setResult] = useState<ConversionResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function search(url: string) {
        setLoading(true)
        setError(null)

        const parsed = parseTrackUrl(url)
        if (!parsed) {
            setError("Could not parse url")
            setLoading(false)
            return
        }

        try {
            if (parsed.platform == "youtube" && parsed.type == "track") {
                // get track details from youtube
                await convertYoutubeTrack(parsed);
            } else if (parsed.platform == "spotify" && parsed.type == "track") {
                // get track details from spotify
                await convertSpotifyTrack(parsed);
            } else if (parsed.platform == "spotify" && parsed.type == "playlist") {
                // TODO: check if the playlist is public or private?
                // TODO: check for user authentication?
                await convertSpotifyPlaylist(parsed);
            }
        } catch (error) {
            console.error("Failed to search track:", error)
            setError("Failed to search track")
        } finally {
            setLoading(false)
        }
    }
    
    async function convertYoutubeTrack(parsed: ParsedTrack) {
        const youtubeRes = await fetch(`/api/youtube/track?videoId=${parsed.id}`);
        if (!youtubeRes.ok) throw new Error("Failed to retrieve YouTube track when getting spotify url");
        const youtubeData = await youtubeRes.json();

        // search spotify with youtube track details
        const params = new URLSearchParams({
            artist: youtubeData.foundArtist ?? "",
            album: youtubeData.foundAlbum ?? "",
            track: youtubeData.foundTrack ?? ""
        });

        const spotifyRes = await fetch(`/api/spotify/search?${params}`);
        if (!spotifyRes.ok) throw new Error("Failed to retrieve Spotify track when getting spotify url");
        const spotifyData = await spotifyRes.json();

        setResult(prev => [{
            type: "track",
            id: crypto.randomUUID(),
            input: {
                platform: parsed.platform,
                artist: youtubeData.foundArtist ?? "",
                album: youtubeData.foundAlbum ?? "",
                track: youtubeData.foundTrack ?? "",
                url: parsed.raw,
                trackId: parsed.id,
                success: youtubeData.ok,
                error: youtubeData.error ?? null
            },
            output: {
                platform: "spotify",
                artist: spotifyData.artist ?? "",
                album: spotifyData.album ?? "",
                track: spotifyData.track ?? "",
                url: spotifyData.url ?? "",
                success: spotifyData.ok,
                error: spotifyData.error ?? null
            }
        }, ...prev]);
    }

    async function convertSpotifyTrack(parsed: ParsedTrack) {
        const spotifyRes = await fetch(`/api/spotify/track?id=${parsed.id}`);
        if (!spotifyRes.ok) throw new Error("Failed to retrieve Spotify track when getting youtube url");
        const spotifyData = await spotifyRes.json();

        // search youtube with spotify track details
        const params = new URLSearchParams({
            artist: spotifyData.artist ?? "",
            album: "", //spotifyData.album,
            track: spotifyData.track ?? ""
        });

        const youtubeRes = await fetch(`/api/youtube/search?${params}`);
        if (!youtubeRes.ok) throw new Error("Failed to retrieve YouTube track when getting youtube url");
        const youtubeData = await youtubeRes.json();
        if (!youtubeData.ok) throw new Error(youtubeData.error);

        setResult(prev => [{
            type: "track",
            id: crypto.randomUUID(),
            input: {
                platform: parsed.platform,
                artist: spotifyData.artist ?? "",
                album: spotifyData.album ?? "",
                track: spotifyData.track ?? "",
                url: parsed.raw,
                trackId: parsed.id,
                success: spotifyData.ok,
                error: spotifyData.error ?? null
            },
            output: {
                platform: "youtube",
                artist: youtubeData.foundArtist ?? "",
                album: youtubeData.foundAlbum ?? "",
                track: youtubeData.foundTrack ?? "",
                url: youtubeData.url ?? "",
                videoId: youtubeData.videoId ?? "",
                success: youtubeData.ok && youtubeData.videoId ? true : false,
                error: youtubeData.error ?? null
            }
        }, ...prev]);
    }

    async function convertSpotifyPlaylist(parsed: ParsedTrack) {

        const pendingId = crypto.randomUUID()

        const spotifyRes = await fetch(`/api/spotify/playlist?id=${parsed.id}`);
        if (!spotifyRes.ok) throw new Error("Failed to retrieve Spotify playlist");
        const spotifyData = await spotifyRes.json();
        const spotifyDataTracks : {
            id: string,
            track: string,
            album: string,
            artist: string,
            url: string
        }[] = spotifyData.tracks

        setResult(prev => [{
            type: "playlist",
            id: pendingId,
            input: {
                platform: parsed.platform,
                title: spotifyData.title ?? "",
                url: parsed.raw,
                playlistId: parsed.id,
                success: true
            },
            tracks: spotifyDataTracks.map((t): { input: TrackInfo; output?: TrackInfo } => {
                return {
                    input: {
                        platform: "spotify",
                        trackId: t.id,
                        artist: t.artist,
                        album: t.album,
                        track: t.track,
                        url: t.url,
                        success: true
                    }
                }
            })
        }, ...prev]);
        

        // search youtube with spotify playlist tracks
        const youtubeResults = [];
        for (const track of spotifyDataTracks) {
            const params = new URLSearchParams({
                artist: track.artist ?? "",
                album: track.album ?? "",
                track: track.track ?? ""
            });

            const youtubeRes = await fetch(`/api/youtube/search?${params}`);
            if (!youtubeRes.ok) throw new Error("Failed to retrieve YouTube track");
            const youtubeData : {
                ok: boolean,
                url: string,
                videoId: string,
                foundTrack: string,
                foundArtist: string,
                foundAlbum: string
            } = await youtubeRes.json();
            youtubeResults.push(youtubeData);

            setResult(prev => prev.map(r => {
                if (r.type !== "playlist" || r.id !== pendingId ) return r
                return {
                    ...r,
                    tracks: r.tracks?.map(t => {
                        if (t.input.trackId == track.id) {
                            return {
                                input: t.input,
                                output: {
                                    platform: "youtube",
                                    artist: youtubeData.foundArtist,
                                    album: youtubeData.foundAlbum,
                                    track: youtubeData.foundTrack,
                                    url: youtubeData.url,
                                    videoId: youtubeData.videoId,
                                    success: youtubeData.ok
                                }
                            }
                        }
                        return t
                    })
                }
            }))
        }
        console.log('youtubeResults:', youtubeResults);

        // create YouTube playlist
        const createRes = await fetch("/api/youtube/create-playlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Converted Spotify Playlist"
            }),
        });
        if (!createRes.ok) throw new Error("Failed to create YouTube playlist");
        const createData: {
            ok: boolean,
            playlistId: string,
            url: string,
            snippet: {
                title: string
            }
        } = await createRes.json();
        console.log('createData:', createData);

        setResult(prev => prev.map(r => {
            if (r.id !== pendingId)
                return r
            return {
                ...r,
                output: {
                    platform: "youtube",
                    title: createData.snippet.title,
                    url: createData.url,
                    success: true
                }
            } 
        }))


        // add tracks to the YouTube playlist
        const failedTracks = [];
        for (const youtubeData of youtubeResults) {

            const res = {
                playlistId: createData.playlistId,
                videoId: youtubeData.videoId
            };

            console.log('adding res:', res);

            const addRes = await fetch("/api/youtube/add-playlist-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(res),
            });
            if (!addRes.ok) {
                console.error("Failed to add track to YouTube playlist", addRes, res);
                failedTracks.push(youtubeData);
            }
        }
        console.log('All tracks added to the YouTube playlist');
        console.log('Failed tracks:', failedTracks);
    }

    return { url, setUrl, result, loading, error, search }
}

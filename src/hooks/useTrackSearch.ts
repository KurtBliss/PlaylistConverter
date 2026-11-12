import { useState } from "react"
import { parseTrackUrl } from "../utils/urlParser"

export type SearchResult = {
  platform: "youtube" | "spotify";
  url: string;
  title?: string;
  artist?: string;
} | null;

export function useTrackSearch() {
    const [url, setUrl] = useState("")
    const [result, setResult] = useState<SearchResult>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function search(url: string) {
        setLoading(true)
        setError(null)
        setResult(null)

        const parsed = parseTrackUrl(url)
        if (!parsed) {
            setError("Could not parse url")
            setLoading(false)
            return
        }

        try {
            // Input: YouTube track URL
            if (parsed.platform == "youtube" && parsed.type == "track") {
                // get track details from youtube
                const youtubeRes = await fetch(`/api/youtube/track?videoId=${parsed.id}`)
                if (!youtubeRes.ok) throw new Error("Failed to retrieve YouTube track when getting spotify url")
                const youtubeData = await youtubeRes.json()

                console.log('youtubeData:', youtubeData);

                // search spotify with youtube track details
                const params = new URLSearchParams({
                    artist: youtubeData.foundArtist ?? "",
                    album: youtubeData.foundAlbum ?? "",
                    track: youtubeData.foundTrack ?? ""
                });

                console.log('params:', params.toString());

                const spotifyRes = await fetch(`/api/spotify/search?${params}`)
                if (!spotifyRes.ok) throw new Error("Failed to retrieve Spotify track when getting spotify url")
                const spotifyData = await spotifyRes.json()
                
                setResult({
                    platform: "spotify",
                    url: spotifyData.url,
                    title: spotifyData.title,
                    artist: spotifyData.artist
                })
            } 
            
            // Input: Spotify track URL
            else if (parsed.platform == "spotify" && parsed.type == "track") {
                // get track details from spotify
                const spotifyRes = await fetch(`/api/spotify/track?id=${parsed.id}`)
                if (!spotifyRes.ok) throw new Error("Failed to retrieve Spotify track when getting youtube url")
                const spotifyData = await spotifyRes.json()

                // search youtube with spotify track details
                const params = new URLSearchParams({
                    artist: spotifyData.artist ?? "",
                    album: spotifyData.album ?? "",
                    track: spotifyData.track ?? ""
                })

                const youtubeRes = await fetch(`/api/youtube/search?${params}`)
                if (!youtubeRes.ok) throw new Error("Failed to retrieve YouTube track when getting youtube url")
                const youtubeData = await youtubeRes.json()

                setResult({
                    platform: "youtube",
                    url: youtubeData.url,
                    title: youtubeData.foundTrack,
                    artist: youtubeData.foundArtist
                })
            }

            // Input: Spotify playlist URL
            else if (parsed.platform == "spotify" && parsed.type == "playlist") {

                // TODO: check if the playlist is public or private?
                // TODO: check for user authentication?

                // get playlist details from spotify
                console.log('parsed:', parsed);
                const spotifyRes = await fetch(`/api/spotify/playlist?id=${parsed.id}`)
                if (!spotifyRes.ok) throw new Error("Failed to retrieve Spotify playlist")
                const spotifyData = await spotifyRes.json()
                console.log('spotifyData:', spotifyData);

                // search youtube with spotify playlist tracks
                const youtubeResults = []
                for (const track of spotifyData.tracks) {
                    const params = new URLSearchParams({
                        artist: track.artists ?? "",
                        album: track.album ?? "",
                        track: track.track ?? ""
                    })

                    const youtubeRes = await fetch(`/api/youtube/search?${params}`)
                    if (!youtubeRes.ok) throw new Error("Failed to retrieve YouTube track")
                    const youtubeData = await youtubeRes.json()
                    youtubeResults.push(youtubeData)
                }
                console.log('youtubeResults:', youtubeResults);

                // create YouTube playlist
                // how to pass array of YouTube data to create playlist?
                for (const youtubeData of youtubeResults) {

                }

                
            }
        } catch (error) {
            console.error("Failed to search track:", error)
            setError("Failed to search track")
        } finally {
            setLoading(false)
        }
    }
    
    return { url, setUrl, result, loading, error, search }
}

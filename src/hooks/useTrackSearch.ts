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
            if (parsed.platform == "youtube") {
                // get track details from youtube
                const youtubeRes = await fetch(`/api/youtube/track?videoId=${parsed.id}`)
                if (!youtubeRes.ok) throw new Error("Failed to retrieve YouTube track when getting spotify url")
                const youtubeData = await youtubeRes.json()

                console.log('youtubeData:', youtubeData);

                // search spotify with youtube track details
                const params = new URLSearchParams({
                    artist: youtubeData.artist ?? "",
                    album: youtubeData.album ?? "",
                    track: youtubeData.track ?? ""
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
            
            else if (parsed.platform == "spotify") {
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
                    title: youtubeData.title,
                    artist: youtubeData.artist
                })
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

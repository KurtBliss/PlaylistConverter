import { useState } from "react"
import { getVideoDetails } from "../services/youtube"
import { parseTrackUrl } from "../utils/urlParser"


export function useTrackSearch() {
    const [url, setUrl] = useState("https://music.youtube.com/watch?v=jR1qfL9f6_g&si=xpCUUSGUdW8K8spa")
    const [spotifyUrl, setSpotifyUrl] = useState("")

    async function search(url: string) {
        const parsed = parseTrackUrl(url)

        if (!parsed) {
            console.log("Could not parse url")
            return
        }

        if (parsed.platform == "youtube") {
            console.log("youtube video id", parsed.id)
            const results = await getVideoDetails(parsed.id)
            // console.log("getVideoDetails", results)
            const params = new URLSearchParams({
                ...results
            });
            // console.log("params", params)
            console.log("making internal spotify search request")
            await fetch(`/api/spotify/track?${params}`).then(async results => {
                const data = await results.json()
                console.log("Spotify search results:", data)
                setSpotifyUrl(data.spotifyUrl)
            }).catch(error => {
                console.error("Failed to retrieve Spotify track:", error)
            })
        } 
        
        else if (parsed.platform == "spotify") {
            console.log("spotify track id", parsed.id)
            // https://developer.spotify.com/documentation/web-api/reference/get-track
        }
    }

    return { url, setUrl, spotifyUrl, search }
}




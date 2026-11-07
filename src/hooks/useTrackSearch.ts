import { useState } from "react"
import { parseTrackUrl } from "../utils/urlParser"


export function useTrackSearch() {
    
    const [url, setUrl] = useState("https://open.spotify.com/track/7aqcjiCHABnqRNanxUI8zm?si=76e13325ea7a4e5f")
    // const [url, setUrl] = useState("https://music.youtube.com/watch?v=jR1qfL9f6_g&si=xpCUUSGUdW8K8spa")
    const [spotifyUrl, setSpotifyUrl] = useState("")

    async function search(url: string) {
        const parsed = parseTrackUrl(url)

        if (!parsed) {
            console.log("Could not parse url")
            return
        }

        if (parsed.platform == "youtube") {
            console.log("youtube video id", parsed.id)
            //const results = await getVideoDetails(parsed.id)
            const response = await fetch(`/api/youtube/track?videoId=${parsed.id}`)
            const results = await response.json()
            // console.log("getVideoDetails", results)
            const params = new URLSearchParams({
                ...results
            });
            // console.log("params", params)
            console.log("making internal spotify search request")
            await fetch(`/api/spotify/search?${params}`).then(async results => {
                const data = await results.json()
                console.log("Spotify search results:", data)
                setSpotifyUrl(data.spotifyUrl)
            }).catch(error => {
                console.error("Failed to retrieve Spotify track:", error)
            })
        } 
        
        else if (parsed.platform == "spotify") {
            console.log("spotify track id", parsed.id)

            // get track details
            const trackResponse = await fetch(`/api/spotify/track?id=${parsed.id}`)
            if (!trackResponse.ok) {
                console.error("Failed to retrieve Spotify track")
                return
            }

            const trackData = await trackResponse.json()
            console.log("Spotify track data:", trackData)

            
            // get/find youtube music link
            const params = new URLSearchParams({
                artist: trackData.artist,
                album: trackData.album,
                track: trackData.track
            })
            const request = await fetch(`/api/youtube/search?${params}`)
            const results = await request.json()
            console.log("YouTube search results:", results)
            setSpotifyUrl(results.url)
            // const query = await searchYoutube({
            //     artist: trackData.artist,
            //     album: trackData.album,
            //     track: trackData.track
            // })
            // setSpotifyUrl(query as string)

            
            
            // https://developer.spotify.com/documentation/web-api/reference/get-track
        }
    }
    
    return { url, setUrl, spotifyUrl, search }
}




/*
await fetch(`/api/spotify/track?id=${parsed.id}`).then(async results => {
    const data = await results.json()
    console.log("Spotify track data:", data)
}).catch(error => {
    console.error("Failed to retrieve Spotify track:", error)
})
*/
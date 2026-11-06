import { type SubmitEvent } from "react"
import { useTrackSearch } from "../hooks/useTrackSearch"


export function TrackForm() {
    const { url, setUrl, spotifyUrl, search } = useTrackSearch()

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault()
        search(url)        
    }

    return <form onSubmit={handleSubmit}>
        <input type="text" 
            placeholder="Paste URL" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
        />
        <button>Submit</button>
        {spotifyUrl && <p><a href={spotifyUrl}>{spotifyUrl}</a></p>}
    </form>
}

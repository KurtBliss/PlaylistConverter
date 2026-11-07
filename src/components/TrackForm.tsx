import { type SubmitEvent } from "react"
import { useTrackSearch } from "../hooks/useTrackSearch"


export function TrackForm() {
    const { url, setUrl, result, loading, error, search } = useTrackSearch()

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
        <button disabled={loading}>Submit</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {result && <p><a href={result.url}>{result.url}</a></p>}
    </form>
}

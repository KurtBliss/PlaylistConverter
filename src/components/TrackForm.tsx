import { useEffect, useState, type SubmitEvent } from "react"
import { useTrackSearch } from "../hooks/useTrackSearch"


export function TrackForm() {
    const { url, setUrl, search } = useTrackSearch()

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
    </form>
}




/* 


tags Array(3)
0 "Dinosaur Pile-Up"
1 "Celebrity Mansions"
2 "Thrash Metal Cassette"


*/
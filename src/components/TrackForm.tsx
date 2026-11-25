import { type SubmitEvent } from "react"
import { useTrackSearch } from "../hooks/useTrackSearch"
import type { ConversionResult, TrackInfo, PlaylistInfo } from "../../shared/conversion"


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
        {result.map((r : ConversionResult) => {
            if (r.type == "playlist")
                return PlaylistResult(r)
            else if (r.type == "track")
                return TrackResult(r)
        })}
        <div><a href="/api/auth/google/login">Connect YouTube</a></div>
    </form>
}

type TrackPair = {
  input: TrackInfo
  output: TrackInfo
}

function PlaylistResult(r: ConversionResult) {
    const tracks : TrackPair[] = 
        r.type == "playlist" && r.tracks ? r.tracks as TrackPair[] : []

    const TracksRender = r.type == "playlist" && r.tracks ? <>
        {tracks.map((t : TrackPair) => {
            return <>
                <h3>Playlist Track</h3>
                <p>input: {TrackInfo(t.input)}</p>
                <p>output: {t.output ? TrackInfo(t.output) : "N/A"}</p>
            </>
        })}
    </> : <></>

    if (r.output) {
        return <div>
            <h1>Playlist</h1>
            <p>input: {PlaylistInfo(r.input)} </p>
            <p>output: {PlaylistInfo(r.output)} </p>
            {TracksRender}
        </div>
    } else {
        return <div>
            <h1>Playlist</h1>
            <p>input: {PlaylistInfo(r.input)}</p>
            <p>output: N/A</p>
            {TracksRender}
        </div>
    }
}

function PlaylistInfo(playlist: PlaylistInfo) {
    return <a href={playlist.url}> {playlist.platform} : {playlist.title ?? "Unkown Playlist"} </a>
}

function TrackResult(r: ConversionResult) {
    if (r.output) {
        return <div>
            <h1>Track</h1>
            <p>input: {TrackInfo(r.input)}</p>
            <p>output: {TrackInfo(r.output)}</p>
        </div>
    } else {
        return <div>
            <h1>Track</h1>
            <p>input: {TrackInfo(r.input)}</p>
            <p>output: N/A</p>
        </div>
    }
}

function TrackInfo(track: TrackInfo) {
    return <a href={track.url}>{track.platform} : {track.artist ?? "Unkown Artist"} - {track.track ?? "Unkown Track"}</a>
}
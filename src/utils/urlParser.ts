export type ParsedTrack = {
  platform: "youtube" | "spotify";
  type: "track" | "playlist";
  id: string;
  raw: string;
}

export function parseTrackUrl(url: string): ParsedTrack | null {
    if (url.includes("youtube.com")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const videoId = urlParams.get('v')
        if (typeof videoId == "string") {
            return {
                id: videoId,
                type: "track",
                platform: "youtube",
                raw: url
            }
        }
    } else if (url.includes("spotify.com")) {
        const urlParts = url.split("/")
        for (let i = 0; i < urlParts.length; i++) {
            if (urlParts[i] === "track") {
                const parse = urlParts[i + 1]
                const trackId = parse.split("?")[0]
                return {
                    id: trackId,
                    type: "track",
                    platform: "spotify",
                    raw: url
                }
            } else if (urlParts[i] === "playlist") {
                const parse = urlParts[i + 1]
                const playlistId = parse.split("?")[0]
                return {
                    id: playlistId,
                    type: "playlist",
                    platform: "spotify",
                    raw: url
                }
            }
        }
    }

    return null
}
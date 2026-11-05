export type ParsedTrack = {
  platform: "youtube" | "spotify";
  id: string;
}

export function parseTrackUrl(url: string): ParsedTrack | null {
    if (url.includes("youtube.com")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const videoId = urlParams.get('v')
        if (typeof videoId == "string") {
            return {
                id: videoId,
                platform: "youtube"
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
                    platform: "spotify"
                }
            }
        }
    }

    return null
}
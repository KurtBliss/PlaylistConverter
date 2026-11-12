

export function cleanTitle(title: string): string {
  return title
    .replace(/\(.*?\)|\[.*?\]/g, "")          // remove (Lyric Video), [Official Video], etc.
    .replace(/official|lyric|video|audio|hq|hd/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanChannel(channel: string): string {
  return channel
    .replace(/VEVO|Official|Music|Topic/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function removeArtistFromTitle(title: string, artist: string): string {
  const regex = new RegExp(`^${artist}\\s*[-–—:]\\s*`, "i");
  return title.replace(regex, "").trim();
}

export function findTrackDetails(title: string, channel: string, tags: string[]) {
    let foundArtist = "";
    let foundAlbum = "";
    let foundTrack = "";

    if (tags == null 
    || tags.length == 0 
    || tags.length > 3) {
        foundArtist = cleanChannel(channel);
        foundTrack = cleanTitle(title);
        foundTrack = removeArtistFromTitle(foundTrack, foundArtist);
    } else if (tags.length == 3) {
        foundArtist = tags[0];
        foundAlbum = tags[1];
        foundTrack = tags[2];
    } else if (tags.length == 2) {
        foundArtist = tags[0];
        foundTrack = tags[1];
    }

    return {
        foundArtist,
        foundAlbum,
        foundTrack,
    };
}


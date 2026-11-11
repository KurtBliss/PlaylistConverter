# Playlist Converter

Convert tracks and playlists between **YouTube Music** and **Spotify**.

Paste a song or playlist URL from either platform and get matching links on the other.

**Live app:** [playlist-converter-chi.vercel.app](https://playlist-converter-chi.vercel.app/)

## Features

- Convert individual tracks between YouTube Music and Spotify
- Convert public playlists (in progress)
- YouTube OAuth with httpOnly cookies for playlist creation
- Serverless API routes (Vercel) so API keys stay off the client

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Vercel Serverless Functions (`/api`)
- **APIs:** YouTube Data API v3, Spotify Web API

## Project Structure

```
api/
  _lib/          # Shared Spotify & Google helpers
  auth/google/   # YouTube OAuth login + callback
  spotify/       # track, search, playlist, create-playlist
  youtube/       # track, search, playlist, create-playlist

src/
  components/    # TrackForm, Results
  hooks/         # useTrackSearch
  services/      # Client-side API wrappers
  types/         # Shared TypeScript types
  utils/         # URL parsing
```

## Getting Started

### Prerequisites

- Node.js 18+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)
- A [Spotify Developer](https://developer.spotify.com/) app
- A [Google Cloud](https://console.cloud.google.com/) project with the YouTube Data API enabled

### Environment Variables

Pull them from Vercel (recommended):

```bash
vercel env pull .env.local
```

Or create `.env.local` manually:

```env
VERCEL_SPOTIFY_CLIENT=
VERCEL_SPOTIFY_SECRET=
VERCEL_GOOGLE_CLIENT=
VERCEL_GOOGLE_SECRET=
VERCEL_YOUTUBE_API_KEY=
```

> Client secrets and API keys are only used in serverless functions.

### Run Locally

```bash
vercel dev
```

Open the URL shown in the terminal (usually [http://localhost:3000](http://localhost:3000)).

## Deployment

Deployed on [Vercel](https://vercel.com/kurtlyn/playlist-converter).

Push to `main` to trigger a production deploy.

## Status

- [x] Single track conversion (YouTube ↔ Spotify)
- [x] YouTube OAuth (httpOnly cookie)
- [ ] Full playlist conversion
- [ ] Shareable playlist links
- [ ] Better matching / confidence scores

## License

Private project.

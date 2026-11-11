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
- A [Spotify Developer](https://developer.spotify.com/) app
- A [Google Cloud](https://console.cloud.google.com/) project with the YouTube Data API enabled

### Environment Variables

Create a `.env.local` file (or use `vercel env pull .env.local`):

```env
# Spotify (Client Credentials)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# YouTube / Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
YOUTUBE_API_KEY=

# Optional: Vercel
VERCEL_URL=
```

> **Note:** Client secrets and the YouTube API key are only used in serverless functions. Do not expose them in the frontend.

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For local serverless functions, use:

```bash
npx vercel dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint |

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

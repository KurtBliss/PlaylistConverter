
export async function getSpotifyToken() {
  const client_id = process.env.VERCEL_SPOTIFY_CLIENT;
  const client_secret = process.env.VERCEL_SPOTIFY_SECRET;
  if (!client_id || !client_secret) {
    console.log("Missing Spotify client credentials (VERCEL_SPOTIFY_CLIENT and/or VERCEL_SPOTIFY_SECRET)");
    return null;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials"
  } as unknown as URLSearchParams)

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        'Content-Length': body.toString().length.toString()
      },
      body: body,
    });
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    return null
  }
}


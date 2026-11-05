
export async function getSpotifyToken() {
  console.log("CLIENT_ID exists:", !!process.env.VERCEL_SPOTIFY_CLIENT);
  console.log("CLIENT_SECRET exists:", !!process.env.VERCEL_SPOTIFY_SECRET);
  const client_id = process.env.VERCEL_SPOTIFY_CLIENT;
  const client_secret = process.env.VERCEL_SPOTIFY_SECRET;

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


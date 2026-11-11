export default {
  async fetch(request: Request) {
    const clientId = process.env.VERCEL_GOOGLE_CLIENT;
    const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`;

    console.log(redirectUri)

    const params = new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/youtube", 
      access_type: "offline",
      prompt: "consent",
    });

    return Response.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    );
  },
};
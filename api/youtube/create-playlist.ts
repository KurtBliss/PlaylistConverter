

export default {
    async fetch(request: Request) {
        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        const body = await request.json() as { title: string; tracks: {id: string}[] };
        const { title, tracks } = body;
        title;

        const cookie = request.headers.get("cookie") || "";
        const match = cookie.match(/google_access_token=([^;]+)/);
        const accessToken = match?.[1];

        if (!accessToken) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Create a YouTube playlist using the access token
        const createPlaylistRes = await fetch("https://www.googleapis.com/youtube/v3/playlists", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                snippet: {
                    title: title,
                    description: "Converted Spotify Playlist",
                    status: "public"
                }
            })
        });
        if (!createPlaylistRes.ok) {
            return new Response("Failed to create YouTube playlist", { status: 500 });
        }
        const createPlaylistData = await createPlaylistRes.json();
        console.log('createPlaylistData:', createPlaylistData);
        // const playlistId = createPlaylistData.id;

        // Example response
        return new Response(JSON.stringify({ message: "Playlist created successfully", data: createPlaylistData }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
};
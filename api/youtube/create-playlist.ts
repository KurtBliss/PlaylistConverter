

export default {
    async fetch(request: Request) {
        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        const body = await request.json() as { title: string; };
        const { title } = body;

        const cookie = request.headers.get("cookie") || "";
        const match = cookie.match(/google_access_token=([^;]+)/);
        const accessToken = match?.[1];

        if (!accessToken) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Create a YouTube playlist using the access token
        const createPlaylistRes = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet,status", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                snippet: {
                    title: title,
                    description: "Converted Spotify Playlist",
                    // status: "public"
                },
                status: {
                    privacyStatus: "public", // "private" | "unlisted" | "public"
                },
            })
        });
        if (!createPlaylistRes.ok) {
            const errText = await createPlaylistRes.text();
            console.error("YouTube create playlist error:", createPlaylistRes.status, errText);
            return new Response(
                JSON.stringify({ ok: false, error: errText }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
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
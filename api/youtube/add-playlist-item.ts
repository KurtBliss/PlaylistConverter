


export default {
    async fetch(request: Request) {
        if (request.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }


        const body = await request.json() as { playlistId: string; videoId: string };
        const { playlistId, videoId } = body;

        const cookie = request.headers.get("cookie") || "";
        const match = cookie.match(/google_access_token=([^;]+)/);
        const accessToken = match?.[1];

        if (!accessToken) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Create a YouTube playlist using the access token
        const addPlaylistItemRes = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: "youtube#video",
                        videoId: videoId,
                    },
                },
            })
        });
        if (!addPlaylistItemRes.ok) {
            const errText = await addPlaylistItemRes.text();
            console.error("YouTube add playlist item error:", addPlaylistItemRes.status, errText);
            return new Response(
                JSON.stringify({ ok: false, error: errText }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
        const addPlaylistItemData = await addPlaylistItemRes.json();
        console.log('addPlaylistItemData:', addPlaylistItemData);
        return new Response(
            JSON.stringify({ ok: true, data: addPlaylistItemData }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );


    }
}
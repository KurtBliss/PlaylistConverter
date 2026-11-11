

export default {
    async fetch(request: Request) {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        console.log("code", code);
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: code!,
                client_id: process.env.VERCEL_GOOGLE_CLIENT!,
                client_secret: process.env.VERCEL_GOOGLE_SECRET!,
                redirect_uri: `${new URL(request.url).origin}/api/auth/google/callback`,
                grant_type: "authorization_code",
            }),

        });
        const data = await response.json() as { access_token: string; expires_in: number, refresh_token?: string, refresh_token_expires_in?: number };

        const headers = new Headers();

        const parts = [
            `google_access_token=${data.access_token}`,
            "HttpOnly",
            "Secure",
            "SameSite=Lax",
            "Path=/",
            `Max-Age=${data.expires_in}`,
        ];
        headers.append("Set-Cookie", parts.join("; "));

        if (data.refresh_token) {
            const refreshParts = [
                `google_refresh_token=${data.refresh_token}`,
                "HttpOnly",
                "Secure",
                "SameSite=Lax",
                "Path=/",
                `Max-Age=${data.refresh_token_expires_in}`,
            ];
            headers.append("Set-Cookie", refreshParts.join("; "));
        }

        headers.set("Location", "/");
        return new Response(null, { status: 302, headers });

    }
}



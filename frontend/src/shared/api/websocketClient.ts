const WS_BASE_URL = import.meta.env.VITE_WS_URL;

export const WebSocketAPI = {
    connect(path: string, token: string): WebSocket {
        const url = new URL(path, WS_BASE_URL);
        url.searchParams.set("token", token);

        return new WebSocket(url.toString());
    },
};
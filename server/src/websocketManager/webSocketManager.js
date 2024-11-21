class WebSocketManager {
    constructor () {
        this.connections = new Map();
    }

    setConnection(ws){
        this.connections.set(ws, null);

        ws.on('close', () => {

            const interval = this.connections.get(ws);
            if (interval) {
                clearInterval(interval)
            }
            this.connections.delete(ws);
        })
    }

    setInterval(ws, interval) {
        this.connections.set(ws,interval);
    }
    sendMessage(message) {

        this.connections.forEach((interval, ws) => {
            try {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify(message));
                } else {
                    console.warn('WebSocket not in OPEN state or connection not available');
                }
            } catch (e) {
                console.error(`Error sending data: ${e.message}`);
                if (interval) {
                    clearInterval(interval);
                }
                this.connections.delete(ws);
            }
        })
    }

    cleanup(ws) {
        const interval = this.connections.get(ws);
        if (interval) {
            clearInterval(interval);
        }
        this.connections.delete(ws);
    }
}

const webSocketManager = new WebSocketManager();

const attachWebsocketMiddleware = (req, res, next) => {
    req.webSocketManager = webSocketManager;
    next();
};

module.exports = {
    webSocketManager,
    attachWebsocketMiddleware
}
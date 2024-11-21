class WebSocketManager {
    constructor () {
        this.connections = new Set();
        this.activeInterval = null;
    }

    setConnection(ws){
        this.connections.add(ws);

        ws.on('close', () => {
            this.connections.delete(ws);
        })
    }

    setInterval(interval) {
        this.activeInterval = interval;
    }
    sendMessage(message) {

        this.connections.forEach(ws => {
            try {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify(message));
                } else {
                    console.warn('WebSocket not in OPEN state or connection not available');
                }
            } catch (e) {
                console.error(`Error sending data: ${e.message}`);
            }
        })

    }

    cleanup() {
        if (this.activeInterval) {
            clearInterval(this.activeInterval);
            this.activeInterval = null;
        }
        this.connections.clear();
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
const express = require("express"),
    http = require("http"),
    ws = require("ws"),
    {initializePostgres} = require("./db/initializePostgres");
    StockManager = require("./stockManager");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new ws.WebSocketServer({server});

const stockManager = new StockManager();

let activeConnection = null
let activeInterval = null;
const UPDATE_INTERVAL_MS = 1000;

const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
};

const sendWebSocketMsg = (ws, message) => {
    try {
        if(ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
        }
    } catch (e) {
        log(`Error sending data: ${e.message}`);
    }
}

const cleanUpConnection = () => {
    if(activeInterval) {
        clearInterval(activeInterval)
        activeInterval = null;
    }
    activeConnection = null;
};

wss.on("connection", function connection(ws, request) {

    console.log("New WebSocket connection attempt", {
        headers: request.headers,
        url: request.url,
        origin: request.headers.origin,
        userAgent: request.headers['user-agent']
    })

    // Optional: Implement origin checking
    const origin = request.headers.origin;
    if (!origin || !origin.includes('localhost')) {
        log("Rejected connection from unauthorized origin", { origin });
        ws.close();
        return;
    }


    log("New client connected to WebSocket");
    activeConnection = ws;

    const initialData = stockManager.updatePrices()
    sendWebSocketMsg(ws, initialData)
    log("Initial data sent");

    activeInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
           log("Sending prices");
            const updatedPrices = stockManager.updatePrices();
            ws.send(JSON.stringify(updatedPrices));
        }
    }, UPDATE_INTERVAL_MS);

    ws.on("close", () => {
        log("Client disconnected");
        cleanUpConnection();
    });

    ws.on("error", (error) => {
        log("WebSocket error:", error.message);
        if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
            cleanUpConnection();
        }
    });
});




const serverCleanup = () => {
    log("Server shutting down, cleaning up connection...");

    if (activeInterval) {
        clearInterval(activeInterval);
    }

    if (activeConnection) {
        activeConnection.close();
    }


    //TODO Shutdown database connection
    process.exit(0);
};


// Handle server shutdown
process.on('SIGINT', serverCleanup);
process.on('SIGTERM', serverCleanup);


const PORT = process.env.PORT || 3001;

initializePostgres()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on port: ${PORT}`);
        })
    }).catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});



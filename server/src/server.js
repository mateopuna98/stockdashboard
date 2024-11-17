const express = require("express"),
    http = require("http"),
    ws = require("ws"),
    StockManager = require("./stockManager");

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new ws.WebSocketServer({server})

const UPDATE_INTERVAL_MS = 2000;
const stockManager = new StockManager()

//Websocket logic
wss.on("connection", function connection(ws) {
    console.log("Client connected to WebSocket");

    ws.send(JSON.stringify(stockManager.updatePrices()));

    const intervalTimerId = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(stockManager.updatePrices()));
        }
    }, UPDATE_INTERVAL_MS)

    ws.on("error", console.error);
    ws.on("close", () => {
        clearInterval(intervalTimerId);
        console.log("Client disconnected");
    })
})


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
})


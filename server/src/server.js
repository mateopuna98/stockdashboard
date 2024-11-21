const express = require("express"),
    http = require("http"),
    cors = require("cors"),
    ws = require("ws"),
    {webSocketManager, attachWebsocketMiddleware} = require("./websocketManager/webSocketManager"),
    watchlistRoutes = require("./routes/watchlistRoutes"),
    stockRoutes = require("./routes/stockRoutes"),
    {initializePostgres, seedDatabase} = require("./db/initializePostgres"),
    {initializeStocks} = require("./stockAPI/priceUpdates"),
    {MarketHighlightsCache} = require("./cache/marketHighlightsCache"),
    {WatchlistCache} = require("./cache/watchlistCache"),
    {sendDashboardInfo, assembleWebsocketMsg, setCachePrices} = require("./utils/utils");

class StockObservatoryServer {
    constructor() {
        this.marketHighlightsCache = new MarketHighlightsCache();
        this.watchlistCache = new WatchlistCache();
        this.UPDATE_INTERVAL_MS = 2000;
        this.PORT = 3001;
        this.userId;
        this.app = express();
        this.setupExpress();
    }

    setupExpress() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(attachWebsocketMiddleware);
        this.app.use("/api/watchlist", (req, res, next) => {
            req.watchlistCache = this.watchlistCache;
            req.marketHighlightsCache = this.marketHighlightsCache;
            next();
        });
        this.app.use("/api", watchlistRoutes);
        this.app.use("/api", stockRoutes);
        this.server = http.createServer(this.app);
        this.wss = new ws.WebSocketServer({server: this.server});
    }

    async initializeData() {
        try {
            await initializePostgres();

            this.userId = await seedDatabase();

            console.log("userId")
            console.log(this.userId);

            const {watchlist, ...marketHighlights} = await initializeStocks(
                this.userId,
            );

            setCachePrices(
                this.marketHighlightsCache,
                this.watchlistCache,
                marketHighlights,
                watchlist
            );

        } catch (error) {
            console.error("Failed to initialize data:", error);
            throw error;
        }
    }
    setupWebSocket() {
        this.wss.on("connection", async (ws) => {
            console.log("New client connected to WebSocket");

            webSocketManager.setConnection(ws);
            webSocketManager.sendMessage({userId: this.userId});

            const initialData = assembleWebsocketMsg(this.marketHighlightsCache, this.watchlistCache);
            webSocketManager.sendMessage(initialData);

            const interval = setInterval(async () => {
                await sendDashboardInfo(webSocketManager, this.marketHighlightsCache, this.watchlistCache);
            }, this.UPDATE_INTERVAL_MS);

            webSocketManager.setInterval(ws, interval);

            ws.on("close", () => {
                console.log("Client disconnected");
                webSocketManager.cleanup(ws);
            });

            ws.on("error", (error) => {
                console.log("WebSocket error:", error.message);
                if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
                    webSocketManager.cleanup(ws);
                }
            });
        });
    }

    async startServer() {
        try {
            await this.initializeData();
            this.setupWebSocket();
            this.server.listen(this.PORT, () => {
                console.log(`Server listening on port: ${this.PORT}`);
            });
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    }
}

process.on('SIGINT', () => {
    console.log("Server shutting down...");
    webSocketManager.cleanup();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log("Server shutting down...");
    webSocketManager.cleanup();
    process.exit(0);
});

const stockServer = new StockObservatoryServer();
stockServer.startServer();
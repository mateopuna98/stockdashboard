const express = require("express"),
    router = express.Router(),
    {findStockBySymbol} = require("../db/logic/stockLogic"),
    {addToWatchlist, removeFromWatchlist} = require("../db/logic/watchlistItemLogic"),
    {sendDashboardInfo} = require("../utils/utils");

router.post('/watchlist', async (req, res) => {
    try {
        const { symbol, userId } = req.body;

        if (!symbol) {
            return res.status(400).json({ error: "Symbol is required"});
        }

        const stock = await findStockBySymbol(symbol);
        if (!stock) {
            return res.status(404).json({ error: "Invalid stock symbol" });
        }

        const currentWatchlist = await req.watchlistCache.getWatchlistCache(userId);
        const watchlistSymbols = new Set(currentWatchlist.map((stock) => stock.symbol));
        if (watchlistSymbols.has(stock.symbol)) {
            return res.status(409).json({error: "Stock already in watchlist"})
        }

        await addToWatchlist(userId, stock);
        await req.watchlistCache.getWatchlistCache(userId, true);
        await sendDashboardInfo(req.webSocketManager, req.marketHighlightsCache, req.watchlistCache);

        res.status(200).json({
            message: 'Stock added to watchlist'
        });

    } catch (error) {
        console.error('Error adding to watchlist:', error);
        res.status(500).json({ error: 'Failed to add stock to watchlist' });
    }
});

router.delete('/watchlist/', async (req, res) => {
    try {
        const { symbol, userId } = req.body;

        if (!symbol) {
            return res.status(400).json({ error: 'Symbol is required' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        const stock = await findStockBySymbol(symbol);
        if (!stock) {
            return res.status(404).json({ error: 'Invalid stock symbol' });
        }

        const currentWatchlist = await req.watchlistCache.getWatchlistCache(userId);
        const watchlistSymbols = new Set(currentWatchlist.map((stock) => stock.symbol));

        if (!watchlistSymbols.has(stock.symbol)) {
            return res.status(404).json({error: "Failed to delete. Stock not in watchlist"})
        }

        await removeFromWatchlist(userId, stock);
        await req.watchlistCache.getWatchlistCache(userId, true);
        await sendDashboardInfo(req.webSocketManager, req.marketHighlightsCache, req.watchlistCache);

        res.status(200).json({
            message: 'Stock removed from watchlist',
        });

    } catch (error) {
        console.error('Error removing from watchlist:', error);
        res.status(500).json({ error: 'Failed to remove stock from watchlist' });
    }
});

module.exports = router;
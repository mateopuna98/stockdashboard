const {getDashboardInfo} = require("../stockAPI/priceUpdates");

function setCachePrices (marketHighlightsCache, watchlistCache, newMarketHighlightsPrices, newWatchlistPrices) {
    marketHighlightsCache.marketHighlights = newMarketHighlightsPrices;
    watchlistCache.watchlist = newWatchlistPrices;
}
function assembleWebsocketMsg (marketHighlightsCache, watchlistCache) {
    return {...marketHighlightsCache.marketHighlights, watchlist: watchlistCache.watchlist};
}

async function sendDashboardInfo (webSocketManager, marketHighlightsCache, watchlistCache) {
    const {watchlist, ...marketHighlights} = await getDashboardInfo(
        marketHighlightsCache.marketHighlights,
        watchlistCache.watchlist
    );
    setCachePrices(marketHighlightsCache, watchlistCache, marketHighlights, watchlist);
    const message = assembleWebsocketMsg(
        marketHighlightsCache,
        watchlistCache
    );
    webSocketManager.sendMessage(message);
}

module.exports = {
    assembleWebsocketMsg,
    setCachePrices,
    sendDashboardInfo
}
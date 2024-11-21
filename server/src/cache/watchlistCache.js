const {getWatchlistByUser} = require("../db/logic/watchlistItemLogic");

class WatchlistCache {
    constructor() {
        this.watchlist = [];
        this.lastUpdated = null;
        this._ttl_ms =  60 * 5 * 1000; // 5 minutes in milliseconds
    }

    _syncExistingItemsPrice(cachedWatchlist, newWatchlistItems) {
        const cachedWatchlistPriceMap = new Map(
            cachedWatchlist.map(stock => [stock.symbol, stock])
        );

        return newWatchlistItems.map(stock => {
            const existingStock = cachedWatchlistPriceMap.get(stock.symbol);
            if (existingStock) {
                stock.dummy_price = existingStock.dummy_price;
                stock.change = existingStock.change;
                stock.percentChange = existingStock.percentChange
            }
            return stock;
        });
    }

    async getWatchlistCache(userId, refresh=false) {
        const now = Date.now();

        if (refresh || this.watchlist.length > 0 || (now - this.lastUpdated) < this._ttl_ms) {
            const newWatchlist = await getWatchlistByUser(userId);
            if (refresh) {
                this.watchlist  = this._syncExistingItemsPrice(this.watchlist, newWatchlist);
            }
            this.lastUpdated = now;
        }

        return this.watchlist;
    }

}

module.exports = {
    WatchlistCache
}

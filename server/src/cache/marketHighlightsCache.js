
//This class simulates a stocks API as could be Yahoo
class MarketHighlightsCache {
    constructor() {
        this.marketHighlights = {
            losers: [],
            gainers: [],
            trending: []
        };
    }
}

module.exports = {
    MarketHighlightsCache
};
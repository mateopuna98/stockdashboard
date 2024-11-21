const {getWatchlistByUser} = require("../db/logic/watchlistItemLogic"),
    {findRandomStocks} = require("../db/logic/stockLogic");

const PRICE_UPDATE_FACTOR = 2;

function _calculateNewStockPrice(oldPrice) {
    const randomProb = Math.random();
    let percentChange = (Math.random() - 0.5) * PRICE_UPDATE_FACTOR;

    if (randomProb < 0.5) percentChange = percentChange * -1;

    const newPrice = oldPrice + oldPrice * (percentChange/100);

    return {
        dummy_price: newPrice,
        percentChange: percentChange,
        change: newPrice - oldPrice
    };
}
async function initializeStocks(userId) {
        try {
            const initialWatchlist = await getWatchlistByUser(userId);
            const randomStocks = await findRandomStocks(15);

            const uniqueStockMap = new Map();

            randomStocks.forEach((stock) => {
                uniqueStockMap.set(stock.symbol, stock);
            });
            initialWatchlist.forEach((stock) => {
                uniqueStockMap.set(stock.symbol, stock);
            });

            uniqueStockMap.forEach((stock) => {
                const {dummy_price, percentChange, change} = _calculateNewStockPrice(stock.dummy_price);
                stock.dummy_price = dummy_price;
                stock.percentChange = percentChange;
                stock.change = change;
            });

            const updatedWatchlist = initialWatchlist.map((stock) => {
                const updatedStock = uniqueStockMap.get(stock.symbol);
                return {
                    ...stock,
                    dummy_price: updatedStock.dummy_price,
                    percentChange: updatedStock.percentChange,
                    change: updatedStock.change
                }
            });

            const stocksArray = [...uniqueStockMap.values()];

            const gainers = stocksArray
                .sort((a, b) => b.dummy_price - a.dummy_price)
                .slice(0, 5);

            const losers = stocksArray
                .sort((a, b) => a.dummy_price - b.dummy_price)
                .slice(0, 5);

            const trending = stocksArray
                .sort(() => Math.random() - 0.5)
                .slice(0, 5);

            return {
                gainers: gainers,
                losers: losers,
                trending: trending,
                watchlist: updatedWatchlist
            }
        } catch (e) {
            throw new Error(`Error initializing stocks: ${e}`);
        }
}

async function getDashboardInfo (marketHighlights, watchlist) {
    const uniqueStockMap = new Map();

    [
        marketHighlights.gainers,
        marketHighlights.losers,
        marketHighlights.trending,
        watchlist
    ].forEach((stockList) => {
        stockList.forEach((stock) => {
            uniqueStockMap.set(stock.symbol, stock);
        });
    });

    uniqueStockMap.forEach((stock) => {
        const {dummy_price, percentChange, change} = _calculateNewStockPrice(stock.dummy_price);
        stock.dummy_price = dummy_price;
        stock.percentChange = percentChange;
        stock.change = change;    });

    [
        marketHighlights.gainers,
        marketHighlights.losers,
        marketHighlights.trending,
        watchlist
    ].forEach((stockList) => {
        stockList.forEach((stock) => {
            const updatedStock = uniqueStockMap.get(stock.symbol);
            stock.dummy_price = updatedStock.dummy_price;
            stock.percentChange  = updatedStock.percentChange;
            stock.change = updatedStock.change;
        });
    });

    return {
        ...marketHighlights, watchlist: watchlist
    };
}

module.exports = {
    initializeStocks,
    getDashboardInfo
}
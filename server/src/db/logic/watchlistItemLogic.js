const WatchlistItem = require("../models/WatchlistItem");
const Stock = require("../models/Stock");

async function getWatchlistByUser(userId) {
    const stocks = await WatchlistItem.findAll({
        include: [{
            model: Stock,
            attributes: ['symbol', 'name', 'dummy_price']
        }],
        where: { user_id: userId },
        attributes: [],
        nest: true
    });
    return stocks.map(item => ({
        symbol: item.Stock.symbol,
        name: item.Stock.name,
        dummy_price: item.Stock.dummy_price
    }));
}

async function addToWatchlist(userId, stock) {
    try {
        return await WatchlistItem.create({
            user_id: userId,
            stock_id: stock.id
        });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw error;
    }
}

async function removeFromWatchlist(userId, stock) {
    try {
        console.log(userId)
        return await WatchlistItem.destroy({
            where: {
                user_id: userId,
                stock_id: stock.id
            }
        })
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw error;
    }
}

module.exports = {
    addToWatchlist,
    removeFromWatchlist,
    getWatchlistByUser
};
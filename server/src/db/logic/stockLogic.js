// stockFunctions.js
const Stock = require('../models/Stock');
const sequelize = require("../configPostgres");

async function findStockBySymbol(symbol) {
    try {
        return await Stock.findOne({
            where: {
                symbol: symbol.toUpperCase()
            },
            raw: true
        });
    } catch (error) {
        console.error('Error finding stock:', error);
        throw error;
    }
}

async function findRandomStocks(limit) {
    const stocks = await Stock.findAll({
        attributes: ['symbol', 'name', 'dummy_price'],
        order: sequelize.random(),
        limit: limit,
    });

    return stocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        dummy_price: stock.dummy_price
    }));
}


module.exports = {
    findStockBySymbol,
    findRandomStocks
};
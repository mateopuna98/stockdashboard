const express=  require("express"),
    router = express.Router(),
    {findStockBySymbol} = require("../db/logic/stockLogic");
router.get('/stocks', async (req, res) => {
    try {
        console.log("api/stocks/search received with args", req.query);
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Symbol required' });
        }

        const stock = await findStockBySymbol(query);

        console.log(stock)
        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        return res.json({
            symbol: stock.symbol,
            name: stock.name
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search stock' });
    }
});

module.exports = router;
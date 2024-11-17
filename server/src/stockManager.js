class StockManager {
    constructor() {
        this.stocks = {
            losers: [
                {symbol: 'OKLO', name: 'Oklo Inc.', price: 18.00, change: -5.88, percentChange: -24.62},
                {symbol: 'RNA', name: 'Avidity Bioscienc...', price: 42.18, change: -7.79, percentChange: -15.59},
                {symbol: 'HALO', name: 'Halozyme Therap...', price: 45.65, change: -8.31, percentChange: -15.40},
                {symbol: 'ARWR', name: 'Arrowhead Phar...', price: 18.57, change: -2.84, percentChange: -13.26},
                {symbol: 'RGEN', name: 'Repligen Corpora...', price: 124.73, change: -17.70, percentChange: -12.43}
            ],
            gainers: [
                {symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 78.43, percentChange: 24.52},
                {symbol: 'AMD', name: 'Advanced Micro...', price: 192.45, change: 32.79, percentChange: 20.15},
                {symbol: 'TSLA', name: 'Tesla Inc.', price: 245.65, change: 28.31, percentChange: 18.40},
                {symbol: 'PLTR', name: 'Palantir Techno...', price: 52.45, change: 8.79, percentChange: 15.26},
                {symbol: 'AI', name: 'C3.ai Inc.', price: 124.73, change: 17.70, percentChange: 13.43}
            ],
            trending: [
                {symbol: 'AAPL', name: 'Apple Inc.', price: 175.28, change: -8.43, percentChange: -4.52},
                {symbol: 'META', name: 'Meta Platforms...', price: 505.45, change: 32.79, percentChange: 6.15},
                {symbol: 'MSFT', name: 'Microsoft Corp.', price: 425.65, change: -18.31, percentChange: -2.40},
                {symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.45, change: 12.79, percentChange: 7.26},
                {symbol: 'GOOGL', name: 'Alphabet Inc.', price: 144.73, change: -5.70, percentChange: -3.43}
            ]
        };
    }


    getPercentageChange(stockType) {

        if (stockType === "gainers") {
            return (Math.random()) * 2
        } else if (stockType === "losers") {
            return -1 * (Math.random()) * 2
        } else {
            return (Math.random() + 0.5) * 2
        }
    }
    updatePrices() {
        const updatedStocks = {};

        const keys  = Object.keys(this.stocks);
        console.log(keys)

        Object.keys(this.stocks).forEach((key) => {
            updatedStocks[key] = this.stocks[key]
                .map((stock) => {
                const percentageChange = this.getPercentageChange(key) / 100;
                return {
                    ...stock,
                    oldPrice: stock.price,
                    price: stock.price * (1 + percentageChange),
                    percentageChange: percentageChange,
                    change: stock.price * percentageChange
                };
            });
        });

        this.stocks = updatedStocks;


        return updatedStocks;
    };
}

module.exports = StockManager;
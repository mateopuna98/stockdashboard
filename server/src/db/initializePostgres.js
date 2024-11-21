const sequelize = require("./configPostgres");

const Stock = require("./models/Stock"),
    User = require("./models/User"),
    WatchlistItem = require("./models/WatchlistItem");


const TOP_100_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', dummy_price: 173.25 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', dummy_price: 402.85 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', dummy_price: 147.68 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', dummy_price: 178.35 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', dummy_price: 875.42 },
    { symbol: 'META', name: 'Meta Platforms Inc.', dummy_price: 505.82 },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', dummy_price: 412.45 },
    { symbol: 'LLY', name: 'Eli Lilly and Company', dummy_price: 768.24 },
    { symbol: 'TSLA', name: 'Tesla Inc.', dummy_price: 175.34 },
    { symbol: 'V', name: 'Visa Inc.', dummy_price: 279.85 },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', dummy_price: 492.15 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', dummy_price: 183.27 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', dummy_price: 157.94 },
    { symbol: 'XOM', name: 'Exxon Mobil Corporation', dummy_price: 105.68 },
    { symbol: 'PG', name: 'Procter & Gamble Co.', dummy_price: 161.42 },
    { symbol: 'MA', name: 'Mastercard Inc.', dummy_price: 475.82 },
    { symbol: 'HD', name: 'The Home Depot Inc.', dummy_price: 378.45 },
    { symbol: 'AVGO', name: 'Broadcom Inc.', dummy_price: 1284.65 },
    { symbol: 'CVX', name: 'Chevron Corporation', dummy_price: 152.34 },
    { symbol: 'ABBV', name: 'AbbVie Inc.', dummy_price: 178.52 },
    { symbol: 'PFE', name: 'Pfizer Inc.', dummy_price: 27.45 },
    { symbol: 'COST', name: 'Costco Wholesale Corporation', dummy_price: 742.56 },
    { symbol: 'WMT', name: 'Walmart Inc.', dummy_price: 174.85 },
    { symbol: 'MRK', name: 'Merck & Co. Inc.', dummy_price: 125.74 },
    { symbol: 'BAC', name: 'Bank of America Corporation', dummy_price: 33.58 },
    { symbol: 'KO', name: 'The Coca-Cola Company', dummy_price: 61.45 },
    { symbol: 'PEP', name: 'PepsiCo Inc.', dummy_price: 172.84 },
    { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', dummy_price: 578.92 },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.', dummy_price: 49.85 },
    { symbol: 'ORCL', name: 'Oracle Corporation', dummy_price: 127.45 },
    { symbol: 'ACN', name: 'Accenture plc', dummy_price: 342.75 },
    { symbol: 'NFLX', name: 'Netflix Inc.', dummy_price: 628.92 },
    { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', dummy_price: 178.45 },
    { symbol: 'INTC', name: 'Intel Corporation', dummy_price: 42.85 },
    { symbol: 'DIS', name: 'The Walt Disney Company', dummy_price: 112.74 },
    { symbol: 'CRM', name: 'Salesforce Inc.', dummy_price: 295.45 },
    { symbol: 'VZ', name: 'Verizon Communications Inc.', dummy_price: 40.82 },
    { symbol: 'ADBE', name: 'Adobe Inc.', dummy_price: 485.65 },
    { symbol: 'CMCSA', name: 'Comcast Corporation', dummy_price: 42.85 },
    { symbol: 'WFC', name: 'Wells Fargo & Company', dummy_price: 57.42 }
];

async function seedDatabase() {
    try {

        let user = await User.findOne({where: {username: "mateo"}, raw: true});

        if (user) {
            console.log("ALREADY EXISTS");
            console.log(user)
            return user.id;
        }


        user = await User.create({
            username: 'mateo',
        });

        const userId = user.id;

        const stocks = await Stock.bulkCreate(TOP_100_STOCKS, {
            returning: true
        });

        const watchlist_items = stocks.map(stock => ({
            stock_id: stock.id,
            user_id: user.id
        })).slice(-5);

        await WatchlistItem.bulkCreate(watchlist_items);

        console.log('Database seeded successfully!');
        return userId;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
}


async function initializePostgres() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await sequelize.sync();
        console.log('Database synchronized successfully');

    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = {
    initializePostgres,
    seedDatabase
}
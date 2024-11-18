const sequelize = require("./configPostgres");

const Stock = require("./models/Stock"),
    User = require("./models/User"),
    Watchlist = require("./models/Watchlist");


const TOP_100_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.'},
    { symbol: 'MSFT', name: 'Microsoft Corporation'},
    { symbol: 'GOOGL', name: 'Alphabet Inc.'},
    { symbol: 'AMZN', name: 'Amazon.com Inc.'},
    { symbol: 'NVDA', name: 'NVIDIA Corporation'},
    // ... Add more stocks here
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.'},
    { symbol: 'V', name: 'Visa Inc.'},
    { symbol: 'JNJ', name: 'Johnson & Johnson'}
];

async function seedDatabase() {
    try {

        // Create stocks
        const stocks = await Stock.bulkCreate(TOP_100_STOCKS);

        console.log("creating user")
        // Create sample user
        const user = await User.create({
            username: 'demo_user'
        });

        console.log("Creating watchlist")
        // Create sample watchlist
        const watchlist = await Watchlist.create({
            name: "Mateo's Watchlist",
            user_id: user.id
        });


        console.log('Database seeded successfully!');
        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
}

// Run the seeder



async function initializePostgres() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await sequelize.sync();
        console.log('Database synchronized successfully.');

        const result  = seedDatabase()
            .then(() => {
                console.log('Seeding complete');
            })
            .catch(err => {
                console.error('Seeding failed:', err);
            });


    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    initializePostgres
}
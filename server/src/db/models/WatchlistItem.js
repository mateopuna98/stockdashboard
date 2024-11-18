const {DataTypes} = require("sequelize"),
    sequelize = require("../configPostgres"),
    uuid = require("uuid"),
    Watchlist = require("./Watchlist"),
    Stock = require("./Stock");

const WatchlistItem = sequelize.define(
    "Watchlist",
    {
        "id":{
            defaultValue: () => uuid.v4(),
            primaryKey: true,
            allowNull: false,
            type: DataTypes.UUID,
        },
        "watchlist_id": {
            allowNull: false,
            type: DataTypes.UUID
        },
        "stock_id": {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: Stock,
                key: "id"
            },
            onDelete: "CASCADE"
        }
    }
);

Watchlist.hasMany(WatchlistItem, {foreignKey: "watchlist_id", onDelete: "CASCADE"},);
WatchlistItem.belongsTo(Watchlist);

module.exports = WatchlistItem;
const {DataTypes} = require("sequelize"),
    sequelize = require("../configPostgres"),
    uuid = require("uuid"),
    User = require("./User"),
    Stock = require("./Stock");

const WatchlistItem = sequelize.define(
    "WatchlistItem",
    {
        "id":{
            defaultValue: () => uuid.v4(),
            primaryKey: true,
            allowNull: false,
            type: DataTypes.UUID,
        },
        "user_id": {
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
    }, {
        indexes: [
            {
                unique: true,
                fields: ["user_id", "stock_id"]
            }
        ]
    }
);

User.hasMany(WatchlistItem, {foreignKey: "user_id", onDelete: "CASCADE"});
WatchlistItem.belongsTo(User);

WatchlistItem.belongsTo(Stock, {foreignKey: "stock_id", onDelete: "CASCADE"});

module.exports = WatchlistItem;
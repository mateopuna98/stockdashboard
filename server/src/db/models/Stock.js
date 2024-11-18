const {DataTypes} = require("sequelize"),
    sequelize = require("../configPostgres"),
    uuid = require("uuid");

const Stock = sequelize.define(
    'Stock',
    {
        "id":{
            defaultValue: () => uuid.v4(),
            primaryKey: true,
            allowNull: false,
            type: DataTypes.UUID,
        },
        "symbol": {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        "name": {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
);

module.exports = Stock;
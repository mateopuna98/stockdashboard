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
        "dummy_price": {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false,
            get() {
                const value = this.getDataValue('dummy_price');
                return value === null ? null : Number(value);
            }
        },
        "last_price": {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false,
            get() {
                const value = this.getDataValue('dummy_price');
                return value === null ? null : Number(value);
            }
        }
    }

);

module.exports = Stock;
const {DataTypes} = require("sequelize"),
    sequelize = require("../configPostgres"),
    uuid = require("uuid");

const User = sequelize.define(
    "User",
    {
        "id":{
            defaultValue: () => uuid.v4(),
            primaryKey: true,
            allowNull: false,
            type: DataTypes.UUID,
        },
        "username": {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }
);


module.exports = User;
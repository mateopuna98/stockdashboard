// const {DataTypes} = require("sequelize"),
//     sequelize = require("../configPostgres"),
//     uuid = require("uuid"),
//     User = require("./User");
//
// const Watchlist = sequelize.define(
//     "Watchlist",
//     {
//         "id":{
//             defaultValue: () => uuid.v4(),
//             primaryKey: true,
//             allowNull: false,
//             type: DataTypes.UUID,
//         },
//         "name": {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//
//         "user_id": {
//             type: DataTypes.UUID,
//             allowNull: false,
//             unique: true
//         }
//     }
// );
//
// User.hasMany(Watchlist, {foreignKey: "user_id"});
// Watchlist.belongsTo(User);
// module.exports = Watchlist;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USERNAME, 
    process.env.DB_PWD, 
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
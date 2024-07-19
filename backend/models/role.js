// role table schema 
module.exports = function(sequelize, Sequelize) {
    const role = sequelize.define("roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        }
    });
  
    return role
}
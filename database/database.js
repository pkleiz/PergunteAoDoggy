const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "root", "7391", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;

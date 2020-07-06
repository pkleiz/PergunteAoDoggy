const Sequelize = require("sequelize");
const connection = require("../database.js");

//cria a tabela no BD sem usar sql
const Pergunta = connection.define("perguntas", {
  titulo: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Pergunta.sync({ force: false }).then(() => {
  console.log("Tabela Criada");
});

module.exports = Pergunta;

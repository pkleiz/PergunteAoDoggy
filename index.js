const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/model/Pergunta.js");
const Resposta = require("./database/model/Resposta.js");

//database connection (promise)

connection
  .authenticate()
  .then(() => {
    console.log("Conexão ao banco de Dados feita com sucesso");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

//estou dizendo para o express que quero o ejs como view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    console.log(perguntas);
    res.render("index.ejs", {
      perguntas: perguntas,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar.ejs");
});

app.get("/raba", (req, res) => {
  res.send("em desenvolvimento");
  //res.render("bucetuda.ejs");
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    //pergunta encontrada
    if (pergunta != undefined) {
      Resposta.findAll({
        where: { perguntaID: pergunta.id },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta.ejs", {
          pergunta: pergunta,
          respostas: respostas,
        });
      });

      //pergunta não encontrada
    } else {
      res.redirect("/");
    }
  });
});

//POSTS

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  if (titulo == "") {
    res.redirect("/");
  } else {
    Pergunta.create({
      titulo: titulo,
      descricao: descricao,
    }).then(() => {
      res.redirect("/");
    });
  }
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaID = req.body.pergunta;

  if (corpo == "") {
    res.redirect("/pergunta/" + perguntaID);
  } else {
    Resposta.create({
      corpo: corpo,
      perguntaID: perguntaID,
    }).then(() => {
      res.redirect("/pergunta/" + perguntaID);
    });
  }
});

//conexao bem sucedida
app.listen(80, () => {
  console.log("App rodando");
});

import express from "express";
import sequelize from "./DB/db.js";

const app = express();
const port = 3000;

//Configurando EJS como motor de template
app.set('view engine', 'ejs');

//sincronizando Models do DB
sequelize.sync()
    .then(() => {
        console.log('Conexão e sincronização de tabelas realizadas');
    })
    .catch(err => {
        console.log('Erro ao conectar ao banco dedados', err);
    })

//dados para exibição
let pessoas = [
    {'nome': 'Israel', 'idade': '29', 'email': 'israel@email.com'},
    {'nome': 'Duda', 'idade': '26', 'email': 'duda@email.com'},
];

//rotas
app.get('/', (req, res) => {
    res.render('pages/index', {pessoas: pessoas});
});
app.get('/cadastro', (req,res) => {
    res.render('pages/cadastro');
})

app.listen(port, () =>{
    console.log("Inicializada em: http://localhost:3000/");

});
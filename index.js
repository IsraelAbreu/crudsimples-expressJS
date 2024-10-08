import express from "express";
import sequelize from "./DB/db.js";
import Pessoa from "./DB/Pessoa.js";

const app = express();
const port = 3000;

//Configurando EJS como motor de template
app.set('view engine', 'ejs');

//middleware para processar dados do formulário
app.use(express.urlencoded({extended: true}));

//sincronizando Models do DB
sequelize.sync()
    .then(() => {
        console.log('Conexão e sincronização de tabelas realizadas');
    })
    .catch(err => {
        console.log('Erro ao conectar ao banco dedados', err);
    })

//rotas
app.get('/', async (req, res) => {
    //dados para exibição
    try {
        const pessoas =  await Pessoa.findAll();
        // res.json(pessoas);
        res.render('pages/index', {pessoas: pessoas});
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro ao buscar pessoas no banco');
    }
    
});
app.get('/cadastro', (req,res) => {
    res.render('pages/cadastro');
})

app.post('/salvar-pessoa', async (req, res) => {
    const {nome, idade, email} = req.body;
    try {
        const novaPessoa = await Pessoa.create({nome, idade, email});
        res.redirect('/')
    } catch (errr) {
        console.log(err);
        res.status(500).send('Erro ao cadastrar pessoa')
    }
});

app.listen(port, () =>{
    console.log("Inicializada em: http://localhost:3000/");

});
import express from "express";
import sequelize from "./DB/db.js";
import Pessoa from "./DB/Pessoa.js";
import {dirname} from 'path';
import path from 'path';
import { fileURLToPath } from "url";

const _filename =  fileURLToPath(import.meta.url);
const __dirname =  dirname(_filename);

const app = express();
const port = 3000;

//Configurando EJS como motor de template
app.set('view engine', 'ejs');

//middleware para servir os arquivos státicos do bootstrap no projeto.
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))

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

app.get('/editar/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const pessoa = await Pessoa.findByPk(id);
        if (pessoa) {
            res.render('pages/editar', {pessoa});
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Erro ao realizar a busca da pessoa');
    }
    
})

app.post('/atualizar/:id', async(req, res) => {
    const {id} = req.params;
    const {nome, idade, email} = req.body;
   try {
    const pessoa = await Pessoa.findByPk(id);
    if (pessoa) {
        pessoa.nome = nome;
        pessoa.idade = idade;
        pessoa.email = email;
        await pessoa.save();
        res.redirect('/');
    } else{
        res.status(404).send('Pessoa não encontrada');
    }
   } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar usuário no banco de dados');
   } 
});

app.post('/delete/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const pessoa =  await Pessoa.findByPk(id);
        if (pessoa) {
            await pessoa.destroy();
            res.redirect('/');
        } else {
            res.status(404).send('Pessoa não encontrada');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar está pessoa');
    }
})

app.listen(port, () =>{
    console.log("Inicializada em: http://localhost:3000/");

});
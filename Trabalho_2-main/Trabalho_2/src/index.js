const express = require('express');
const bodyParser = require('body-parser');
const { adicionarPontos, gerarClassificacao } = require('./funcoes');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(morgan('dev')); 

app.get('/', async (req, res) => {
    const classificacao = await gerarClassificacao();
    res.render('classificacao', { classificacao });
});


app.get('/lancamento', (req, res) => {
    res.render('lancamento'); 
});

app.post('/lancamento', async (req, res) => {
    const { equipe, pontos } = req.body;

    if (!equipe || isNaN(pontos) || (pontos !== '1' && pontos !== '3')) {
        return res.status(400).send('Dados inválidos!');
    }

    await adicionarPontos(equipe, parseInt(pontos));
    res.redirect('/'); 
});


app.get('/status', (req, res) => {
    res.send('OK'); 
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

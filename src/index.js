const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { adicionarPontos, gerarClassificacao } = require('./funcoes');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    const classificacao = gerarClassificacao();

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Quadro de Classificação</title>
        <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet">
        <style>
            body {
                font-family: 'Poppins', sans-serif;
                margin: 50px;
                background-color: #f0f0f0;
            }
            h1 {
                text-align: center;
            }
            table {
                width: 50%;
                margin: auto;
                border-collapse: collapse;
                background-color: #fff;
            }
            th, td {
                padding: 10px;
                border: 1px solid #ccc;
                text-align: center;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h1>Quadro de Classificação</h1>
        <table>
            <tr>
                <th>Posição</th>
                <th>Equipe</th>
                <th>Pontuação</th>
            </tr>`;

    if (classificacao.length === 0) {
        html += `
            <tr>
                <td colspan="3">Nenhuma pontuação registrada.</td>
            </tr>`;
    } else {
        classificacao.forEach((item, index) => {
            html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.equipe}</td>
                <td>${item.pontuacao}</td>
            </tr>`;
        });
    }

    html += `
        </table>
    </body>
    </html>`;

    res.send(html);
});

app.get('/lancamento', (req, res) => {
    const equipesDisponiveis = ['Equipe A', 'Equipe B', 'Equipe C', 'Equipe D'];
    const pontosOpcoes = [1, 3];

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Lançamento de Pontos</title>
        <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet">
        <style>
            body {
                font-family: 'Poppins', sans-serif;
                margin: 50px;
                background-color: #f0f0f0;
            }
            h1 {
                text-align: center;
            }
            form {
                width: 50%;
                margin: auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            label {
                display: block;
                margin-bottom: 10px;
                font-weight: bold;
            }
            select, input[type="submit"] {
                width: 100%;
                padding: 10px;
                margin-bottom: 20px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            input[type="submit"] {
                background-color: #4CAF50;
                color: white;
                cursor: pointer;
            }
            input[type="submit"]:hover {
                background-color: #45a049;
            }
            .message {
                text-align: center;
                color: green;
            }
        </style>
    </head>
    <body>
        <h1>Lançamento de Pontos</h1>
        <form method="POST" action="/lancamento">
            <label for="equipe">Equipe:</label>
            <select name="equipe" id="equipe" required>
                <option value="" disabled selected>Selecione uma equipe</option>`;

    equipesDisponiveis.forEach(equipe => {
        html += `<option value="${equipe}">${equipe}</option>`;
    });

    html += `
            </select>

            <label for="pontos">Quantidade de Pontos:</label>
            <select name="pontos" id="pontos" required>
                <option value="" disabled selected>Selecione a quantidade de pontos</option>`;

    pontosOpcoes.forEach(ponto => {
        html += `<option value="${ponto}">${ponto}</option>`;
    });

    html += `
            </select>

            <input type="submit" value="Lançar Pontos">
        </form>
    </body>
    </html>`;

    res.send(html);
});

app.post('/lancamento', (req, res) => {
    const { equipe, pontos } = req.body;

    try {
        const pontosNumber = parseInt(pontos, 10);
        adicionarPontos(equipe, pontosNumber);

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Lançamento de Pontos</title>
            <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet">
            <meta http-equiv="refresh" content="3; url=/lancamento" />
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    margin: 50px;
                    background-color: #f0f0f0;
                    text-align: center;
                }
                .message {
                    font-size: 1.2em;
                    color: green;
                }
            </style>
        </head>
        <body>
            <p class="message">Pontos adicionados com sucesso para a ${equipe}!</p>
            <p>Você será redirecionado de volta em 3 segundos...</p>
        </body>
        </html>
        `);
    } catch (error) {
        res.status(400).send('Erro ao adicionar pontos: ' + error.message);
    }
});

app.get('/status', (req, res) => {
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

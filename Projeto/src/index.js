const express = require('express');
const bodyParser = require('body-parser');
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

    classificacao.forEach((item, index) => {
        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.equipe}</td>
            <td>${item.pontuacao}</td>
        </tr>`;
    });

    html += `
        </table>
    </body>
    </html>`;

    res.send(html);
});

app.route('/lancamento')
    .get((req, res) => {
        const equipesDisponiveis = ['Equipe A', 'Equipe B', 'Equipe C'];

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Cadastro de Pontuação</title>
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
                    font-size: 1.2em;
                    color: green;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>Cadastro de Pontuação</h1>
            <form id="pontuacaoForm" method="POST">
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
                    <option value="1">1</option>
                    <option value="3">3</option>
                </select>

                <input type="submit" value="Enviar">
                <div id="message" class="message"></div>
            </form>

            <script>
                document.getElementById('pontuacaoForm').addEventListener('submit', function(event) {
                    event.preventDefault();

                    const formData = new FormData(this);
                    const data = new URLSearchParams();
                    for (const pair of formData) {
                        data.append(pair[0], pair[1]);
                    }

                    fetch('/lancamento', {
                        method: 'POST',
                        body: data
                    })
                    .then(response => response.text())
                    .then(result => {
                        document.getElementById('message').innerText = 'Pontos adicionados com sucesso!';
                        document.getElementById('message').style.color = 'green';
                    })
                    .catch(error => {
                        document.getElementById('message').innerText = 'Erro ao adicionar pontos.';
                        document.getElementById('message').style.color = 'red';
                    });
                });
            </script>
        </body>
        </html>`;

        res.send(html);
    })
    .post((req, res) => {
        const { equipe, pontos } = req.body;

        try {
            const pontosNumber = parseInt(pontos, 10);
            adicionarPontos(equipe, pontosNumber);

            res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Pontuação Adicionada</title>
                <style>
                    body {
                        font-family: 'Poppins', sans-serif;
                        margin: 50px;
                        background-color: #f0f0f0;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <p class="message">Pontos adicionados com sucesso para a ${equipe}!</p>
                <p>Para ver a classificação atualizada, <a href="/">clique aqui</a>.</p>
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

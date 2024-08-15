const fs = require('fs');
const path = require('path');

const pontuacaoPath = path.join(__dirname, 'pontuacao.json');

function adicionarPontos(equipe, pontos) {
    if (!equipe || typeof pontos !== 'number' || pontos <= 0) {
        throw new Error('Parâmetros inválidos para adicionar pontos.');
    }

    let dados = {};
    if (fs.existsSync(pontuacaoPath)) {
        const conteudo = fs.readFileSync(pontuacaoPath, 'utf-8');
        try {
            dados = JSON.parse(conteudo);
        } catch (error) {
            dados = {};
        }
    }

    if (dados[equipe]) {
        dados[equipe] += pontos;
    } else {
        dados[equipe] = pontos;
    }

    fs.writeFileSync(pontuacaoPath, JSON.stringify(dados, null, 4), 'utf-8');
}

function gerarClassificacao() {
    if (!fs.existsSync(pontuacaoPath)) {
        return [];
    }

    const conteudo = fs.readFileSync(pontuacaoPath, 'utf-8');
    let dados = {};

    try {
        dados = JSON.parse(conteudo);
    } catch (error) {
        return [];
    }

    const arrayClassificacao = Object.entries(dados).map(([equipe, pontuacao]) => {
        return { equipe, pontuacao };
    });

    arrayClassificacao.sort((a, b) => b.pontuacao - a.pontuacao);

    return arrayClassificacao;
}

module.exports = {
    adicionarPontos,
    gerarClassificacao
};

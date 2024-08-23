const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pontuacao.json');


function adicionarPontos(equipe, pontos) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        let pontuacoes = JSON.parse(data || '{}');

        if (pontuacoes[equipe]) {
            pontuacoes[equipe] += pontos;
        } else {
            pontuacoes[equipe] = pontos; 
        }

        fs.writeFileSync(filePath, JSON.stringify(pontuacoes, null, 2));
    } catch (error) {
        console.error('Erro ao adicionar pontos:', error);
        throw new Error('Erro ao adicionar pontos');
    }
}

function gerarClassificacao() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        let pontuacoes = JSON.parse(data || '{}');

        const classificacao = Object.keys(pontuacoes)
            .map(equipe => ({
                equipe,
                pontuacao: pontuacoes[equipe]
            }))
            .sort((a, b) => b.pontuacao - a.pontuacao);

        return classificacao;
    } catch (error) {
        console.error('Erro ao gerar a classificação:', error);
        throw new Error('Erro ao gerar a classificação');
    }
}

module.exports = { adicionarPontos, gerarClassificacao };

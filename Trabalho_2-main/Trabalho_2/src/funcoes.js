const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/pontuacao.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS pontuacao (
        equipe TEXT PRIMARY KEY,
        pontos INTEGER
    )`);
});

const adicionarPontos = (equipe, pontos) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(`SELECT * FROM pontuacao WHERE equipe = ?`, [equipe], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (row) {
                    const novosPontos = row.pontos + pontos;
                    db.run(`UPDATE pontuacao SET pontos = ? WHERE equipe = ?`, [novosPontos, equipe], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                } else {
                    db.run(`INSERT INTO pontuacao (equipe, pontos) VALUES (?, ?)`, [equipe, pontos], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }
            });
        });
    });
};

const gerarClassificacao = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM pontuacao ORDER BY pontos DESC`, [], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

module.exports = { adicionarPontos, gerarClassificacao };

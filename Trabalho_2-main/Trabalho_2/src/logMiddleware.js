const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'logs.txt');

module.exports = (req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile(logFile, log, (err) => {
        if (err) console.error('Erro ao escrever log:', err);
    });
    next();
};

const Sequelize = require("sequelize");

const connection = new Sequelize('autoseguro', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "+01:00",
    dialectOptions: {
        insecureAuth: true // Configuração para permitir autenticação não segura
    }
});

module.exports = connection;
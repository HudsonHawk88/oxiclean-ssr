const path = require('path');

module.exports = {
    apps: [
        {
            name: 'oxiclean',
            script: path.resolve(__dirname, '../dist/server.js'),
            instances: 'max',
            exec_mode: 'cluster',
            // Az env blokknak az appon BELÜL kell lennie:
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
                HOST: '127.0.0.1'
            }
        }
    ]
};
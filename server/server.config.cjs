const path = require('path');

module.exports = {
    max_memory_restart: '2048M',
    apps: [
        {
            name: 'oxiclean',
            script: path.resolve(__dirname, '../dist/server.js'),
            instances: 'max',
            exec_mode: 'cluster'
        }
    ],
    env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '127.0.0.1' // default
    }
};
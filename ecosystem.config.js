module.exports = {
    apps: [
        {
            name: 'api-financ-teste',       // nome da sua aplicação
            script: 'dist/main.js',        // ponto de entrada
            cwd: './',                     // diretório de trabalho
            instances: 1,                  // “max” para cluster mode
            exec_mode: 'fork',             // ou 'cluster'
            watch: false,                  // true para reiniciar em mudanças
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            }
        }
    ]
};

/**
 * server.js
 * Ponto de entrada da aplicação.
 * Responsável por iniciar o servidor e ouvir as conexões.
 */

const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Inicia o servidor
const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Servidor MVC rodando com sucesso!`);
    console.log(`📡 Porta: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📅 Data: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`=========================================`);
});

// Tratamento de erros inesperados (Graceful Shutdown)
process.on('unhandledRejection', (err) => {
    console.error(`❌ Erro não tratado: ${err.message}`);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('🛑 Sinal SIGTERM recebido. Fechando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com segurança.');
    });
});

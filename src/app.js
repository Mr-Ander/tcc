const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const plantRoutes = require('./routes/plantRoutes');
const commentRoutes = require('./routes/commentRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

// Configurações do View Engine (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Arquivos Estáticos (CSS, JS, Imagens)
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/img', express.static(path.join(__dirname, '../img')));
// Servir arquivos da raiz (como manifestos ou favicon se existirem)
app.use(express.static(path.join(__dirname, '../')));

// Rotas de Visualização (SSR)
app.use('/', viewRoutes);

// Rotas da API
app.use('/api', userRoutes);
app.use('/api/plantas', plantRoutes);
app.use('/api/comentarios', commentRoutes);

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(500).json({
        error: 'Ocorreu um erro interno no servidor.',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;

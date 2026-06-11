const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const plantRoutes = require('./routes/plantRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Rotas
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

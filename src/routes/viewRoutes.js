const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Início' }));
router.get('/login', (req, res) => res.render('login', { title: 'Entrar' }));
router.get('/cadastro', (req, res) => res.render('cadastro', { title: 'Cadastrar Planta' }));
router.get('/detalhes', (req, res) => res.render('detalhes', { title: 'Detalhes da Planta' }));
router.get('/painel-admin', (req, res) => res.render('painel-admin', { title: 'Painel Admin' }));
router.get('/pendentes', (req, res) => res.render('pendentes', { title: 'Plantas Pendentes' }));
router.get('/gerenciar-admins', (req, res) => res.render('gerenciar-admins', { title: 'Gerenciar Admins' }));

module.exports = router;

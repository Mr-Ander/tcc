const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
    static async register(req, res) {
        const { username, nome, email, senha } = req.body;
        try {
            const userId = await User.create({ username, nome, email, senha });
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: userId });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: 'Username ou email já cadastrado!' });
            } else {
                res.status(500).json({ error: 'Erro no servidor' });
            }
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body;
        try {
            const user = await User.findByEmail(email);
            if (user && await User.checkPassword(senha, user.senha)) {
                const token = jwt.sign(
                    { id: user.id, is_admin: user.is_admin },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.json({
                    id: user.id,
                    username: user.username,
                    nome: user.nome,
                    email: user.email,
                    is_admin: user.is_admin,
                    token: token
                });
            } else {
                res.status(401).json({ error: 'Email ou senha incorretos!' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro no servidor' });
        }
    }

    static async getAdmins(req, res) {
        try {
            const admins = await User.findAllAdmins();
            res.json(admins);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar administradores' });
        }
    }

    static async addAdmin(req, res) {
        const { email } = req.body;
        try {
            const success = await User.promoteToAdmin(email);
            if (success) {
                res.json({ message: 'Usuário agora é administrador!' });
            } else {
                res.status(404).json({ error: 'Usuário não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao promover usuário' });
        }
    }

    static async removeAdmin(req, res) {
        try {
            const success = await User.demoteFromAdmin(req.params.id);
            if (success) {
                res.json({ message: 'Privilégios de administrador removidos!' });
            } else {
                res.status(404).json({ error: 'Administrador não encontrado!' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover administrador' });
        }
    }
}

module.exports = UserController;

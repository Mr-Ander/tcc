const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create({ username, nome, email, senha }) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const [result] = await db.execute(
            'INSERT INTO usuarios (username, nome, email, senha) VALUES (?, ?, ?, ?)',
            [username, nome, email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT id, username, nome, email, is_admin FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }

    static async findAllAdmins() {
        const [rows] = await db.execute('SELECT id, username, nome, email, data_cadastro FROM usuarios WHERE is_admin = TRUE');
        return rows;
    }

    static async promoteToAdmin(email) {
        const [result] = await db.execute('UPDATE usuarios SET is_admin = TRUE WHERE email = ?', [email]);
        return result.affectedRows > 0;
    }

    static async demoteFromAdmin(id) {
        const [result] = await db.execute('UPDATE usuarios SET is_admin = FALSE WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async checkPassword(inputPassword, hashedPassword) {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }
}

module.exports = User;

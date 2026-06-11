const db = require('../config/db');

class Plant {
    static async findAll(status = null) {
        let query = 'SELECT * FROM plantas';
        let params = [];
        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM plantas WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ nome, especie, categoria, local_encontro, observacoes, foto, usuario_id }) {
        const [result] = await db.execute(
            'INSERT INTO plantas (nome, especie, categoria, local_encontro, observacoes, foto, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nome, especie, categoria, local_encontro, observacoes, foto, usuario_id]
        );
        return result.insertId;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute('UPDATE plantas SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM plantas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Plant;

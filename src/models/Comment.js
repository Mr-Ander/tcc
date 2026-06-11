const db = require('../config/db');

class Comment {
    static async findByPlantId(plantaId) {
        const [rows] = await db.execute(
            `SELECT c.*, u.username FROM comentarios c 
             JOIN usuarios u ON c.usuario_id = u.id 
             WHERE c.planta_id = ? ORDER BY c.data_criacao DESC`,
            [plantaId]
        );
        return rows;
    }

    static async create({ planta_id, usuario_id, conteudo }) {
        const [result] = await db.execute(
            'INSERT INTO comentarios (planta_id, usuario_id, conteudo) VALUES (?, ?, ?)',
            [planta_id, usuario_id, conteudo]
        );
        return result.insertId;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM comentarios WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Comment;

const Comment = require('../models/Comment');

class CommentController {
    static async getByPlantId(req, res) {
        try {
            const comments = await Comment.findByPlantId(req.params.plantaId);
            res.json(comments);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar comentários' });
        }
    }

    static async create(req, res) {
        const { planta_id, conteudo } = req.body;
        const usuario_id = req.user.id; // Pegando do token JWT
        try {
            const commentId = await Comment.create({ planta_id, usuario_id, conteudo });
            res.status(201).json({ message: 'Comentário adicionado!', id: commentId });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar comentário' });
        }
    }

    static async delete(req, res) {
        try {
            const success = await Comment.delete(req.params.id);
            if (success) {
                res.json({ message: 'Comentário removido!' });
            } else {
                res.status(404).json({ error: 'Comentário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover comentário' });
        }
    }
}

module.exports = CommentController;

const Plant = require('../models/Plant');

class PlantController {
    static async getAll(req, res) {
        const { status } = req.query;
        try {
            const plants = await Plant.findAll(status);
            res.json(plants);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar plantas' });
        }
    }

    static async getById(req, res) {
        try {
            const plant = await Plant.findById(req.params.id);
            if (plant) {
                res.json(plant);
            } else {
                res.status(404).json({ error: 'Planta não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar planta' });
        }
    }

    static async create(req, res) {
        const { nome, especie, categoria, local_encontro, observacoes, foto } = req.body;
        const usuario_id = req.user.id; // Pegando do token JWT
        try {
            const plantId = await Plant.create({
                nome, especie, categoria, local_encontro, observacoes, foto, usuario_id
            });
            res.status(201).json({ message: 'Planta cadastrada e aguardando aprovação!', id: plantId });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao salvar planta' });
        }
    }

    static async updateStatus(req, res) {
        const { status } = req.body;
        try {
            const success = await Plant.updateStatus(req.params.id, status);
            if (success) {
                res.json({ message: 'Status da planta atualizado!' });
            } else {
                res.status(404).json({ error: 'Planta não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar planta' });
        }
    }

    static async delete(req, res) {
        try {
            const success = await Plant.delete(req.params.id);
            if (success) {
                res.json({ message: 'Planta removida!' });
            } else {
                res.status(404).json({ error: 'Planta não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover planta' });
        }
    }
}

module.exports = PlantController;

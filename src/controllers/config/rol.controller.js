import { pool } from '../../db.js';

export const getRoles = async (req, res) => {
    try {
        const [roles] = await pool.query('SELECT * FROM roles');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const [role] = await pool.query('SELECT * FROM roles WHERE id = ?', [id]);
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const createRole = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const [role] = await pool.query('INSERT INTO roles (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
        res.json({
            message: 'Rol creado',
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        await pool.query('UPDATE roles SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
        res.json({
            message: 'Rol actualizado',
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM roles WHERE id = ?', [id]);
        res.json({
            message: 'Rol eliminado con éxito',
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};
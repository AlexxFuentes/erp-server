import { pool } from '../../db.js';

// Obtener roles asignados a un usuario
export const getUserRoles = async (req, res) => {
    try {
        const { userId } = req.params;

        // Consultar los roles asignados al usuario
        const [rows] = await pool.query(
            'SELECT r.id, r.nombre, r.descripcion FROM roles r JOIN users_roles ur ON r.id = ur.fk_role WHERE ur.fk_user = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Este usuario no tiene roles asignados' });
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Asignar un nuevo rol a un usuario (cuando el rol se "arrastra")
export const addUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { roleId, fk_created_by } = req.body; // roleId es el ID del rol que se "arrastra"

        // Verificar si el rol ya está asignado
        const [existingRole] = await pool.query(
            'SELECT * FROM users_roles WHERE fk_user = ? AND fk_role = ?',
            [userId, roleId]
        );

        if (existingRole.length > 0) {
            return res.status(400).json({ message: 'Este rol ya está asignado al usuario' });
        }

        // Insertar el nuevo rol
        await pool.query(
            'INSERT INTO users_roles (fk_user, fk_role, fk_created_by) VALUES (?, ?, ?)',
            [userId, roleId, fk_created_by]
        );

        res.json({ message: 'Rol asignado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un rol de un usuario (cuando el rol se "retira")
export const removeUserRole = async (req, res) => {
    try {
        const { userId, roleId } = req.params;

        // Eliminar el rol asignado al usuario
        const [result] = await pool.query(
            'DELETE FROM users_roles WHERE fk_user = ? AND fk_role = ?',
            [userId, roleId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado para este usuario' });
        }

        res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
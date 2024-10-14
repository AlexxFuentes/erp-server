import { pool } from '../../db.js';

export const getUsers = async (req, res) => {
    try {
        const [response] = await pool.query('SELECT * FROM users');
        res.json(response);
    } catch (error) {
        console.log(error);
    }
};
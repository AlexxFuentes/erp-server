import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TOKEN_SECRET } from '../../config.js';
import { createAccessToken } from '../../libs/jwt.js';
import { pool } from '../../db.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Verificar si el usuario ya existe
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            return res.status(400).json('El usuario ya existe');
        }

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardar usuario en la base de datos
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, passwordHash]
        );

        // Crear token de acceso
        const accessToken = await createAccessToken({
            id: newUser.rows[0].id,
            email: newUser.rows[0].email,
        });

        // Guardar token en una cookie
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // retornar datos del usuario registrado
        res.json(newUser.rows[0]);

    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json('Usuario o contraseña incorrectos');
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json('Contraseña incorrecta');
        }

        // Crear token de acceso
        const accessToken = await createAccessToken({
            id: user.rows[0].id,
            email: user.rows[0].email,
        });

        // Guardar token en una cookie
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // retornar datos del usuario logueado
        res.json(user.rows[0]);

    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const verifyToken = async (req, res) => {

    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'No token, acceso denegado!!' });

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {

        if (error) return res.status(401).json({ message: 'Token no válido' });

        const userFind = await pool.query('SELECT * FROM users WHERE id = $1', [user.id]);

        if (userFind.rowCount === 0) return res.status(401).json({ message: 'Usuario no encontrado o no autorizado' });

        return res.json(userFind.rows[0]);
    });

};

export const logout = async (req, res) => {

    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'No token, acceso denegado' });

    // Eliminar token de la cookie
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        sameSite: 'none',
    });

    return res.status(200).json({ message: 'Sesión cerrada' });
};
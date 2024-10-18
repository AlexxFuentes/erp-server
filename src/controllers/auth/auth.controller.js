import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TOKEN_SECRET } from '../../config.js';
import { createAccessToken } from '../../libs/jwt.js';
import { pool } from '../../db.js';

export const register = async (req, res) => {
    try {
        const { user, name, email, password } = req.body

        // Verificar si el usuario ya existe
        const [user_find] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (user_find.length > 0) return res.status(400).json({ message: 'El usuario ya existe'});

        // Verificar si el usuario ya existe
        const [user_find2] = await pool.query(
            'SELECT * FROM users WHERE usuario = ?', 
            [user]
        );

        if (user_find2.length > 0) return res.status(400).json({ message: 'El nombre usuario ya existe'});
        
        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardar usuario en la base de datos
        const [result] = await pool.query(
            'INSERT INTO users (usuario, nombre, correo, password) VALUES (?, ?, ?, ?)',
            [user, name, email, passwordHash]
        );

        // Obtener el ID del nuevo usuario
        const newUserId = result.insertId;
        // Hacer una consulta para obtener los datos insertados
        const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [newUserId]);

        // Crear token de acceso
        const accessToken = await createAccessToken({
            id: newUser.id,
            email: newUser.email,
        });

        // Guardar token en una cookie
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // retornar datos del usuario registrado
        res.json(newUser);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (users.length === 0) return res.status(400).json({ message: 'Usuario o contraseña incorrectos'});

        const user = users[0]; // Acceder al primer usuario encontrado
        
        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {

            // actualizar intentos fallidos
            await pool.query(
                `UPDATE users A SET 
                    intentos = A.intentos + 1, 
                    bloqueado = CASE WHEN A.bloqueado >= 3 THEN TRUE ELSE A.bloqueado END
                WHERE A.id = ?`,
                [user.id]
            );

            // Verificar si el usuario ha sido bloqueado
            const [updatedLoginUser] = await pool.query('SELECT * FROM users WHERE id = ?', [user.id]);
            if (updatedLoginUser[0].bloqueado) {
                return res.status(400).json({ message: 'Usuario bloqueado' });
            }

            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // verificar si el usuario ha sido bloqueado
        if (user.bloqueado) return res.status(400).json({ message: 'Usuario bloqueado' });

        // Crear token de acceso
        const accessToken = await createAccessToken({
            id: user.id,
            email: user.email,
        });

        // Guardar token en una cookie
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        // retornar datos del usuario logueado
        res.json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

export const verifyToken = async (req, res) => {

    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'Sin token, acceso denegado!!' });

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {

        if (error) return res.status(401).json({ message: 'Token no válido' });

        const [userFind] = await pool.query('SELECT * FROM users WHERE id = ?', [user.id]);

        if (userFind.length === 0) return res.status(401).json({ message: 'Usuario no encontrado o no autorizado' });

        return res.json(userFind[0]);
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
import dotenv from 'dotenv';

/**
 * Carga las variables de entorno del archivo .env
 * @module config
 */
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// variables de entorno para la base de datos
export const DB_USER = process.env.DB_USER;
export const DB_HOST = process.env.DB_HOST;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PORT = process.env.DB_PORT;
import mysql from 'mysql2/promise';
import { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE } from './config.js';

export const pool = mysql.createPool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_DATABASE,
});


import { TOKEN_SECRET } from '../config.js'
import jwt from 'jsonwebtoken'

/**
 * Función para crear un token de acceso.
 * 
 * @param {Object} payload data para crear el token
 * @returns token generado
 */
export async function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, TOKEN_SECRET, {expiresIn: '1d'}, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

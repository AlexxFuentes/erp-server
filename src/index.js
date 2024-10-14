import app from './app.js';
import { PORT } from './config.js';

/**
 * Inicia la aplicación
 * @module index
 * @type {Function}
 * 
 * Inicia la aplicación, conecta a la base de datos y escucha en el puerto especificado.
 */
async function main(){
    try {
        app.listen(PORT);
        console.log('Server is running on port', PORT);
    } catch (error) {
        console.log(error);
    }
}

main();// Inicia la aplicación
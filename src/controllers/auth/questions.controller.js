import { pool } from '../../db.js';

export const getQuestionsByUser = async (req, res) => {
    try {
        const { user } = req.params;

        // Verificar si el usuario existe
        const [users] = await pool.query(
            'SELECT * FROM users WHERE usuario = ?', 
            [user]
        );

        if (users.length === 0) return res.status(400).json({ message: 'Usuario no encontrado'});

        const id = users[0].id;

        const [questions] = await pool.query('SELECT * FROM questions WHERE fk_user = ?', [id]);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const createQuestion = async (req, res) => {
    try {
        const { user, question, answer } = req.body;

        // Verificar si el usuario existe
        const [users] = await pool.query(
            'SELECT * FROM users WHERE usuario = ?', 
            [user]
        );

        if (users.length === 0) return res.status(400).json({ message: 'Usuario no encontrado'});

        const id = users[0].id;

        await pool.query('INSERT INTO questions (pregunta, respuesta, fk_user) VALUES (?, ?)', [question, answer, id]);
        res.json({
            message: 'Pregunta creada con éxito',
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        await pool.query('UPDATE questions SET pregunta = ?, respuesta = ? WHERE id = ?', [question, answer, id]);
        res.json({
            message: 'Pregunta actualizada con éxito',
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM questions WHERE id = ?', [id]);
        res.json({
            message: 'Pregunta eliminada con éxito',
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// validar las respuestas de las preguntas de seguridad

/*
{
    "user": "usuario",
    "data": [{
        "question": "¿Cuál es tu color favorito?",
        "answer": "azul"
    }, {
        "question": "¿Cuál es tu comida favorita?",
        "answer": "pizza"
    }]
}
*/
export const validateQuestions = async (req, res) => {
    try {
        const { user } = req.params;
        const { data } = req.body;

        // Verificar si el usuario existe
        const [users] = await pool.query(
            'SELECT * FROM users WHERE usuario = ?', 
            [user]
        );

        if (users.length === 0) return res.status(400).json({ message: 'Usuario no encontrado'});

        const id = users[0].id;

        const [questions] = await pool.query(
            'SELECT * FROM questions WHERE fk_user = ?',
            [id]
        );

        // Si no hay preguntas para este usuario
        if (questions.length === 0) return res.status(400).json({ message: 'No se encontraron preguntas para este usuario' });

        for (const item of data) {
            const { question, answer } = item;

            // Buscar la pregunta en la base de datos
            const question_find = questions.find(q => q.pregunta === question);

            if (!question_find) {
                return res.status(400).json({ message: `Pregunta "${question}" no encontrada` });
            }

            if (question_find.respuesta !== answer) {
                return res.status(400).json({ message: `Respuesta incorrecta para la pregunta "${question}"` });
            }
        }

        res.json({
            message: 'Respuestas correctas',
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

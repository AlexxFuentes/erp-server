import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { FRONTEND_URL } from './config.js';
import UserRoutes from './routes/user.routes.js';
import AuthRoutes from './routes/auth.routes.js';
import RoleRoutes from './routes/rol.routes.js';
import UserRoleRoutes from './routes/user_role.routes.js';
import QuestionsRoutes from './routes/questions.routes.js';

const app = express();

// Middlewares
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: 'GET, HEAD, PUT, POST, DELETE',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', UserRoutes);
app.use('/auth', AuthRoutes);
app.use('/role', RoleRoutes);
app.use('/user-role', UserRoleRoutes);
app.use('/questions', QuestionsRoutes);

app.use((req, res, next) => {
    console.log('Request Origin:', req.headers.origin);
    next();
});

export default app;
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import loggers from './utils/loggers.js';
import noteRouter from './controllers/notes.js';
import config from './utils/config.js';
import middleware from './utils/middleware.js';
import usersRouter from './controllers/users.js';

const app = express();

mongoose.set('strictQuery', false);

console.log('connecting to', config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)

	.then((result) => {
		loggers.info('connected to MongoDB');
	})
	.catch((error) => {
		loggers.error('error connecting to MongoDB:', error.message);
	});

// Middlewares

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.use('/api/notes', noteRouter);
app.use('/api/users', usersRouter);

app.use(middleware.requestLogger);

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

export default app;

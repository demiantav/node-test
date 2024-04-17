import loggers from './loggers.js';

const requestLogger = (request, response, next) => {
	loggers.info('Method:', request.method);
	loggers.info('Path:  ', request.path);
	loggers.info('Body:  ', request.body);
	loggers.info('---');
	next();
};

// Mediante este middleware toda peticion que llegue y no coincida con alguna de las rutas termina en este middle
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
		return response.status(400).json({ error: 'expected `username` to be unique' });
	}

	if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'token invalid' });
	}
};

export default { requestLogger, unknownEndpoint, errorHandler };

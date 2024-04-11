import { Router } from 'express';
import Note from '../models/note.js';
import User from '../models/user.js';
import loggers from '../utils/loggers.js';

const noteRouter = Router();

noteRouter.get('/', async (request, response) => {
	const notes = await Note.find({});
	response.json(notes);
});

noteRouter.get('/:id', async (request, response, next) => {
	const { id } = request.params;

	try {
		const note = await Note.findById(id);

		// eslint-disable-next-line no-unused-expressions
		note ? response.json(note) : response.status(404).end();
	} catch (error) {
		next(error);
	}
});

noteRouter.delete('/:id', async (request, response, next) => {
	const { id } = request.params;

	try {
		await Note.findByIdAndDelete(id);

		response.status(204).end();
	} catch (error) {
		next(error);
	}
});

noteRouter.put('/:id', (request, response, next) => {
	const { content, important } = request.body;

	Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

noteRouter.post('/', async (request, response, next) => {
	const { body } = request;

	const user = await User.findById(body.userId);

	const note = new Note({
		content: body.content,
		important: body.important || false,
		user: user._id,
	});

	try {
		const savedNote = await note.save();
		user.notes = user.notes.concat(savedNote._id);
		await user.save();
		response.status(201).json(savedNote);
	} catch (exception) {
		next(exception);
	}
});

export default noteRouter;

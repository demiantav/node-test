import bcrypt from 'bcrypt';
import Router from 'express';
import User from '../models/user.js';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
	const users = await User.find({});
	response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
	const { username, name, password } = request.body;

	try {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const user = new User({
			username,
			name,
			passwordHash,
		});

		const savedUser = await user.save();

		response.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
});

export default usersRouter;

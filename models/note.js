import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minLength: 5,
		required: true,
	},

	important: Boolean,
});

const Note = mongoose.model(`Note`, noteSchema);

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export default Note;

import dotenv from 'dotenv';

import mongoose from 'mongoose';

dotenv.config();

const url = process.env.TEST_MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = mongoose.model('Note', noteSchema);

const notes = [
  { content: 'there are two notes', important: true },
  { content: `the first note is about HTTP methods`, important: true },
];

// Utiliza insertMany para guardar múltiples notas

Note.insertMany(notes)
  .then((result) => {
    console.log(`${result.length} notes saved!`);
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error saving notes:', error);
    mongoose.connection.close();
  });

// Note.find({}).then(result => {

//   result.forEach(note => {
//     console.log(note)
//   })

//   mongoose.connection.close()
// })

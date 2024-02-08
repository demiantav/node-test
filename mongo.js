import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose'





const url =process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

const notes = [
  { content: 'Nueva nota 5 8/2', important: true },
  {content: `Michael 2`, important: true}

];

// Utiliza insertMany para guardar múltiples notas

Note.insertMany(notes)
  .then(result => {
    console.log(`${result.length} notes saved!`);
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error saving notes:', error);
    mongoose.connection.close();
  });

// Note.find({}).then(result => {

//   result.forEach(note => {
//     console.log(note)
//   })

//   mongoose.connection.close()
// })
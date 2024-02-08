
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import Note from "./models/note.js"




const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
  
}



app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    },
    {
      id: 4,
      content: "Yes",
      important: true
    }
  ]


  

  


  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    }).catch(error =>{

      console.log(error)
    })
  })

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)


    if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  app.put('/api/notes/:id', (request, response) => {

    const id = Number(request.params.id);

  })

  app.post('/api/notes', (request, response) => {
    
    const body = request.body
    
    

    if(!body.content){

      return response.status(400).json({ 
        error: 'content missing' 
      })
    
    } else {

      const note = new Note({
        content: body.content,
        important: body.important || false,
      })

      // notes = notes.concat(note)
  
      // response.json(note)
      // console.log(note)

      note.save().then(savedNote => {
        response.json(savedNote);
        
      })
    }
  
    
  })

  const generateID = () => {

    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id)) 
      : 0

    return maxId + 1;




  }

  const PORT = process.env.PORT

  
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  })


  


import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import Note from "./models/note.js"


const app = express()


//Middlewares

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
  
}

app.use(requestLogger)

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

  app.get('/api/notes/:id', (request, response, next) => {
    
    const id =request.params.id

    Note.findById(id).then(note =>{

      if(note){

        response.json(note)
      
      } else {

        response.status(404).end();
      }
      
    })
    .catch(error => next(error))

    //const note = notes.find(note => note.id === id)


  //   if (note) {
  //   response.json(note)
  // } else {
  //   response.status(404).end()
  // }
  })

  app.delete('/api/notes/:id', (request, response, error) => {
    const id = request.params.id

    Note.findByIdAndDelete(id)
     .then(res => {
      response.status(204).end()
     })
     .catch(error => next(error))
   
  })

  app.put('/api/notes/:id', (request, response, next) => {

    const {content, important} = request.body;


    Note.findByIdAndUpdate(
      request.params.id,
      {content, important}, 
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))



  })

  app.post('/api/notes', (request, response, next) => {
    
    const body = request.body
    
    

    // if(!body.content){

    //   return response.status(400).json({ 
    //     error: 'content missing' 
    //   })
    
    // } else {

      const note = new Note({
        content: body.content,
        important: body.important || false,
      })

      note.save()
      .then(savedNote => {
        response.json(savedNote);
      })
      .catch(error => next(error))
    })

  //Mediante este middleware toda peticion que llegue y no coincida con alguna de las rutas termina en este middle
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })

  }
  
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  
  app.use(errorHandler)

  
  
  const PORT = process.env.PORT

  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  })


  

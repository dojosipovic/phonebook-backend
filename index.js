const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', { skip: (req, res) => req.method !== "POST"}))
app.use(cors())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const max = (persons.length + 1) * 100
  let id = Math.floor(Math.random() * max)

  while(persons.map(p => p.id).indexOf(id) !== -1) {
    id = Math.floor(Math.random() * max)
  }

  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name) return response.status(400).json({ error: 'name is missing' })
  if (!body.number) return response.status(400).json({ error: 'number is missing' })
  if (persons.find(p => p.name === body.name) !== undefined) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  
  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
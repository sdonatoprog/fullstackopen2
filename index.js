const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req, res),
  ].join(' ')
}))

let persons =
[
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  const date = Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    ${date.toString()}`
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id 
  const person = persons.find((person) => person.id === id)
  if (!person){
    return response.status(404).end()
  }
  response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id 
  persons = persons.filter((person) => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000) + 1
}

app.post("/api/persons", (request, response) => {
  const id = generateId()
  const body = request.body
  
  if (!body.name || !body.number)
  {
    return response.status(400).json(
      {
        error: "argument is missing"
      }
    )
  }

  const similarPerson = persons.find((person) => person.name == body.name)

  if (similarPerson)
  {
    return response.status(400).json(
      {
        error: "name already exists"
      }
    )
  }

  const newPerson = 
  {
    id: String(id),
    name: body.name,
    number: body.number
  }

  persons = [...persons, newPerson]

  response.json(persons)
})

const PORT = 3002
app.listen(process.env.PORT || PORT, () => console.log(`Server running on port ${PORT}`))
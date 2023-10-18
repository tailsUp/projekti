console.log('Tervetuloa BACKENDIIN - sisältöä ladataan.')
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
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
        content: "THIS COMES FROM BACKEND!!",
        important: true
    }
]

//Ottaa käyttöön Noden sisäänrakennetun web-palvelimen määrittelevän moduulin.
//const http = require('http')

/**
 * Funktio (get route) palauttaa html elementin. Response statuskoodi 200.
 */
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

/**
 * Funktio generoi uuden id:n.
 * 
 * Mitä rivillä tapahtuu? notes.map(n => n.id) muodostaa taulukon, joka koostuu muistiinpanojen id-kentistä. 
 * Math.max palauttaa maksimin sille parametrina annetuista luvuista. notes.map(n => n.id) on kuitenkin taulukko, 
 * joten se ei kelpaa parametriksi komennolle Math.max. Taulukko voidaan muuttaa yksittäisiksi luvuiksi käyttäen 
 * taulukon spread-syntaksia, eli kolmea pistettä ...taulukko.
 * 
 * @returns int.
 */
const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
}

/**
 * Funktio hakee kaikki tietokannassa olevat notet ja palauttaa ne (REST toiminnallisuus).
 */
app.get('/api/notes', (request, response) => {
    response.json(notes)
})

/**
 * Funktio lisää uuden note olion tietokantaan. Funktio ottaa uuden 'olion' vastaan osana requestin bodya.
 * Jos body on tyhjä niin palautetaan error.
 */
app.post('/api/notes', (request, response) => {
    console.log("NOTES")
    const body = request.body
  
    if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
})

/**
 * Funktio palauttaa boten id:n perusteella (REST toiminnallisuus). Requestille annetaan parametrinä (params) 
 * noten id.
 */
app.get('/api/notes/:id', (request, response) => {
    console.log("NOTES/ID")
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) 
    {    
        response.json(note)  
    } 
    else 
    {    
        response.status(404).end()
    }
})

/**
 * Funktio poistaa noten tietokannasta id:n perusteella. Id laitetaan osaksi paramatriä (params) ja lähetetään
 * osana requestia eteenpäin (REST toiminnallisuus). Jos poisto onnistuu eli poistettava muistiinpano on olemassa, 
 * vastataan statuskoodilla 204 no content sillä mukaan ei lähetetä mitään dataa.
 */
app.delete('/api/delete/notes/:id', (request, response) => {
    console.log("DELETE NOTE")
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})

//Alla olevat rivit sitovat muuttujaan app sijoitetun http-palvelimen kuuntelemaan porttiin 3001 tulevia HTTP-pyyntöjä.
const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

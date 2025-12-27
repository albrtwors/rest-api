const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const {validate,validatePartialMovies }= require('./schemas/movies.js')
const app = express()
const PATHS= ['http://localhost:8080', 'http://midu.dev']
app.disable('x-powered-by')
app.use(express.json())
app.get('/', (req,res)=>{
    res.send('<h1> Hello World </h1>')
})

app.get('/movies', (req,res)=>{
    if(PATHS.includes(req.header('origin')) || !req.header('origin')) res.header('Access-Control-Allow-Origin', req.header('origin'))
    
    const {genre} = req.query
    if(genre){
        const filteredMovies = movies.filter(movie=>movie.genre.some(g=>g.toLowerCase()==genre.toLowerCase()))
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.patch('/movies/:id', (req,res)=>{
    const {id} = req.params
    const movieIndex = movies.findIndex(movie=>movie.id==id)

    if(movieIndex==-1) return res.status(400).json({message:'error'})
    
    const result = validatePartialMovies(req.body)

    if(result.error) return res.status(404).json({message:'movie not found'})
    
    const updatedMovie = {...movies[movieIndex], ...result.data}
    movies[movieIndex]=updatedMovie

    return res.status(201).json(updatedMovie)

})

app.post('/movies', (req,res)=>{

    const result = validate(req.body)

    if(result.error){
        return res.status(400).json({message:'error'})

    }
   
    const newMovie = {id:crypto.randomUUID(), ...result.data}
    movies.push(newMovie)
    return res.status(201).json(newMovie)
})
app.get('/movies/:id', (req,res)=>{



    const {id} = req.params
    
    const movie = movies.find(movie=>movie.id==id)
    
    if(movie) return res.json(movie)

    return res.status(404).json({'message':'not found'})
    
    



})

app.delete('/movies/:id', (req,res)=>{
    if(PATHS.includes(req.header('origin')) || !req.header('origin')) res.header('Access-Control-Allow-Origin', req.header('origin'))
    const {id}=req.params
    const movieIndex = movies.findIndex(movie=>movie.id==id)
    movies.splice(movieIndex,1)

    return res.status(200).json({message:'eliminada'})
})

app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin');
    if (PATHS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        // Optionally, specify headers if needed
        // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    res.sendStatus(200);

});

const PORT = process.env.PORT ?? 3000
app.listen(PORT,()=>{
    console.log('app listening on port 3000')
})
const z = require('zod')
const validatedMovie = z.object({
    title:z.string({required_error:'El titulo es requerido',invalid_type_error:'El tipo debe ser un string'}),
    year:z.number().int().min(1900),
    director:z.string(),
    duration:z.number(),
    poster:z.string(),
    genre:z.array(z.enum(['Action','Adventure','Comedy','Drama','Fantasy','Horror','Thriller','Sci-Fi','Crime', 'Romance'])),
    rate:z.number()

})

const validate = (object)=>{
    return validatedMovie.safeParse(object)
}
const validatePartialMovies = (object)=>{
    return validatedMovie.partial().safeParse(object)
}

module.exports = {validate, validatePartialMovies}
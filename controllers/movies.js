const { Movie } = require('../db');
const { Character } = require('../db');

const createMovie = async (req, res) => {

    try {

        const { image, title, creationDate, rating, characters, genre } = req.body;

        // Chequeo si existe la pelicula o serie
        let movie = await Movie.findOne({
            where: {
                title: title
            }
        });

        if (!movie) {
            // creo una pelicula o serie
            const newMovie = await Movie.create({
                image,
                title,
                creation_date: creationDate,
                rating
            });

            if (characters.length > 0)
                await newMovie.addCharacters(characters)
            if (!characters || characters.length === 0) {
                await newMovie.addCharacters([])
            }

            if (genre.length > 0)
                await newMovie.addGenres(genre)
            if (!genre || genre.length === 0) {
                await newMovie.addGenres("")
            }

            return res.status(200).send({
                success: true,
                movie: newMovie
            })
        }

        return res.status(400).send({
            success: false,
            message: "Ya existe un pelicula o serie con ese titulo"
        });


    } catch (err) {
        return res.status(500).send({
            error: err,
            message: "No se pudo crear la pelicula o serie"
        })
    }
};

const getMovies = async (req, res) => {

    const { title, genre } = req.query;

    const isEmpty = Object.keys(req.query).length === 0;

    try {

        if (isEmpty === false) {

            // Busco de acuerdo al filtro pasado

            if (title) {
                const movie = await Movie.findOne({
                    where: {
                        title: title
                    },
                    include: Character, Genre
                })

                if (movie) {
                    return res.status(200).send({
                        success: true,
                        movie: movie
                    })
                }

                return res.send({
                    success: false,
                    message: "No existe el personaje buscado"
                })
            }

            if (movieId) {
                const movie = await Movie.findOne({
                    where: {
                        id: movieId
                    },
                    include: Character, Genre
                })

                if (movie) {
                    return res.status(200).send({
                        success: true,
                        characters: movie.characters
                    })
                }

                return res.send({
                    success: false,
                    message: "No existe la pelicula o serie buscada"
                })
            }

        } else {

            const movies = await Movie.findAll({
                attributes: ['image', 'title', 'creation_date'],
                raw: true
            })

            if (movies.length > 0) {
                return res.status(200).send({
                    success: true,
                    movies: movies
                })
            }

            return res.send({
                success: false,
                message: "No hay peliculas o series creadas"
            })

        }

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err
        })
    }
};

const getMovieDetails = async (req, res) => {

    const { id } = req.params;

    try {

        const movie = await Movie.findOne({
            where: {
                id: id
            },
            include: Character, Genre
        })

        if (movie) {
            return res.status(200).send({
                success: true,
                movie: movie
            })
        }

        return res.send({
            success: false,
            message: "No se ha encontrado la pelicula o serie buscada"
        })

    } catch (err) {
        res.send({
            message: "Error al listar detalles de la pelicula/serie",
            error: err
        })
    }
};

const deleteMovie = async (req, res) => {

    const { id } = req.params;

    try {

        // Chequeo si el personaje fue eliminado antes
        const movie = await Movie.findOne({
            where: {
                id: id
            }
        })

        if (movie) {
            await Movie.destroy({
                where: {
                    id: id
                }
            })

            return res.status(200).send({
                success: true,
                message: "Pelicula o serie eliminada con exito"
            })
        }

        return res.send({
            message: "No hay pelicula o serie a eliminar"
        })


    } catch (err) {

        return res.send({
            error: err,
            message: "No se pudo eliminar la pelicula o serie"
        })

    }

};

const updateMovie = async (req, res) => {

    const { id } = req.params;
    const { characters, genre } = req.body;

    try {

        const movie = await Movie.findOne({
            where: {
                id: id
            }
        })

        if (!movie) {
            return res.status(200).send({
                success: false,
                message: "No existe la pelicula o serie a actualizar"
            })
        }

        const editedMovie = await Movie.update(req.body, {
            where: {
                id: id
            },
            returning: true,
            raw: true
        })

        if (characters.length > 0) {
            await movie.addCharacters(characters)
        }
        if (!characters || characters.length === 0) {
            await movie.addCharacters([])
        }

        if (genre.length > 0) {
            await movie.addGenres(genre)
        }
        if (!genre || genre.length === 0) {
            await movie.addGenres("")
        }

        return res.status(200).send({
            success: true,
            message: "Pelicula/Seria actualizada con exito",
            movie: editedMovie[1]
        })

    } catch (err) {
        return res.send({
            success: false,
            message: "Error al actualizar la pelicula/serie"
        })
    }
};


module.exports = { createMovie, getMovies, getMovieDetails, updateMovie, deleteMovie, }
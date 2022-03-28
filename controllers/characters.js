const { Character, Movie } = require('../db');

const createCharacter = async (req, res) => {

    try {

        const { name, movies } = req.body;

        // Chequeo si existe el personaje
        const character = await Character.findOne({
            where: {
                name: name
            }
        });

        if (!character) {
            // creo un personaje
            const newCharacter = await Character.create(req.body);

            if (movies.length > 0)
                await newCharacter.addMovies(movies)
            if (movies.length === 0 || !movies) {
                await newCharacter.addMovies([])
            }

            return res.status(200).send({
                success: true,
                character: newCharacter
            })
        }

        return res.send({
            success: false,
            message: "Ya existe un personaje con ese nombre"
        });


    } catch (err) {
        return res.status(500).send({
            error: err,
            message: "No se pudo crear el personaje"
        })
    }
};

const getCharacters = async (req, res) => {

    const { name, weight, movieId, age } = req.query;

    const isEmpty = Object.keys(req.query).length === 0;

    try {

        if (isEmpty === false) {

            // Busco de acuerdo al filtro pasado

            if (name) {
                const character = await Character.findOne({
                    where: {
                        name: name
                    },
                    include: [
                        {
                            model: Movie,
                            attributes: ['title', 'image', 'genreId']
                        }
                    ]
                })

                if (character) {
                    return res.status(200).send({
                        success: true,
                        character: character
                    })
                }

                return res.send({
                    success: false,
                    message: "No existe el personaje buscado"
                })
            }

            let query = {}

            if (age) {
                query = { age: age }
            }

            if (weight) {
                query = { weight: weight }
            }

            if (age || weight) {
                const characters = await Character.findAll({
                    where: query,
                    include: [
                        {
                            model: Movie,
                            attributes: ['title', 'image', 'genreId']
                        }
                    ]
                })

                if (characters.length > 0) {
                    return res.status(200).send({
                        success: true,
                        characters: characters
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
                    include: [
                        {
                            model: Character,
                            attributes: ['name', 'image']
                        }
                    ]
                })

                if (movie) {
                    return res.status(200).send({
                        success: true,
                        characters: movie.characters
                    })
                }

                return res.send({
                    success: false,
                    message: "No existe el personaje buscado"
                })
            }

        } else {

            const characters = await Character.findAll({
                raw: true,
                attributes: ['image', 'name']
            })

            if (characters.length > 0) {
                return res.status(200).send({
                    success: true,
                    characters: characters
                })
            }

            return res.send({
                success: false,
                message: "No hay personajes creados"
            })

        }

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err
        })
    }
};

const getCharacterDetails = async (req, res) => {

    const { id } = req.params;

    try {

        const character = await Character.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: Movie,
                    attributes: ['title', 'image', 'genreId']
                }
            ]
        })

        if (character) {
            return res.status(200).send({
                success: true,
                character: character
            })
        }

        return res.send({
            success: false,
            message: "No se ha encontrado el personaje buscado"
        })

    } catch (err) {
        res.send({
            message: "Error al listar detalles de personajes",
            error: err
        })
    }
};

const deleteCharacter = async (req, res) => {

    const { id } = req.params;

    try {

        // Chequeo si el personaje fue eliminado antes
        const character = await Character.findOne({
            where: {
                id: id
            }
        })

        if (character) {
            await Character.destroy({
                where: {
                    id: id
                }
            })

            return res.status(200).send({
                success: true,
                message: "Personaje eliminado con exito"
            })
        }

        return res.send({
            message: "No hay personaje a eliminar"
        })


    } catch (err) {

        return res.send({
            error: err,
            message: "No se pudo eliminar el personaje"
        })

    }

};

const updateCharacter = async (req, res) => {

    const { id } = req.params;
    const { movies } = req.body;

    try {

        let character = await Character.findOne({
            where: {
                id: id
            }
        })

        if (!character) {

            return res.status(200).send({
                success: false,
                message: "No existe personaje a actualizar"
            })
        }

        const editedCharacter = await Character.update(req.body, {
            where: {
                id: id
            },
            include: [
                {
                    model: Movie,
                    attributes: ['title', 'image', 'genreId']
                }
            ],
            returning: true,
            raw: true
        })

        if (movies.length > 0) {
            await character.addMovies(movies)
        } else {
            await character.addMovies([])
        }

        return res.status(200).send({
            success: true,
            message: "Personaje actualizado con exito",
            character: editedCharacter[1]
        })

    } catch (err) {
        return res.send({
            success: false,
            message: "Error al actualizar el personaje"
        })
    }
};

module.exports = { createCharacter, getCharacters, deleteCharacter, updateCharacter, getCharacterDetails }
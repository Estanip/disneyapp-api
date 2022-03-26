const { Film } = require('../db');
const { Character } = require('../db');

const createFilm = async (req, res) => {

    try {

        const { image, title, creationDate, rating, characters } = req.body;

        // Chequeo si existe la pelicula o serie
        let film = await Film.findOne({
            where: {
                title: title
            }
        });

        if (!film) {
            // creo una pelicula o serie
            const newFilm = await Film.create({
                image,
                title,
                creation_date: creationDate,
                rating
            });

            if (characters.length > 0)
                await newFilm.addCharacters(characters)
            if (!characters || characters.length === 0) {
                await newFilm.addCharacters([])
            }

            return res.status(200).send({
                success: true,
                film: newFilm
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

const getFilms = async (req, res) => {

    try {

        const films = await Film.findAll({
            raw: true,
            attributes: ['image', 'title']
        })

        if (films.length > 0) {
            return res.status(200).send({
                success: true,
                films: films
            })
        }

        return res.send({
            success: false,
            message: "No hay peliculas o series creadas"
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err
        })
    }
};

const getFilmBy = async (req, res) => {

    const { id, title } = req.query;

    try {

        // Busco de acuerdo al filtro pasado

        if (id) {
            const film = await Film.findOne({
                where: {
                    id: id
                },
                include: Character
            })

            if (film) {
                return res.status(200).send({
                    success: true,
                    film: film
                })
            }

            return res.send({
                success: false,
                message: "No existe la pelicula o serie buscada"
            })
        }
        if (title) {
            const film = await Film.findOne({
                where: {
                    title: title
                },
                include: Character
            })

            if (film) {
                return res.status(200).send({
                    success: true,
                    film: film
                })
            }

            return res.send({
                success: false,
                message: "No existe la pelicula o serie buscada"
            })

        }

    } catch (err) {
        return res.status(500).send({
            success: false,
            error: err
        })
    }

};

const deleteFilm = async (req, res) => {

    const { id } = req.params;

    try {

        // Chequeo si el personaje fue eliminado antes
        const film = await Film.findOne({
            where: {
                id: id
            }
        })

        if (film) {
            await Film.destroy({
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


const updateFilm = async (req, res) => {

    const { id } = req.params;
    const { characters } = req.body;

    try {

        const film = await Film.findOne({
            where: {
                id: id
            }
        })

        if (!film) {
            return res.status(200).send({
                success: false,
                message: "No existe la pelicula o serie a actualizar"
            })
        }

        const editedFilm = await Film.update(req.body, {
            where: {
                id: id
            },
            returning: true,
            raw: true
        })

        if (characters.length > 0) {
            await film.addCharacters(characters)
        } else {
            await film.addCharacters([])
        }

        return res.status(200).send({
            success: true,
            message: "Pelicula/Seria actualizada con exito",
            film: editedFilm[1]
        })

    } catch (err) {
        return res.send({
            success: false,
            message: "Error al actualizar la pelicula/serie"
        })
    }
};


module.exports = { createFilm, getFilms, getFilmBy, deleteFilm, updateFilm }
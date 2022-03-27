const { Genre, Movie } = require('../db');

const createGenre = async (req, res) => {

    try {

        const { image, name } = req.body;

        // Chequeo si existe el personaje
        const genre = await Genre.findOne({
            where: {
                name: name
            }
        });

        if (!genre) {
            // creo un personaje
            const newGenre = await Genre.create({
                image,
                name,
            });

            return res.status(200).send({
                success: true,
                genre: newGenre
            })
        }

        return res.send({
            success: false,
            message: "Ya existe un género con ese nombre"
        });


    } catch (err) {
        return res.status(500).send({
            error: err,
            message: "No se pudo crear el genero"
        })
    }
};

const getGenres = async (req, res) => {

    try {
        const genres = await Genre.findAll({
            include: [ Movie ]
        })

        if (genres.length > 0) {
            return res.status(200).send({
                success: true,
                genres: genres
            })
        }

        return res.send({
            success: false,
            message: "No hay generos creados"
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err
        })
    }
}

module.exports = { createGenre, getGenres }
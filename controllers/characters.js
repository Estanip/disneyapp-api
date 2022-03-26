const { Character } = require('../db');
const { Film } = require('../db');

const createCharacter = async (req, res) => {

    try {

        const { image, name, age, weight, history, films } = req.body;

        // Chequeo si existe el personaje
        const character = await Character.findOne({
            where: {
                name: name
            }
        });

        if (!character) {
            // creo un personaje
            const newCharacter = await Character.create({
                image,
                name,
                age,
                weight,
                history
            });

            if (films.length > 0)
                await newCharacter.addFilms(films)
            if (films.length === 0 || !films) {
                await newCharacter.addFilms([])
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

    try {

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

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err
        })
    }
};

const getCharacterBy = async (req, res) => {

    const { id, name } = req.query;

    try {

        // Busco de acuerdo al filtro pasado

        if (id) {
            const character = await Character.findOne({
                where: {
                    id: id
                },
                include: Film
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
        if (name) {
            const character = await Character.findOne({
                where: {
                    name: name
                },
                include: Film
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

    } catch (err) {
        return res.status(500).send({
            success: false,
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
    const { films } = req.body;

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
            returning: true,
            raw: true
        })

        if (films.length > 0) {
            await character.addFilms(films)
        } else {
            await character.addFilms([])
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

module.exports = { createCharacter, getCharacters, getCharacterBy, deleteCharacter, updateCharacter }
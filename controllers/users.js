const { User } = require('../db');

const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth')

const register = async (req, res) => {

    const { username, password } = req.body;

    try {

        let user = await User.findOne({
            where: {
                username: username
            }
        });

        if (user) {
            return res.status(400).send({
                success: false,
                message: 'Ya existe un usuario con ese nombre'
            });
        }

        //Encriptar la password
        const salt = bcrypt.genSaltSync();
        encriptedPassword = bcrypt.hashSync(password, salt);

        user = await User.create({
            username: username,
            password: encriptedPassword
        }
        );

        let newUser = user.dataValues;

        // Generar JWT
        const token = await generateToken(newUser.id, newUser.username);

        return res.status(200).send({
            success: true,
            message: 'Usuario creado con exito',
            id: newUser.id,
            name: newUser.username,
            token
        })

    } catch (err) {
        res.status(500).send({
            success: false,
            message: 'error',
            error: err
        })
    }
}

const login = async (req, res) => {

    const { username, password } = req.body;

    try {
        let user = await User.findOne({
            where: {
                username: username
            },
            raw: true
        })

        if (!user) {
            return res.send({
                success: false,
                message: 'Usuario inexistente'
            });
        }

        //Confirmar password
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.send({
                success: false,
                message: 'Password incorrecto'
            })
        }

        //Generar JWT
        const token = await generateToken(user.id, user.username);

        res.status(200).send({
            success: true,
            id: user.id,
            name: user.username,
            token
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Ha ocurrido un error'
        })
    }
}

module.exports = {
    register,
    login
}

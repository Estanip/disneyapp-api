const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_KEY } = process.env

const generateToken = async (uid, name) => {

    try {
        const payload = {uid, name};
        const token = await jwt.sign(payload, JWT_KEY, {
            expiresIn: '2h'
        })
    
        return token
    
    } catch (err) {
        console.log({ Message: err })
    }
};

module.exports = {
    generateToken
}
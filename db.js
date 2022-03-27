require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize( {
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: process.env.DATABASE_URL ? true : false
    }
});

const basename = path.basename(__filename);

const modelDefiners = [];

// De la carpeta models tomo cada archivo y lo guardo en el array modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });


// Conecto con sequelize cada model
modelDefiners.forEach(model => model(sequelize));

// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// Hago el destructuring de cada propiedad de sequelize.models
const { Character, Movie, Genre } = sequelize.models;

// Asociaciones
Character.belongsToMany(Movie, { through: 'MoviesCharacters' })
Movie.belongsToMany(Character, { through: 'MoviesCharacters' })

module.exports = {
    ...sequelize.models, // exporto los models
    connection: sequelize,     // exporto la connection
  };
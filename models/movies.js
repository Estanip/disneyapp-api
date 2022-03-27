const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('movie', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    creation_date: {
      type: DataTypes.DATEONLY
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
          min: 1,
          max: 5
      }
    }
  }, {
    timestamps: false
  })
};
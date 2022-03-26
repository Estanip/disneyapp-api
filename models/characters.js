const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('character', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    age: {
      type: DataTypes.INTEGER
    },
    weight: {
      type: DataTypes.INTEGER
    },
    history: {
      type: DataTypes.TEXT
    }
  }, 
  {
    timestamps: false
  })
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('gender', {
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
    }
  }, {
    timestamps: false
  } )
}
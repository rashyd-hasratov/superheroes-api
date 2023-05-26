import { sequelize } from '../config/db';
import { DataTypes } from 'sequelize';

export const Superhero = sequelize.define('superhero', {
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },

  real_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  origin_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  superpowers: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  catch_phrase: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
}, {
  tableName: 'superheroes',
  createdAt: false,
  updatedAt: false,
});

Superhero.sync().then(() => {
  console.log("Superhero Model synced");
});
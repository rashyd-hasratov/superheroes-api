import { sequelize } from '../config/db';
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

export interface SuperheroModel extends Model<InferAttributes<SuperheroModel>, InferCreationAttributes<SuperheroModel>> {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: string[];
}

export const Superhero = sequelize.define<SuperheroModel>('superhero', {
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
    allowNull: false,
  },
}, {
  tableName: 'superheroes',
  // createdAt: false,
  updatedAt: false,
});

Superhero.sync()
  .then(() => {
  console.log("Superhero Model synced");
});
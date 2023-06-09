import { Op } from "sequelize";
import { Superhero, SuperheroModel } from "../models/superheroes";

export const getAll = async (page: number) => {
  const foundSuperheroes = await Superhero.findAll({
    offset: (page - 1) * 5,
    limit: 5,
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  return foundSuperheroes;
};

export const getCount = async () => {
  const count = await Superhero.count();

  return count;
};

export const getByNickname = async (nicknameQuery: string) => {
  const foundSuperhero = await Superhero.findOne({
    where: {
      nickname: {
        [Op.iLike]: `%${nicknameQuery}`,
      },
    },
  });

  return foundSuperhero;
};

export const addOne = async (
  nickname: string,
  real_name: string,
  origin_description: string,
  superpowers: string,
  catch_phrase: string,
  imagesPaths: string[],
) => {
  const newSuperhero = await Superhero.create({
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images: imagesPaths,
  });

  return newSuperhero;
};

export const addNewPhoto = async (
  superhero: SuperheroModel,
  imagePath: string,
) => {
  await superhero.update({ images: [...superhero.images, imagePath]});
};

export const updateOne = async (
  superhero: SuperheroModel,
  key: string,
  value: any,
) => {
  await superhero.update({ [key]: value });
};

export const deleteOne = async (superhero: SuperheroModel) => {
  await superhero.destroy();
};
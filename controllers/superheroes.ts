import express, { Request, Response } from 'express';
import { v4 } from 'uuid';
import fs from 'fs/promises';

import { formatQueryToNickname } from '../helpers/formatQueryToNickname';
import { getExtensionFromMimetype } from '../helpers/getExtensionFromMimetype';

import {
  getAll,
  getCount,
  getByNickname,
  addOne,
  addNewPhoto,
  updateOne,
  deleteOne,
} from '../services/superheroes';

export const getAllSuperheroes = async (req: Request, res: Response) => {
  const {
    page = 1,
  } = req.query;

  const foundSuperheroes = await getAll(Number(page));

  res.send(foundSuperheroes);
};

export const getSuperheroesCount = async (req: Request, res: Response) => {
  const count = await getCount();

  const result = {
    count,
  };

  res.send(result);
};

export const getSuperheroByNickname = async (req: Request, res: Response) => {
  const { nickname } = req.params;

  const nicknameFormatted = formatQueryToNickname(nickname);
  const foundSuperhero = await getByNickname(nicknameFormatted);

  if (!foundSuperhero) {
    res.sendStatus(404);

    return;
  }

  res.send(foundSuperhero);
};

export const addSuperhero = async (req: Request, res: Response) => {
  const {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
  } = req.body;

  if (!nickname
    || !real_name
    || !origin_description
    || !superpowers
    || !catch_phrase
  ) {
    res.sendStatus(400);

    return;
  }

  const nicknameFormatted = formatQueryToNickname(nickname);
  const foundSuperhero = await getByNickname(nicknameFormatted);

  if (foundSuperhero) {
    res.sendStatus(400);

    return;
  }

  const images = [
    req.files?.image_1,
    req.files?.image_2,
    req.files?.image_3,
  ];

  const imagesPaths: string[] = [];

  images.forEach(image => {
    if (image && !Array.isArray(image)) {
      const extension = getExtensionFromMimetype(image.mimetype);
      const imageName = `${v4()}.${extension}`;
      const imageFullPath = 'static/images/' + imageName;
      const imagePath = 'images/' + imageName;

      image.mv(imageFullPath);
      imagesPaths.push(imagePath);
    }
  });

  const newSuperhero = await addOne(
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    imagesPaths,
  );

  res.statusCode = 201;
  res.send(newSuperhero);
};

export const postNewPhoto = async (req: Request, res: Response) => {
  const { nickname } = req.params;

  const nicknameFormatted = formatQueryToNickname(nickname);
  const foundSuperhero = await getByNickname(nicknameFormatted);

  if (!foundSuperhero) {
    res.sendStatus(404);

    return;
  }

  if (!req.files) {
    res.sendStatus(400);

    return;
  }

  const { image } = req.files;

  if (!Array.isArray(image)) {
    const extension = getExtensionFromMimetype(image.mimetype);
    const imageName = `${v4()}.${extension}`;
    const imageFullPath = 'static/images/' + imageName;
    const imagePath = 'images/' + imageName;

    try {
      image.mv(imageFullPath);

      await addNewPhoto(foundSuperhero, imagePath);
    } catch {
      res.sendStatus(500);

      return;
    }
  }

  res.statusCode = 201;
  res.send(foundSuperhero);
};

export const updateSuperhero = async (req: Request, res: Response) => {
  const { nickname } = req.params;

  const {
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images,
  } = req.body;

  const nicknameFormatted = formatQueryToNickname(nickname);
  const foundSuperhero = await getByNickname(nicknameFormatted);

  if (!foundSuperhero) {
    res.sendStatus(404);

    return;
  }

  if (real_name) await updateOne(foundSuperhero, 'real_name', real_name);
  if (origin_description) await updateOne(foundSuperhero, 'origin_description', origin_description);
  if (superpowers) await updateOne(foundSuperhero, 'superpowers', superpowers);
  if (catch_phrase) await updateOne(foundSuperhero, 'catch_phrase', catch_phrase);
  if (images) await updateOne(foundSuperhero, 'images', images);

  res.send(foundSuperhero);
};

export const deleteSuperhero = async (req: Request, res: Response) => {
  const { nickname } = req.params;

  const nicknameFormatted = formatQueryToNickname(nickname);
  const foundSuperhero = await getByNickname(nicknameFormatted)

  if (!foundSuperhero) {
    res.sendStatus(404);

    return;
  }

  await deleteOne(foundSuperhero);

  foundSuperhero.images.forEach(image => {
    const imagePath = './static/' + image;

    fs.unlink(imagePath), (err: Error) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log('File deleted successfully');
    }
  });

  res.sendStatus(200);
};
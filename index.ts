import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';

import { Superhero } from './models/superheroes';
import { Op } from 'sequelize';

dotenv.config();

Superhero.sync().then(() => {
  console.log("Superhero Model synced");
});

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('static'));

app.get('/', async (req: Request, res: Response) => {
  const {
    page = 1,
  } = req.query;

  const foundHeroes = await Superhero.findAll({
    offset: (Number(page) - 1) * 5,
    limit: 5,
  })

  res.send(foundHeroes);
});

app.get('/count', async (req: Request, res: Response) => {
  const allHeroes = await Superhero.findAll();

  const result = {
    count: allHeroes.length,
  };

  res.send(result);
});

app.get('/:nickname', async (req: Request, res: Response) => {
  const { nickname } = req.params;

  const formattedNickname = nickname.split('-').join(' ');

  const foundHero = await Superhero.findOne({
    where: {
      nickname: {
        [Op.iLike]: `%${formattedNickname}`,
      },
    },
  });

  if (!foundHero) {
    res.sendStatus(404);
  }

  res.send(foundHero);
});

app.post('/add', async (req: Request, res: Response) => {
  const {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
  } = req.body;

  console.log(req.body);

  if (!req.files) {
    res.sendStatus(400);
  }

  const images = [
    req.files?.image_1,
    req.files?.image_2,
    req.files?.image_3,
  ];

  const imagesPaths: string[] = [];

  images.forEach(image => {
    if (image && !Array.isArray(image)) {
      const extension = image.mimetype
        .slice(image.mimetype.lastIndexOf('/'));

      const imagePath = 'static/images/' + image.name;

      try {
        image.mv(imagePath);

        imagesPaths.push('images/' + image.name);
      } catch {
        res.sendStatus(500);
      }
    }
  });

  const newSuperhero = await Superhero.create({
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images: imagesPaths,
  });

  res.statusCode = 201;
  res.send(newSuperhero);
})

app.delete('/:nickname', async (req: Request, res: Response) => {
  const { nickname } = req.params;

  const formattedNickname = nickname.split('-').join(' ');

  const foundHero = await Superhero.findOne({
    where: {
      nickname: {
        [Op.iLike]: `%${formattedNickname}`,
      },
    },
  });

  if (!foundHero) {
    res.sendStatus(400);
  }

  await Superhero.destroy({
    where: {
      nickname: {
        [Op.iLike]: `%${formattedNickname}`,
      },
    },
  });

  res.send(foundHero);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
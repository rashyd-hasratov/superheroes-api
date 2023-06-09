import cors from 'cors';
import express, { Express } from "express";
import fileUpload from 'express-fileupload';
import request from 'supertest';

import { router } from "../routes/superheroes";
import { generateNickname } from "../helpers/generateNickname";
import { generateSuperheroData } from '../helpers/generateSuperheroData';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('../static'));
app.use('/', router);

describe('Superheroes Controller', () => {
  describe('getAllSuperheroes', () => {
    test("should respond with an array", done => {
      request(app)
        .get("/")
        .expect(response => {
          if (!(response.body instanceof Array)) throw new Error();
        })
        .expect(200, done);
    });
  });

  describe('getSuperheroesCount', () => {
    test('should respond with a correct object', done => {
      request(app)
        .get('/count')
        .expect(response => {
          const isObject = typeof response.body === 'object';

          if (!isObject) throw new Error();
          if (!response.body.hasOwnProperty('count')) throw new Error();
        })
        .expect(200, done);
    });
  });

  describe('getSuperheroByNickname', () => {
    test('should respond with 404 if superhero does not exist', done => {
      request(app)
        .get(`/${generateNickname()}`)
        .expect(404, done);
    });

    test('should return a superhero by nickname', (done) => {
      const superheroData = generateSuperheroData();
      const { nickname } = superheroData;

      request(app)
        .post('/add')
        .send(superheroData)
        .expect(201)
        .then(() => {
          request(app)
            .get(`/${nickname}`)
            .expect((res) => {
              if (res.body.nickname !== nickname) throw new Error();
            })
            .expect(200, done);
        });
    });
  });

  describe('addSuperhero', () => {
    test('should respond with 400 if necessary data was not passed', (done) => {
      request(app)
        .post('/add')
        .send({})
        .expect(400, done);
    });

    test('should respond with 400 if superhero with given nickname already exists', (done) => {
      const superheroData = generateSuperheroData();
      const { nickname } = superheroData;

      request(app)
        .post('/add')
        .send(superheroData)
        .expect(201)
        .then(() => {
          request(app)
            .post('/add')
            .send(superheroData)
            .expect(400, done);
        });
    });

    test('should add a superhero', (done) => {
      const superheroData = generateSuperheroData();
      const { nickname } = superheroData;

      request(app)
        .post('/add')
        .send(superheroData)
        .expect((res) => {
          console.log(res.body);

          if (res.body.nickname !== nickname) {
            throw new Error();
          }
        })
        .expect(201, done);
    });
  });

  describe('postNewPhoto', () => {
    test('should respond with 404 if superhero does not exist', (done) => {
      request(app)
        .post(`/${generateNickname()}/new-photo`)
        .expect(404, done);
    });

    test('should respond with 400 if image was not passed', (done) => {
      const superheroData = generateSuperheroData();
      const { nickname } = superheroData;

      request(app)
        .post('/add')
        .send(superheroData)
        .expect(201)
        .then(() => {
          request(app)
            .post(`/${nickname}/new-photo`)
            .expect(400, done);
        });
    });

    test('should add new photo for existing superhero', (done) => {
      const superheroData = generateSuperheroData();
      const { nickname } = superheroData;

      request(app)
        .post('/add')
        .send(superheroData)
        .expect(201)
        .then(() => {
          request(app)
            .post(`/${nickname}/new-photo`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', 'testData/images/avatar.png')
            .expect(201, done);
        });
    });
  });

  describe('updateSuperhero', () => {
    test('should respond with 404 if superhero does not exist', (done) => {
      request(app)
        .patch(`/${generateNickname()}`)
        .expect(404, done);
    });

    test('should update an exisiting superhero', (done) => {
      const superheroData = generateSuperheroData();
      const { nickname } = superheroData;

      request(app)
        .post('/add')
        .send(superheroData)
        .expect(201)
        .then(() => {
          const newOriginDescription = 'new origin description';

          request(app)
            .patch(`/${nickname}`)
            .send({ origin_description: newOriginDescription })
            .expect((res) => {
              if (res.body.origin_description !== newOriginDescription) {
                throw new Error();
              }
            })
            .expect(200, done);
        });
    });
  });

  describe('deleteSuperhero', () => {
    test('should respond with 404 if superhero does not exist', (done) => {
      request(app)
        .delete(`/${generateNickname()}`)
        .expect(404, done);
    });

    test('should delete an exisiting superhero', (done) => {
      const superheroData = generateSuperheroData();
      const { nickname } = superheroData;

      request(app)
        .post('/add')
        .send(superheroData)
        .expect(201)
        .then(() => {
          request(app)
            .delete(`/${nickname}`)
            .expect(200)
            .then(() => {
              request(app)
                .get(`/${nickname}`)
                .expect(404, done);
            });
        });
    });
  });
});
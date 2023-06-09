import express from 'express';
import {
  getAllSuperheroes,
  getSuperheroesCount,
  getSuperheroByNickname,
  addSuperhero,
  postNewPhoto,
  updateSuperhero,
  deleteSuperhero,
} from '../controllers/superheroes';

export const router = express.Router();

router.get('/', getAllSuperheroes);
router.get('/count', getSuperheroesCount);
router.get('/:nickname', getSuperheroByNickname);
router.post('/:nickname/new-photo', postNewPhoto);
router.post('/add', addSuperhero);
router.patch('/:nickname', updateSuperhero);
router.delete('/:nickname', deleteSuperhero);
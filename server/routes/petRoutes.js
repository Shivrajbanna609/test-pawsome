import express from 'express';
import { getAllPets, getPetById, addPet, updatePet, deletePet } from '../controllers/petController.js';

const petRouter = express.Router();

petRouter.get('/getallpet', getAllPets);
petRouter.get('/:id', getPetById);
petRouter.post('/addpet', addPet);
petRouter.put('/:id', updatePet);
petRouter.delete('/:id', deletePet);

export default petRouter;

import express from 'express';
import { getAllPets, getPetById, addPet, updatePet, deletePet } from '../controllers/petController.js';
import upload from '../middleware/multer.js';

const petRouter = express.Router();

petRouter.get('/getallpet', getAllPets);
petRouter.get('/:id', getPetById);
petRouter.post('/addpet', upload.single('image'), addPet);
petRouter.put('/:id', upload.single('image'), updatePet);
petRouter.delete('/:id', deletePet);

export default petRouter;


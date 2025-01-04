// controllers/petController.js
import Pet from '../models/petModel.js';

// Get all pets
export const getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json({ success: true, pets });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching pets', error: error.message });
    }
};

// Get pet by ID
export const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.json({ success: false, message: 'Pet not found' });
        }
        res.json({ success: true, pet });
    } catch (error) {
        res.json({ success: false, message: 'Error fetching pet', error: error.message });
    }
};

// Add a new pet
export const addPet = async (req, res) => {
    try {
        const newPet = new Pet(req.body);
        await newPet.save();
        res.status(201).json({ success: true, newPet });
    } catch (error) {
        res.json({ success: false, message: 'Error adding pet', error: error.message });
    }
};

// Update pet details
export const updatePet = async (req, res) => {
    try {
        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPet) {
            return res.json({ success: false, message: 'Pet not found' });
        }
        res.json({ success: true, updatedPet });
    } catch (error) {
        res.json({ success: false, message: 'Error updating pet', error: error.message });
    }
};

// Delete pet
export const deletePet = async (req, res) => {
    try {
        const deletedPet = await Pet.findByIdAndDelete(req.params.id);
        if (!deletedPet) {
            return res.json({ success: false, message: 'Pet not found' });
        }
        res.json({ success: true, message: 'Pet deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: 'Error deleting pet', error: error.message });
    }
};

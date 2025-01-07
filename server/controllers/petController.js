import Pet from '../models/petModel.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Add a new pet
export const addPet = async (req, res) => {
    try {
        let imageUrl;
        if (req.file) {
            await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "pets" },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(new Error('Error uploading to Cloudinary'));
                        } else {
                            imageUrl = result.secure_url;
                            resolve();
                        }
                    }
                );
                bufferToStream(req.file.buffer).pipe(stream);
            });
        }

        const newPet = new Pet({
            name: req.body.name,
            age: req.body.age,
            breed: req.body.breed,
            description: req.body.description,
            adopted: req.body.adopted === 'true',
            image: imageUrl
        });

        const savedPet = await newPet.save();
        // console.log('Saved pet:', savedPet);
        res.status(201).json({ success: true, newPet: savedPet });
    } catch (error) {
        console.error('Error in addPet:', error);
        res.status(500).json({ success: false, message: 'Error adding pet', error: error.message });
    }
};

// Update pet details
export const updatePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        let imageUrl = pet.image;
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (pet.image) {
                const publicId = pet.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new image
            await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "pets" },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(new Error('Error uploading to Cloudinary'));
                        } else {
                            imageUrl = result.secure_url;
                            resolve();
                        }
                    }
                );
                bufferToStream(req.file.buffer).pipe(stream);
            });
        }

        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                age: req.body.age,
                breed: req.body.breed,
                description: req.body.description,
                adopted: req.body.adopted === 'true',
                image: imageUrl
            },
            { new: true }
        );
        console.log('Updated pet:', updatedPet);
        res.json({ success: true, updatedPet });
    } catch (error) {
        console.error('Error in updatePet:', error);
        res.status(500).json({ success: false, message: 'Error updating pet', error: error.message });
    }
};



// Delete pet
export const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        // Delete the image from Cloudinary if it exists
        if (pet.image) {
            const publicId = pet.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Pet.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting pet', error: error.message });
    }
};


        // Get all pets
        export const getAllPets = async (req, res) => {
            try {
                const pets = await Pet.find();
                res.json({ success: true, pets });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Error fetching pets', error: error.message });
            }
        };
        
        // Get pet by ID
        export const getPetById = async (req, res) => {
            try {
                const pet = await Pet.findById(req.params.id);
                if (!pet) {
                    return res.status(404).json({ success: false, message: 'Pet not found' });
                }
                res.json({ success: true, pet });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Error fetching pet', error: error.message });
            }
        };
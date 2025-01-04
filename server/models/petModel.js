import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    adopted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Pet = mongoose.model('Pet', PetSchema);

export default Pet;

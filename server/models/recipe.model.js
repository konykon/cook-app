import mongoose from 'mongoose'
import crypto from 'crypto'
import { string } from 'prop-types';
const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    description: {
        type: String,
        required: 'Description is required'
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    stepsList: [{ type: mongoose.Schema.ObjectId, ref: '' }],
    created: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Recipe', RecipeSchema)
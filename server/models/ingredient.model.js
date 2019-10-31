import mongoose from 'mongoose'
import crypto from 'crypto'
import { string } from 'prop-types';
const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    category: {
        type: String,
        required: 'Category is required'
    },
    price: {
        type: Number
    }
})

export default mongoose.model('Ingredient', IngredientSchema)
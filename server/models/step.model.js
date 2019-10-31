import mongoose from 'mongoose'
import {RecipeIngredientSchema} from './recipe.model'

const StepSchema = new mongoose.Schema({
    title: {
        type: String,
    //    required: 'Title is required'
    },
    description: {
        type: String,
    //    required: 'Description is required'
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    ingredients: [RecipeIngredientSchema],
})

export default mongoose.model('Step', StepSchema)
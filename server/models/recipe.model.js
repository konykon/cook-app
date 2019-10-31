import mongoose from 'mongoose'

const RecipeIngredientSchema = new mongoose.Schema({
  quantity: Number,
  unit: {
    type: String,
    enum: ['small spoon', 'big spoon', 'grams']
  },
  ingredient: { type: mongoose.Schema.ObjectId, ref: 'Ingredient' }
});

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
  //  required: 'Title is required'
  },
  description: {
    type: String,
  //  required: 'Description is required'
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  steps: [{ type: mongoose.Schema.ObjectId, ref: 'Step' }],
  created: {
    type: Date,
    default: Date.now
  },
  country: {
    type: String
  },
  difficulty: {
    type: Number,
    min: 0,
    max: 5
  },
  utensils: [{ type: mongoose.Schema.ObjectId, ref: 'Utensil' }],
  calories: {
    type: String
  },
  preparationTime: {
    type: Number
  },
  category: {
    type: String,
  //  required: 'Category is required'
  },
  cost: {
    type: Number
  },
  ingredients: [RecipeIngredientSchema]
})

export default mongoose.model('Recipe', RecipeSchema)
export {
  RecipeIngredientSchema
}
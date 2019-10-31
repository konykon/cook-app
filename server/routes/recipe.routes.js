import express from 'express'
import recipeCtrl from '../controllers/recipe.controller'

const router = express.Router()

router.route('/api/recipes/new')
  .post(recipeCtrl.create)

router.route('/api/photo/:recipeId')
  .get(recipeCtrl.photo)

router.route('/api/recipes/:recipeId/step')
  .post(recipeCtrl.createAddStep)

router.route('/api/recipes')
  .get(recipeCtrl.listRecipes)

router.route('/api/recipes/:recipeId')
  .delete(recipeCtrl.remove)

router.param('recipeId', recipeCtrl.recipeByID)

export default router

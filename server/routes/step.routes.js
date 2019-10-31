import express from 'express'
import stepCtrl from '../controllers/step.controller'
import recipeCtrl from '../controllers/recipe.controller'

const router = express.Router()

router.route('/api/steps/:recipeId')
  .get(stepCtrl.listSteps)

router.route('/api/steps/photo/:stepId')
  .get(stepCtrl.photo)

router.route('/api/steps/:stepId')
  .delete(stepCtrl.remove)

router.route('/api/steps/video/:stepId')
  .get(stepCtrl.video)

router.param('stepId', stepCtrl.stepByID)
router.param('recipeId', recipeCtrl.recipeByID)


export default router

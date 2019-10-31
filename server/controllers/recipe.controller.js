import Recipe from '../models/recipe.model'
import Step from '../models/step.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

const create = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }

    console.log(fields)

    let recipe = new Recipe(fields)
    if (files.photo) {
      recipe.photo.data = fs.readFileSync(files.photo.path)
      recipe.photo.contentType = files.photo.type
    }
    recipe.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(result)
    })
  })
}

const recipeByID = (req, res, next, id) => {
  Recipe.findById(id).populate('steps', '_id description photo').exec((err, recipe) => {
    if (err || !recipe)
      return res.status('400').json({
        error: "Recipe not found"
      })
    req.recipe = recipe
    next()
  })
}

const remove = (req, res) => {
  let recipe = req.recipe
  recipe.remove((err, deletedRecipe) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(deletedRecipe)
  })
}

const photo = (req, res, next) => {
  res.set("Content-Type", req.recipe.photo.contentType)
  return res.send(req.recipe.photo.data)
}

const createAddStep = (req, res, next) => {
  //create
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Video could not be uploaded"
      })
    }

    console.log(fields)

    let step = new Step(fields)
    if (files.photo) {
      step.photo.data = fs.readFileSync(files.photo.path)
      step.photo.contentType = files.photo.type
    }
    step.save((err, newStep) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      console.log("asasd", newStep, req.params.recipeId)
      Recipe.findByIdAndUpdate(req.params.recipeId, { $push: { steps: newStep._id } }, { new: true })
        .exec((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            })
          }
          console.log("bbb",result)
          res.json(result)
        })
    })
  })

  //add
 
}

const removeStep = (req, res) => {
  Recipe.findByIdAndUpdate(req.body.recipeId, { $pull: { steps: req.body.stepId } }, { new: true })
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(result)
    })
}

const listRecipes = (req, res) => {
  Recipe.find()
    .populate('steps', 'title description')
    .sort('-created')
    .exec((err, recipes) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(recipes)
    })
}

export default {
  create,
  recipeByID,
  remove,
  photo,
  createAddStep,
  removeStep,
  listRecipes
}

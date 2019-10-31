import Step from '../models/step.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import mongoose from 'mongoose'
// import Grid from 'gridfs-stream'

/* Temporary fix for Mongoose v5+ and gridfs-stream v1.1.1 bug */
const Grid = require('gridfs-stream');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
/* Until gridfs-stream module is updated */
Grid.mongo = mongoose.mongo
let gridfs = null
mongoose.connection.on('connected', () => {
  gridfs = Grid(mongoose.connection.db)
})

const stepByID = (req, res, next, id) => {
  Step.findById(id).exec((err, step) => {
    if (err || !step)
      return res.status('400').json({
        error: "Step not found"
      })
    req.step = step
    next()
  })
}

const remove = (req, res) => {
  let step = req.step
    step.remove((err, deletedStep) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(deletedStep)
    })
}

const photo = (req, res, next) => {
    res.set("Content-Type", req.step.photo.contentType)
    return res.send(req.step.photo.data)
}

const video = (req, res) => {
  gridfs.findOne({
    _id: req.step._id
  }, (err, file) => {
    if (err) {
      return res.status(400).send({
        error: errorHandler.getErrorMessage(err)
      })
    }
    if (!file) {
      return res.status(404).send({
        error: 'No video found'
      })
    }

    if (req.headers['range']) {
      let parts = req.headers['range'].replace(/bytes=/, "").split("-")
      let partialstart = parts[0]
      let partialend = parts[1]

      let start = parseInt(partialstart, 10)
      let end = partialend ? parseInt(partialend, 10) : file.length - 1
      let chunksize = (end - start) + 1

      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
        'Content-Type': file.contentType
      })

      gridfs.createReadStream({
        _id: file._id,
        range: {
          startPos: start,
          endPos: end
        }
      }).pipe(res)
    } else {
      res.header('Content-Length', file.length)
      res.header('Content-Type', file.contentType)

      gridfs.createReadStream({
        _id: file._id
      }).pipe(res)
    }
  })
}

const listSteps = (req, res) => {
  Step.find()
    .populate('steps', 'title photo')
    .exec((err, steps) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(steps)
    })
}

export default {
  stepByID,
  remove,
  photo,
  video,
  listSteps
}

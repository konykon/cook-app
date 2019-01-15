import mongoose from 'mongoose'
import crypto from 'crypto'
import { string } from 'prop-types';
const StepSchema = new mongoose.Schema({
    stepDescription: {
        type: String,
        required: 'Description is required'
    },
    stepPhoto: {
        data: Buffer,
        contentType: String
    },
    stepVideo: {
        data: Buffer,
        contentType: String
    }
})

export default mongoose.model('Step', StepSchema)
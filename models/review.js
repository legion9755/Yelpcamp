const { string, types } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body:String,
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    rating: Number


})

module.exports = mongoose.model('Review',reviewSchema);
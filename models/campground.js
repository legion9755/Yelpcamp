const { ref } = require('joi');
const Review = require('./review');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

// https://res.cloudinary.com/dzfovfyu0/image/upload/v1721307999/YelpCamp/s9efjvuyhdg076kov2ty.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});



const campgroundSchema = new Schema({
    title: String,
    geometry: {
        type: {
          type: String,
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>`
});


campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', campgroundSchema);
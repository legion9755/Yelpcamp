const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review')
const Campground = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');




router.post('/',isLoggedIn,validateReview, reviews.createReview )

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router;
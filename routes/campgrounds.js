const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { isAuthor, validateCampground, isLoggedIn }= require('../middleware');
const campgrounds = require('../controllers/campgrounds')
const { storage } = require('../cloudinary')
const multer  = require('multer')
const upload = multer({ storage })




router.get('/', campgrounds.index)

router.get('/new', isLoggedIn,campgrounds.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'), validateCampground,campgrounds.createCampground)



router.get('/:id', campgrounds.showCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)

router.put('/:id', isLoggedIn, upload.array('image'),isAuthor,validateCampground, campgrounds.updateCampground);

router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampground)

module.exports = router;
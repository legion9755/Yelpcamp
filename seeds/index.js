if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const mongoose = require('mongoose');
const Campground = require('../models/campground');
// const cities = require('country-state-city').City.getCitiesOfCountry("IN");
const { descriptors, places, cities } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("DATABASE CONNECTED!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

console.log(cities.length)

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const randomInt = Math.floor(Math.random() * cities.length);
        const location = `${cities[randomInt]}, india`;
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 2
        }).send()
        
        const price = Math.floor(Math.random() * 10000) + 4000;
        const camp = new Campground({
            author: '669529edab169a8a6cb829b8',
            location: location,
            geometry:geoData.body.features[0].geometry,
            title: `${sample(descriptors)} ${sample(places)} `,
            description: "ipsum dolor sit amet consectetur adipisicing elit. Molestias, corporis hic. Quam ex quod nam aliquid quas facere? Tempore molestias voluptate accusantium velit debitis unde officiis odit. Nisi, quam minima",
            price: price,
            images:  [
                {
                  url: 'https://res.cloudinary.com/dzfovfyu0/image/upload/v1722095087/YelpCamp/hwwt2etd9yk7t0u0t398.jpg',
                  filename: 'YelpCamp/b8wcntlzywssqy9pkpri',
                 
                },
                {
                  url: 'https://res.cloudinary.com/dzfovfyu0/image/upload/v1722095090/YelpCamp/k3xh5ftw079lknkebqct.jpg',
                  filename: 'YelpCamp/daf1w6gxkemgznuypgew',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dzfovfyu0/image/upload/v1722095089/YelpCamp/hz0anp9448wyqsfxhfeg.jpg',
                  filename: 'YelpCamp/zeup6c7iyx9voim7pho4',
                  
                }
              ]
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});
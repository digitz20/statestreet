const cloudinary = require('cloudinary').v2


    // Configuration - trim whitespace from env vars to fix spaces in .env
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME?.trim(),
        api_key: process.env.API_KEY?.trim(),
        api_secret: process.env.API_SECRET?.trim()
    });

    module.exports = cloudinary
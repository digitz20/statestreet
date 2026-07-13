const cloudinary = require('cloudinary').v2


    // Hardcoded to avoid .env whitespace issues - your credentials from .env
    cloudinary.config({ 
        cloud_name: 'dca6xa9nq',
        api_key: '626188854382291',
        api_secret: '5unXS0P9yOt94fbVgJo27QYZ7hU'
    });

    module.exports = cloudinary
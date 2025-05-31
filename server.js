require('./config/database')
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const swaggerUIEXPRESS = require('swagger-ui-express');
const swaggerJSDOC = require('swagger-jsdoc');


const PORT = process.env.PORT || 4988

const userRouter = require('./routes/userRouter')


const app = express()

app.use(cors({origin: "*"}));

app.use(express.json());



// Swagger Definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'statestreet Documentation',
    version: '1.0.0',
    description: 'This is a swagger documentation for the web application statestreet',
    license: {
      name: 
      'Base_URL: https://heavenlist2-zaz3.onrender.com ',
    },
  },
  "components": {
 "securitySchemes": {
    "BearerAuth": {
      "type": 'http',
      "scheme": 'bearer',
      "bearerFormat": 'JWT',
    },
  },
},

security: [
  {
    bearerAuth: [],
  },
],
  servers: [
    {
      url: 'https://heavenlist2-zaz3.onrender.com',
      description: 'Production server',
    },
    {
      url: 'http://localhost:4988',
      description: 'Development server',
    },
  ],


};


// Swagger Options
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Adjust this path based on your actual route files
};

const swaggerSpec = swaggerJSDOC(options);

// Swagger UI setup
app.use('/statestreet', swaggerUIEXPRESS.serve, swaggerUIEXPRESS.setup(swaggerSpec));


app.use('/api/v1/',userRouter)

app.use((error, req, res, next) => {
  if(error){
     return res.status(400).json({message:  error.message})
  }
  next()
})


app.listen(PORT, () => {
    console.log(`my server is running on port ${PORT}`)
})
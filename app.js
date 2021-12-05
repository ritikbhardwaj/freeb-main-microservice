//Entry point

// Initializes dotenv
require('dotenv').config()

// Require Dependencies
const express = require('express'),
  app = express(),
  { PORT, SESSION_SECRET } = process.env,
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  dynamoDBStore = require('dynamodb-store'),
  { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION } = process.env

const dynamoDBOptions = {
  // table: {
  //   name: 'sessions',
  //   hashKey: 'id',
  // },
  dynamoConfig: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  },
  keepExpired: false,
  touchInterval: 30000,
  ttl: 600000,
}

// Project Files
const { variables } = require('./utils/Middlewares')
const appRoutes = require('./AppRoutes')

// Middlewares
app.use(
  cors({
    //To allow requests from client
    origin: [
      'http://localhost:8080',
      'http://127.0.0.1',
      'http://3.108.236.1/',
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })
)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)

app.use(
  session({
    cookieName: 'oreo',
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 10 },
    store: new dynamoDBStore(dynamoDBOptions),
  })
)

// Middleware for some local variables to be used in the template
app.use(variables)

// App routes
appRoutes(app)

// Listening to PORT
app.listen(PORT, () => {
  console.log(`Main API Listening on port ${PORT}`)
})

// ROUTE FILES

// Login routes
const loginRoutes = require('./routes/LoginRoutes')

// Signup routes
const signupRoutes = require('./routes/SignupRoutes')

// Post routes
const postRoutes = require('./routes/PostRoutes')

const appRoutes = (app) => {
  app.use('/api', loginRoutes)
  app.use('/api', signupRoutes)
  app.use('/api', postRoutes)
}

module.exports = appRoutes

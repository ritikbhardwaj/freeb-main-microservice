// ROUTE FILES

// Login routes
const loginRoutes = require('./routes/LoginRoutes')

// Signup routes
const signupRoutes = require('./routes/SignupRoutes')

// Post routes
const postRoutes = require('./routes/PostRoutes')

// User routes
const userRoutes = require('./routes/UserRoutes')

const appRoutes = (app) => {
  app.use('/api', userRoutes)
  app.use('/api', loginRoutes)
  app.use('/api', signupRoutes)
  app.use('/api', postRoutes)
}

module.exports = appRoutes

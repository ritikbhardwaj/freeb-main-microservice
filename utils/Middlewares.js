// MIDDLEWARES FOR EXPRESS

// FOR CREATING LOCAL VARIABLES
const variables = (req, res, next) => {
  let loggedIn = req.session.id ? true : false
  res.locals.loggedIn = loggedIn
  res.locals.session = req.session
  next()
}

// FOR LOGGED IN USERS ONLY
const confirmLoggedIn = (req, res, next) => {
  !req.session.id ? res.redirect('/login') : next()
}

// FOR NOT-LOGGED IN USERS ONLY
const confirmNotLoggedIn = (req, res, next) => {
  req.session.id ? res.redirect('/') : next()
}

module.exports = {
  variables,
  confirmLoggedIn,
  confirmNotLoggedIn,
}

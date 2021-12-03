// ALL THE USER LOGIN-RELATED ROUTES ARE HANDLED BY THIS FILE

const router = require('express').Router(),
  db = require('../utils/Db'),
  mw = require('../utils/Middlewares'),
  { comparePasswordWithHash } = require('../utils/BcryptFunctions')

// LOGS THE USER IN
router.post('/login', async (req, res) => {
  try {
    const { user_email, user_password } = req.body
    let { session } = req

    let q = await db.query(
      'SELECT user_id,username,email,password from users WHERE email = ? ',
      [user_email]
    )
    // User exists
    if (q.length) {
      // Check if the passwor is right
      if (comparePasswordWithHash(user_password, q[0]['password'])) {
        session.user_id = q[0]['user_id']
        session.username = q[0]['username']
        session.email = q[0]['email']
        res.status(200).json({
          status: 200,
          code: 'Success.',
          message: 'User logged in successfully.',
        })
      } else {
        res.status(400).json({
          status: 400,
          code: 'Bad request.',
          message: 'Incorrect Password.',
        })
      }
      // If the password checks out set the session
    } else {
      res.status(400).json({
        status: 400,
        code: 'Bad request.',
        message: 'User not found.',
      })
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      code: 'Internal Server Error.',
      message: e,
    })
  }
})

// LOGS USER OUT
router.get('/logout', async (req, res) => {
  try {
    let url = req.session.destroy() ? '/login' : '/'
    res.send(url)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router

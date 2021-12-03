// ALL THE USER SIGNUP-RELATED ROUTES ARE HANDLED BY THIS FILE

const router = require('express').Router(),
  db = require('../utils/db'),
  getUid = require('../utils/GetUid'),
  { getHash, comparePassword } = require('../utils/BcryptFunctions')
mw = require('../utils/Middlewares')

// REGISTERS A USER
// Problems:
//  - duplicate users can be inserted, no checking if the user exists or not
//  - no validation of credentials
router.post('/signup', async (req, res) => {
  const { firstName, lastName, userName, email, userPassword } = req.body
  let { session } = req
  const userData = {
    user_id: getUid(),
    username: userName,
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: getHash(userPassword),
  }
  try {
    const { affectedRows } = await db.query('INSERT INTO USERS SET ?', userData)
    // If the user was registered
    // Set the session info
    if (affectedRows) {
      console.log(userData)
      const { user_id, username, email } = userData
      session.id = user_id
      session.email = email
      session.username = username

      res.status(200).json({
        status: 200,
        code: 'Success.',
        message: 'User registered.',
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

module.exports = router

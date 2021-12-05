// ALL THE USER USER-RELATED ROUTES ARE HANDLED BY THIS FILE

const router = require('express').Router(),
  db = require('../utils/Db'),
  mw = require('../utils/Middlewares'),
  { comparePasswordWithHash } = require('../utils/BcryptFunctions')

// LOGS THE USER IN
router.get('/get-user-info', async (req, res) => {
  try {
    let { session } = req

    //If the session exists ie the user logged in
    if (session.user_id) {
      let q = await db.query(
        'SELECT user_id, first_name, last_name, username, email, password from users WHERE email = ? ',
        [session.email]
      )

      let r = await db.query(
        'SELECT first_name, last_name, post_key from post_cards WHERE user_id = ?',
        [session.user_id]
      )

      // User exists
      if (q.length) {
        const userInfo = {
          user_id: q[0]['user_id'],
          firstName: q[0]['first_name'],
          lastName: q[0]['last_name'],
          username: q[0]['username'],
          email: q[0]['email'],
          userPosts: r,
        }

        res.status(200).json({
          status: 200,
          code: 'Success.',
          message: userInfo,
        })
      }
    } else {
      res.status(200).json({
        status: 401,
        code: 'Unauthorized.',
        message: 'You need to login first.',
      })
    }
  } catch (e) {
    res.status(200).json({
      status: 500,
      code: 'Internal Server Error.',
      message: e,
    })
  }
})

module.exports = router

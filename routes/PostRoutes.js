// ALL THE POST RELATED ROUTES ARE HANDLED BY THIS FILE

const router = require('express').Router(),
  db = require('../utils/db'),
  mw = require('../utils/Middlewares'),
  formData = require('form-data'),
  multer = require('multer'),
  upload = multer({ dest: 'uploads/' }),
  util = require('util'),
  fs = require('fs'),
  unlinkFile = util.promisify(fs.unlink),
  axios = require('axios'),
  path = require('path'),
  getUid = require('../utils/GetUid'),
  getDate = require('../utils/GetDate')

// Get all posts
router.get('/posts?user=all', (req, res) => {
  // Get all the posts ever made
  // SELECT  FROM posts
})

router.get('/posts', async (req, res) => {
  try {
    if (
      // IF no query parameters
      Object.keys(req.query).length === 0 &&
      req.query.constructor === Object
    ) {
      res.status(400).json({
        status: 400,
        code: 'Bad request.',
        message: 'No query parameter.',
      })
    } else {
      const { user } = req.query
      if (user == 'all') {
        // If request all posts
        let q = await db.query(
          'SELECT * from post_cards WHERE post_key <> ""',
          []
        )
        res.status(200).json({
          status: 200,
          code: 'Success.',
          data: q,
        })
      } else {
        // If a particular user posts
        const { user_id, username } = req.session
        if (user_id) {
          // If the user is logged in
          let q = await db.query('SELECT * from post_cards WHERE username=?', [
            username,
          ])
          res.status(200).json({
            status: 200,
            code: 'Success.',
            data: q,
          })
        } else {
          // User is not logged in
          res.status(401).json({
            status: 401,
            code: 'Unautohorized.',
            data: 'Please login to acces this resource',
          })
        }
      }
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      code: 'Internal Server Error.',
      message: e,
    })
  }
})

// Create a post
router.post('/posts', upload.single('image'), async (req, res) => {
  // Get the user id from the session store
  const { user_id } = req.session

  if (!req.session.id) {
    return res.status(200).json({
      status: 401,
      code: 'Unauthorized.',
      message: 'Please login.',
    })
  }

  // The key of the file uploaded
  let key = ''

  if (!req.file) {
    return res.status(200).json({
      status: 400,
      code: 'Bad request.',
      message: 'Please provide a file.',
    })
  }

  const { path, filename } = req.file
  const fileStream = fs.createReadStream(path)
  let data = new formData()
  data.append('image', fileStream)
  try {
    const response = await axios.post(
      'http://localhost:3000/api/s3/images',
      data,
      {
        headers: data.getHeaders(),
      }
    )

    key = response.data.message.key

    const postData = {
      post_id: getUid(),
      user_id: user_id,
      post_date: getDate(),
      post_key: response.data.message.key,
    }

    console.log('#########')

    const q = await db.query('INSERT INTO posts SET ?', postData)

    res.status(200).json({
      status: 200,
      code: 'Success.',
      message: response.data.message,
    })

    // After the file is uploaded, delte it
    await unlinkFile(path)
  } catch (e) {
    // Even if there is some error, delte the file
    await unlinkFile(path)
    res.status(200).json({
      status: 500,
      code: 'Internal server error.',
      message: e.message,
    })
  }
})

// Delete a post
router.delete('/posts/:key', async (req, res) => {
  const { key } = req.params
  try {
    const response = await axios.delete(`http://localhost:3000/images/${key}`)

    res.status(200).json({
      status: 200,
      code: 'Success.',
      message: response.data.message,
    })
  } catch (e) {
    res.status(500).json({
      status: 500,
      code: 'Internal Server Error.',
      message: e.message,
    })
  }
})

module.exports = router

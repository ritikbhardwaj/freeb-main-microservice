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
          'SELECT * from post_card WHERE post_key <> ""',
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
          let q = await db.query('SELECT * from post_card WHERE username=?', [
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
  const { userId } = req.session

  // The key of the file uploaded
  let key = ''

  if (!req.file) {
    return res.status(400).json({
      status: 400,
      code: 'Bad request.',
      message: 'No file uploaded.',
    })
  }

  const { path, filename } = req.file
  const fileStream = fs.createReadStream(path)
  let data = new formData()
  data.append('image', fileStream)
  try {
    const response = await axios.post('http://localhost:3000/images', data, {
      headers: data.getHeaders(),
    })

    key = response.data.message.key

    const postData = {
      post_id: getUid(),
      user_id: 'abcdef',
      post_date: getDate(),
      post_key: response.data.message.key,
    }

    const q = await db.query('INSERT INTO posts SET ?', postData)

    res.status(200).json({
      status: 200,
      code: 'Success.',
      message: response.data.message,
    })
  } catch (e) {
    // In case of faliure, delete the uploaded file.
    try {
      const response = await axios.delete(`http://localhost:3000/images/${key}`)
    } catch (e) {
      res.status(500).json({
        status: 500,
        code: 'Internal Server Error.',
        message: e.message,
      })
    }
    res.status(500).json({
      status: 500,
      code: 'Internal Server Error.',
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

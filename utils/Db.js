// HANDY FUNCTIONS FOR MYSQL

const db = require('./Mysql')

// Query mysql as a promise
const query = (q, data) => {
  return new Promise((resolve, reject) => {
    db.query(q, data, (err, res) => (err ? reject(err) : resolve(res)))
  })
}

// Returns boolean based on true or false
const tf = (value) => (value == 1 ? true : false)

module.exports = {
  query,
  tf,
}

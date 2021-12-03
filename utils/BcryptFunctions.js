const bcrypt = require('bcrypt'),
  saltRounds = 5

const getHash = (passwordString) => {
  return bcrypt.hashSync(passwordString, saltRounds)
}

const comparePasswordWithHash = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

module.exports = {
  getHash,
  comparePasswordWithHash,
}

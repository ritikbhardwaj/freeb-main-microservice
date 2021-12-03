const { v4: uuidv4 } = require('uuid')

module.exports = () => {
  let userId = ''
  uuidv4()
    .split('-')
    .forEach((seg) => {
      userId += seg
    })
  return userId
}

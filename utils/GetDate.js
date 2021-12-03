module.exports = () => {
  let d = new Date()
  let date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate()
  return date
}

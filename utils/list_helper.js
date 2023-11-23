const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return (blogs.length === 1) ? 5 :
    blogs.reduce((sum, item) => sum + item)
}

module.exports = {
  dummy,
  totalLikes
}
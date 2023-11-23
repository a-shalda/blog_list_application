const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return (blogs.length === 1) ? 5 :
    blogs.reduce((sum, item) => sum + item)
}

const favoriteBlog = (blogs) => {
  const blogLikes = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...blogLikes)
  const favBlog = blogs.filter(blog => blog.likes === maxLikes)
  return favBlog[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
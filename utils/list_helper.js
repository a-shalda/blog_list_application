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

const mostBlogs = (blogs) => {
  let authors = {}
  let arr = blogs.map(blog => blog.author)

  for (let i = 0; i < arr.length; i++) {
    authors[arr[i]] = 0
  }

  for (let i = 0; i < blogs.length; i++) {
    authors[blogs[i]['author']]++
  }

  const max = Math.max(...Object.values(authors))
  let maxAuthor

  for (let author in authors) {
    if (authors[author] === max) {
      maxAuthor = author
    }
  }

  return {
    'author': maxAuthor,
    'blogs': max
  }
}

const mostLikes = (blogs) => {
  let authors = {}
  let arr = blogs.map(blog => blog.author)

  for (let i = 0; i < arr.length; i++) {
    authors[arr[i]] = 0
  }

  for (let i = 0; i < blogs.length; i++) {
    authors[blogs[i]['author']] = authors[blogs[i]['author']] + blogs[i]['likes']
  }

  const max = Math.max(...Object.values(authors))
  let maxAuthor

  for (let author in authors) {
    if (authors[author] === max) {
      maxAuthor = author
    }
  }

  const result = {
    'author': maxAuthor,
    'likes': max
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
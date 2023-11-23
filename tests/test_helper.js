const Blog = require('../models/blog')

const initialBlogs =
  [
    { 'title':'React patterns','author':'Michael Chan','url':'https://reactpatterns.com/','likes':7,'id':'655ed6cf76d644f8a4306cae' },{ 'title':'Go To Statement Considered Harmful','author':'Edsger W. Dijkstra','url':'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html','likes':5,'id':'655ed6e476d644f8a4306cb0' },{ 'title':'Canonical string reduction','author':'Edsger W. Dijkstra','url':'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html','likes':12,'id':'655ed6f776d644f8a4306cb2' },{ 'title':'First class tests','author':'Robert C. Martin','url':'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll','likes':10,'id':'655ed70876d644f8a4306cb4' },{ 'title':'TDD harms architecture','author':'Robert C. Martin','url':'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html','likes':0,'id':'655ed71976d644f8a4306cb6' },{ 'title':'Type wars','author':'Robert C. Martin','url':'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html','likes':2,'id':'655ed72a76d644f8a4306cb8' }
  ]


const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

//Auth
const bcrypt = require('bcrypt')
const User = require('../models/user')
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  username: 'Alex'
}

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  blogObjects[0].user = userOneId.id

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  //Deliting all users and creating a new user
  await User.deleteMany()
  const passwordHash = await bcrypt.hash('secret', 10)
  userOne.passwordHash = passwordHash
  const user = new User(userOne)
  await user.save()

}, 100000)



describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'React patterns'
    )})
})


describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[blogsAtStart.length - 1]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(r => expect(r.id).toBeDefined())
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '655f843ef514763f90ce'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})



describe('addition of a new blog', () => {

  test('adding a blog fails if a token is not provided.', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'me',
      url: 'me.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a valid blog can be added', async () => {

    const result = await api
      .post('/api/login')
      .send({
        username: userOne.username,
        password: 'secret'
      })
      .expect(200)

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'me',
      url: 'me.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${result.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(newBlog.title)

    const authors = blogsAtEnd.map(b => b.author)
    expect(authors).toContain(newBlog.author)

    // const urls = blogsAtEnd.map(b => b.url)
    // expect(urls).toContain(newBlog.url)

    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes).toContain(newBlog.likes)
  })

  test('a blog without title or url is not added', async () => {

    const result = await api
      .post('/api/login')
      .send({
        username: userOne.username,
        password: 'secret'
      })
      .expect(200)

    const newBlog = {
      likes: 5,
      author: 'me'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${result.body.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('blog without likes property is assigned with likes = 0', async () => {

    const result = await api
      .post('/api/login')
      .send({
        username: userOne.username,
        password: 'secret'
      })
      .expect(200)

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'me',
      url: 'me.com',
      user: '656058f0288eda812d6ebee3'
    }

    if (!newBlog.likes) newBlog.likes = 0

    const resultBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${result.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.likes).toEqual(0)
  })
})


describe('update', () => {
  test('a blog can be updated only with the number of likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const result = await api
      .post('/api/login')
      .send({
        username: userOne.username,
        password: 'secret'
      })
      .expect(200)

    const newBlog = {
      likes: 50,
      // user: userOneId
    }

    const resultBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${result.body.token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.likes).toBe(newBlog.likes)
    expect(resultBlog.body.author).toBe(blogToUpdate.author)
    expect(resultBlog.body.url).toBe(blogToUpdate.url)
  })
})


describe('deletion of a blog', () => {
  test('a blog can be deleted only by the person who created it', async () => {

    const result = await api
      .post('/api/login')
      .send({
        username: userOne.username,
        password: 'secret'
      })
      .expect(200)

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'me',
      url: 'me.com',
      likes: 1
    }

    const postingNewBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${result.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${postingNewBlog.body.id}`)
      .set('Authorization', `Bearer ${result.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(newBlog.title)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})
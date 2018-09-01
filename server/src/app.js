import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import db from './db'
import MiddleWare from './MiddleWare'
import Post from "../models/post";

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())


app.get('/getJWT', MiddleWare.genJWT, (req, res) => {
  console.log(req.token);
  res.send({
    token: req.token
  })
})

app.get('/testJWT', MiddleWare.chkToken, (req, res) => {
  res.send({
    "msg": "testJWT"
  })
})

app.get('/', MiddleWare.M2_fun, (req, res) => {
  res.send({
    "msg": "Welcome"
  })
})
// Add new post
app.post('/posts', (req, res) => {
  var db = req.db;
  var {
    title,
    description
  } = req.body;
  var new_post = new Post({
    title,
    description
  })

  new_post.save((error) => {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})

// Fetch all posts
app.get('/posts', MiddleWare.M1_fun, (req, res) => {
  Post.find({}, 'title description', (error, posts) => {
    if (error) {
      console.error(error);
    }
    res.send({
      posts
    })
  }).sort({
    _id: -1
  })
})

// Fetch single post
app.get('/post/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) {
      console.error(error);
    }
    res.send(post)
  })
})

// Update a post
app.put('/posts/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) {
      console.error(error);
    }

    post.title = req.body.title
    post.description = req.body.description
    post.save((error) => {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a post
app.delete('/posts/:id', (req, res) => {
  var db = req.db;
  Post.remove({
    _id: req.params.id
  }, (err, post) => {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 8081)
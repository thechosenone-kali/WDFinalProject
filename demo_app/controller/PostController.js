const express = require('express')
const { PostModel } = require('../model')
const { uuid } = require('uuidv4')

const router = express.Router()
var debug = require("debug")("PostController.js");

const checkLoggedIn = function(req, res, next) {
    if (req.session.loggedIn) {
      debug(
        "checkLoggedIn(), req.session.loggedIn:",
        req.session.loggedIn,
        "executing next()"
      );
      next();
    } else {
      debug(
        "checkLoggedIn(), req.session.loggedIn:",
        req.session.loggedIn,
        "rendering login"
      );
      res.render("login");
    }
  }

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now().toString())
    next()
})
// PATH: URL/users/
router.get('/:userId',checkLoggedIn, async function(req, res) {
    const { userId } = req.params
    const posts = await PostModel.findPostsByUserId(userId)
    console.log(posts)
    res.render('post', { data: posts || [] })
})


router.post('/create', checkLoggedIn, async function(req, res) {
    const { title, content } = req.body 
    const newPost = {
        id: uuid(),
        title: title,
        userId: req.session.userId,
        content: content,
        created: new Date()
    }
    try {
        await PostModel.createPost(newPost)
        // res.send({ status: true , data: newPost})
        res.redirect(`/posts/${req.session.userId}`)
    }
    catch(error) {
        console.log(error)
        res.send({
            status: false,
            msg: 'Unable to insert new Post',
            error
        })
    }
    
})

module.exports = router


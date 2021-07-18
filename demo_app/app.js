const express = require('express')
const createError = require('http-errors')
const path = require('path')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const bcrypt = require('bcrypt')
const app = express()
const fileupload = require('express-fileupload')

const UserController = require('./controller/UserController') 
const PostController = require('./controller/PostController')
const { UserModel } = require('./model')

var debug = require("debug")("app.js");
const saltRounds = 10
app.use(cookieParser())
app.use(
  session({
    secret: "dempapp",
    name: "app",
    resave: true,
    saveUninitialized: true,
    // cookie: { maxAge: 300_000_000 }
    // cookie: { maxAge: 6000 } /* 6000 ms? 6 seconds -> wut? :S */
  })
);
app.use(express.json())
app.use(express.urlencoded(({ extended: false })))
app.set('view engine', 'pug')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/users', UserController)
app.use('/posts', PostController)

app.use(fileupload())

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

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  debug("app.use", "ERROR", err.message);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const logout = function(req, res, next) {
  debug("logout()");
  req.session.loggedIn = false;
  res.redirect("/");
};

app.get('/', checkLoggedIn, async function (req, res) {
  const allUsers = await UserModel.getAllUsers() 
  res.render('index', { data: allUsers || [] })
})

app.get("/logout", logout, (req, res) => {
  res.render('login')
});

app.get('/register', function(req, res) {
  res.render('register')
})

app.post('/register',async function(req, res) {
  const { username, name, password, gender } = req.body 
    console.log(req.body)
   
    const newUser = {
        username: username,
        name: name,
        gender: gender
    }
    try {
        newUser.password = bcrypt.hashSync(password, saltRounds)
        await UserModel.insertUser(newUser)
        res.redirect('/login')
    }
    catch(error) {
        console.log(error)
       
  }
})

app.get('/login', function(req, res) {
  if(req.session.loggedIn) res.redirect('/')
  res.render('login', {error: null})
})

app.post('/login', async function(req, res) {
  const { username, password } = req.body     
    try {
        const user = await UserModel.findUserByUsername(username)
        // FAIL-FAST 
        console.log(username.trim() === user.username.trim())
        if(!user) throw new Error('Unauthorized')
        if(!bcrypt.compareSync(password, user.password)) throw new Error('Unauthorized due to wrong password!')
        req.session.loggedIn = true
        req.session.userId = user.id
        res.redirect('/')
    }
    catch(error) {
      console.log(error)
      res.render("login", { error: { type: "loginFailed", msg: 'Username or password is not correct!' }});
    }
})

app.post('/saveImage', (req, res) => {
  const fileName = req.files.myFile.name
  const path = __dirname + '/public/images/' + fileName
  const image = req.files.myFile

  image.mv(path, (error) => {
    if (error) {
      console.error(error)
      res.writeHead(500, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify({ status: 'error', message: error }))
      return
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({ status: 'success', path: '/img/houses/' + fileName }))
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  debug("app.use", req.path, 404);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  debug("app.use", "ERROR", err.message);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


app.listen(3000, function() {
    console.log('Start express server at port 3000')
})
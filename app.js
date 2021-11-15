require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//const http = require('http');
const app = express();
//const server = http.createServer(app);

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const findOrCreate = require('mongoose-findorcreate');

const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

app.use(session({
  secret: 'Our littee secret.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/onlyChats', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//mongoose.set('useCreateIndex', true);


const userSchema = new mongoose.Schema({
  userFirstName: String,
  userLastName: String,
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use('/', (req, res, next) => {
  req.User = User;
  req.passport = passport;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

const users = {};

const initChat = (_server) => {
  // socket.io setup
  // bascially saying that run the sockets on this server that I have created
  const io = require("socket.io")(_server);

  //we have to provide an event here, whenever someone comes to connect to the sever
  //All the users are given a unique socket id - they basically become a socket in the eyes of the server
  //This event will be called whenever a user joing our stuff
  io.on("connection",(socket) => {
      console.log(socket.id);
      //basically addding all the users to the object
      //the event name has to be the same as what we emit in the client
      socket.on("new-user-joined", (username) => {
        users[socket.id] = username;

        //we are broadcasting this to all the sockets 
        //we are emmiting the username to the client now
        socket.broadcast.emit('user-connected', username);

          //WE want to TARGET ALL THE SOCKETS AND NOT JUST THE ONE THAT IS BEING CONNECTED
          io.emit("user-list", users);
      });


      socket.on("disconnect", () => {
          socket.broadcast.emit("user-disconnected", user=users[socket.id]);
          delete users[socket.id];
          io.emit('user-list', users);
      });


      socket.on("message", (data) => {
          socket.broadcast.emit("message", {user: data.user, msg:data.msg});
      });
  });
};

app.initChat = initChat;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

//Gaurav's code ------------------------------------------------
//const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = require('./routes/index');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//const app = express();

// Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/key').MongoURI;

//Connect to Mongo
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
    .then(()=> console.log(`Mongodb Connected`))
    .catch((err)=> console.log(err));

//View Engine
//app.use(expressLayouts);
app.set('view engine','ejs');

//Body Parser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true
}))

//Passport middleware
app.use(passport.initialize()); // invoke serializeuser method
app.use(passport.session()); // invoke deserializuser method


//Connect Flash
app.use(flash())

//Globals vars 
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Gaurav's code end--------------------------------------------------------------


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

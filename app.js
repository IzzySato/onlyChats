require('dotenv').config();

const crypto = require('crypto');
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
const addFriendRouter = require('./routes/addFriend');
const privateRouter = require('./routes/privChat');
const router = require('./routes/index');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/addFriend', addFriendRouter);
app.use('/privChat', privateRouter);

const users = {};
const privateUsers = [];

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
        socket.broadcast.emit("user-disconnected", user = users[socket.id]);
        if(Object.keys(users).length != 0) {
          delete users[socket.id];
        }
        if(Object.keys(privateUsers).length != 0) {
          delete privateUsers[socket.id];
          console.log(privateUsers);
        }
        io.emit('user-list', users);
      });


      socket.on("message", (data) => {
          socket.broadcast.emit("message", {user: data.user, msg:data.msg});
      });


    /**PRIVATE CHAT LOGIC */
     if (privateUsers.length < 2) {
       socket.on("private-connection", (username) => {
        let user = {
          name: username,
          id: socket.id,
          key: null
        }
        privateUsers.push(user);

        /**Generate key logic here for each user that comes */
        if (privateUsers.length === 2) {

          const user1Key = crypto.createECDH('secp256k1');
          const user2Key = crypto.createECDH('secp256k1');

          user1Key.generateKeys();
          user2Key.generateKeys();

          const publicUser1Key = user1Key.getPublicKey().toString('base64');
          const publicUser2Key = user2Key.getPublicKey().toString('base64');
          
          const user1SharedKey = user1Key.computeSecret(publicUser2Key, 'base64', 'hex');
          const user2SharedKey = user2Key.computeSecret(publicUser1Key, 'base64', 'hex');
          
          privateUsers[0].key = user1SharedKey;
          privateUsers[1].key = user2SharedKey;
          // io.emit("encryption", privateUsers);
        }
        //  privateUsers[socket.id] = username;
         //this is where we can create generate the keys for the users
         //store it as an another to our username
         console.log("DEBUG- Printing the private users on the server side");
         console.log(privateUsers);
         //socket.emit(privateUSer -- usernames, keys, socketsID);
         //Emit the user there.
       });
     } else {
       console.log("No more than two users in private chat");   
     }


    //This is the place where the message is outgoing
    //wherever you see on, it means DO THIS WHEN YOU RECIEVE BLAH FROM SERVER
    socket.on('priv-message-outgoing', (data) => {
      // console.log("This encrypted data coming from this socket and this username " + data.user + " " + data.id);
      // console.log(data);

      let senderSharedKey;
      for(let i= 0; i < privateUsers.length; i++) {
          if (privateUsers[i].id === socket.id) {
            senderSharedKey = privateUsers[i].key;
          }
      }
      const IV = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
          'aes-256-gcm',
          Buffer.from(senderSharedKey, 'hex'),
          IV
      );

      let encrypted = cipher.update(data.msg, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const auth_tag = cipher.getAuthTag().toString('hex');

      const payload = IV.toString('hex') + encrypted + auth_tag;

      const payload64 = Buffer.from(payload, 'hex').toString('base64');
      console.log("Printing the Encrypted");
      console.log(payload64);
      //payload one is the encrypted message
      let receiverId;
      for(let i = 0; i < 2; i++) {
        if(privateUsers[i].id != data.id) {
          receiverId = privateUsers[i].id
        }
      }
      //decrypt data here
      const receiverPayload = Buffer.from(payload64, 'base64').toString('hex');

      const receiver_iv = receiverPayload.substr(0, 32);
      const receiver_encrypted = receiverPayload.substr(32, receiverPayload.length - 32 - 32);
      const receiver_auth_tag = receiverPayload.substr(receiverPayload.length - 32, 32);

      
      let receiverSharedKey;
      for(let i= 0; i < privateUsers.length; i++) {
          if (privateUsers[i].id === receiverId) {
            receiverSharedKey = privateUsers[i].key;
          }
      }
      try{
        const decipher = crypto.createDecipheriv(
          'aes-256-gcm',
          Buffer.from(receiverSharedKey, 'hex'),
          Buffer.from(receiver_iv, 'hex')
        );
  
        decipher.setAuthTag(Buffer.from(receiver_auth_tag, 'hex'));
  
        let decrypted = decipher.update(receiver_encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        //find the public key for receiverid 
        data.msg = decrypted;
        io.to(receiverId).emit("priv-message-incoming", data);
        
      } catch (error) {
        console.log(error);
      }
      
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


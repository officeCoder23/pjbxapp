const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const superagent = require('superagent');
const pm3 = require('./pm/pm3');

dotenv.config({ path: '.env' });

// TODO: Change this
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/PJBX') // Replace "nkp" with "PJBX"
  .catch((err) => {
    console.error(err);
    console.warn('%s MongoDB connection error. Please make sure MongoDB is running.', '✗');
    process.exit();
  });



const app = express();
app.set('port', process.env.HOST_PORT);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


app.post('/PJBX/admin/login', (req, res) => { // Replace "/nkp" with "/PJBX"
  const finishError = (msg, codeNum = 900) => {
    const messageObj = {
      status: "Error",
      code: codeNum,
      message: msg
    };
    res.json(messageObj);
  };
});


/** TGBOT Router */
const tgBotRouter = require('./tgbot');
app.use(`/${process.env.SITE_AUTH}/`, tgBotRouter);


const server = http.createServer(app);

server.listen(process.env.HOST_PORT, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = 'Port ' + process.env.HOST_PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  const addr = server.address();
  console.log(`Listening on ${process.env.HOST_IP}:${process.env.HOST_PORT}`);

  pm3.listen(process.env.PM3_PORT, 'localhost', () => {
    console.log(`Started PM3 to listen on ${process.env.PM3_PORT}`);
    superagent.get(`http://localhost:${process.env.PM3_PORT}/start`)
      .end((err, resp) => {
        if (err) console.error(err);
        console.log("Started Child Process with PM3....");
      });
  });
}

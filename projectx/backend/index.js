require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());

//Initializing express
app.get('/', (req, res) => {
  console.log('App is running');
  res.send('Hi, this is the start of something great');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express server started at ${PORT}`);
});

//Initializing mongoose
let mongoose = require('mongoose');
const User = require('./Model/user');
const { response } = require('express');

mongoose.connect(process.env.DB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to DB');
});

app.post('/register', async (req, res) => {
  console.log('Registering User: ' + req.body.firstName);
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(user.email);
    if (user) {
      res.send('Email already exists, please use new email');
    } else {
      req.body.password = await bcrypt.hash(req.body.password, 7);
      // bcrypt.hash(req.body.password, 7).then(function(result) {
      //     console.log(result); //
      //     req.body.password = result;
      // })
      const regUser = new User(req.body);
      regUser.save((err, output) => {
        if (err) return console.error('ERROR: ' + err);
        console.log('Saved the user into DB');
        console.log(output);
      });
      res.send('Updated user in DB');
    }
  } catch (err) {
    console.error('ERROR: ' + err);
    res.sendStatus(500);
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

app.post('/api/auth', async (req, res) => {
  try {
    console.log('Entered Auth');
    const user = await User.findOne({ email: req.body.email });
    console.log('User email: ' + user.email);
    tokenUser = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const accessToken = generateAccessToken(tokenUser);
        const refreshToken = jwt.sign(
          tokenUser,
          process.env.REFRESH_TOKEN_SECRET
        );

        const updateRes = await User.findOneAndUpdate(
          { email: user.email },
          { refreshToken: refreshToken }
        );
        await updateRes.save();
        console.log('User validated, Access token is ' + accessToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        console.log('Passwords does not match');
        res.sendStatus(401);
      }
    } else {
      console.log('User not found');
      res.sendStatus(403);
    }
  } catch (err) {
    console.log('Error: ' + err);
    res.sendStatus(500);
  }
});

app.post('/api/token', async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    const fetchingToke = await User.findOne({ refreshToken: refreshToken });
    if (!fetchingToke) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = generateAccessToken({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      res.json({ accessToken: accessToken });
    });
  } catch (err) {
    console.log('Err' + err);
    res.sendStatus(500);
  }
});

app.delete('/api/logout', (req, res) => {
  User.findOne({ email: req.body.email }, (err, doc) => {
    if (err) return res.sendStatus(403);
    doc.refreshToken = '';
    doc.save();
    return res.send('Successfully logged out. Thank you!');
  });
});

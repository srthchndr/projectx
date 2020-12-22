const express = require('express');
<<<<<<< HEAD
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());

//Initializing express
app.get('/', (req, res) => {
    console.log("App is running");
    res.send("Hi, this is the start of something great")
});

const PORT = process.env.PORT || 12345;
app.listen(PORT,()=>{
    console.log(`Express server started at ${PORT}`);
})

//Initializing mongoose
let mongoose = require('mongoose');
const User = require('./Model/user');
const { response } = require('express');

mongoose.connect('mongodb+srv://admin:admin@cluster0.ovgal.mongodb.net/registration-details?retryWrites=true&w=majority', {useNewUrlParser: true,
useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DB");
});

app.post('/register', async (req, res) => {
    console.log("Registering User: " + req.body.firstName);
    try{
        const user = await User.findOne({ email: req.body.email });
    // console.log(user.email);
    if(user){
        res.send("Email already exists, please use new email");
    }else{
        req.body.password = await bcrypt.hash(req.body.password, 7);
        // bcrypt.hash(req.body.password, 7).then(function(result) {
        //     console.log(result); //
        //     req.body.password = result;
        // })
        const regUser = new User(req.body);
        regUser.save((err, output) => {
            if(err) return console.error("ERROR: " + err); 
            console.log("Saved the user into DB");
            console.log(output);
        })
            res.send("Received response and is successful");
    } 
    }catch(err) {
        console.error("ERROR: " + err);
    }  

});

app.post('/login', async(req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email });

        if(user){
            const result = await  bcrypt.compare(req.body.password, user.password)
            if(result){
                console.log("User validated.");
                res.send("Passwords Matched");
            }else{
                console.log("Passwords does not match");
                res.send("Passwords does not match");
            }
        }else{
            console.log("User not found");
            res.send("error")
        }
    }catch(err){
        console.log("Error: " + err);
    }
});
=======
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cors = require('cors');
const jwt_decode = require('jwt-decode');

const app = express(); 

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(expressJwt({ secret: 'todo-app-super-shared-secret', algorithms: ['HS256'], requestProperty: 'auth' }).unless({path: ['/api/auth', ]}));

var checkRefreshNeeded = function (req, res, next) {
    if ( req.path == '/api/auth' || req.path == '/refresh') {
        return next();
    }
    console.log('Check Refresh');
    console.log(req.auth);
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let token = req.headers.authorization.split(' ')[1];        
        let decodedToken = jwt_decode(token);
        let d1 = new Date();
        let d2 = new Date(decodedToken.exp * 1000);
        let timeRemaining = (d2 - d1)/1000;
        console.log(timeRemaining);
        if(timeRemaining < 60) {
            res.sendStatus(401);
        }
        else{
            next();
        }
    }
    else {
        next();
    }
  }
  
app.use(checkRefreshNeeded);

app.post('/api/auth', function(req, res) {
    console.log(req.body);
    
    const body = req.body;
    
    //check username and password in db and send token if valid user record is found
    if(body.password != 'password') return res.sendStatus(401);
    
    let token = jwt.sign({ userID: 2, role: 'admin' }, 'todo-app-super-shared-secret', { expiresIn: '75000' });
    res.send({ auth_token: token, refresh_token: 'RefreshToken' });
});

app.post('/refresh', function(req, res) {
    console.log(req.body);
    
    const body = req.body;
    
    if(body.refreshToken != 'RefreshToken') return res.sendStatus(401);
    
    let token = jwt.sign({userID: 2, role: 'admin'}, 'todo-app-super-shared-secret', {expiresIn: '75000'});
    res.send({ auth_token: token, refresh_token: 'RefreshToken' });
});

app.get('/testdata', (req, res, next) => { 
    console.log("get /testdata"); 
    console.log(req.auth.userID);
    res.send({ 1: 'testing', 2: 'tester'});
}) 

const server = app.listen(3000, function () {
    let port = server.address().port 
    // Starting the Server at the port 3000 
    console.log(`Started on PORT ${port}`);
}) 
>>>>>>> 578ff160392e402713642084a2721129ab823e28

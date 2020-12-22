const express = require('express');
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

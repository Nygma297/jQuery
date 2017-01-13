var exp = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var User = require('./models/user');
var Contact =  require('./models/model')
var app = exp();
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
mongoose.connect('mongodb://localhost/cbdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//session
app.use(session({
    secret: 'Secret'
}));
//passport
app.use(passport.initialize(), (req, res, c)=>{
    console.log('Initializing passport');
    c();
});
app.use(passport.session(), (req, res, c)=>{
    console.log("Initializing Session!");
    c();
});
app.use(exp.static(path.join(__dirname, 'web')));



//validator
app.use(expressValidator({
    errorFormatter: (param, msg, value)=> {
        let namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


app.use('/app/home',(req,rea,cb)=>{
    console.log('Requesting '+req.url);
    cb();
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
        console.log("Authenticating"+req.session.user);
		return next();
	} else {
        console.log("Authentication failed");
		res.redirect('/app/in');
	}
}

passport.serializeUser(function(data, done) {
    console.log('Serializing', data);
    done(null, data._id);
});

passport.deserializeUser(function(id, done) {
    console.log('De-serializing');
    User.getUserById(id, function(err, user) {
        console.log('getting by idd');
        done(err, user);
    });
});


passport.use('local', new LocalStrategy(
    function(username, password, done) {
       let email=username;
       let pass=password;
        console.log("into LocalStrategy ", password);
        User.getUserByUsername(email, function(err, data){

            console.log('Into callback',err,data);
            let x = data;
   	        if(err) throw err;
            if(!data){
                console.log("invalid password");
                return done(null, false, {message: 'ID not registered Please register!'});
   	        }

               User.comparePassword(pass, data['pass'], function(err, data){
   	            if(err) throw err;
                if(data){
                    console.log(x);
       		        return done(null, x);
   	   	        } else {
                        console.log('failed');
        	        return done(null, false, {message: 'Invalid password!'});
   	            }
            });
        });
    }   
));

//login module
app.get('/app/in', (req, res)=> {
	res.redirect('login.html');
});

app.post('/app/login', passport.authenticate('local', {successRedirect:'/app/home', failureRedirect:'/app/in'}),
  (req, res)=> {
    res.redirect('/app/home');
  });
// Module end
app.post('/app/login',(req,res)=>{
console.log("login"+JSON.stringify(req.body));
    res.send("wah bhai wah");
})
//Register Module
app.get('/app/reg', (req, res)=>{
	res.redirect('register.html');
});
app.get('/app/register', (req, res)=> {
    User.createUser(req.query, (err, user)=> {
		if(err) throw err;
		console.log(user);
	});
	res.redirect('app/login');
 });


app.get('/app/home', ensureAuthenticated, (req, res)=> {
    console.log("Going home");
    res.redirect("index.html")
});
app.get('/',(req, res)=>{
    res.redirect('/app/home');
})

// Module end


// Logout Module
app.get('/app/out', (req, res)=>{
	req.logout();
});

// Module end

app.post('/app/user/save', (req, res)=> {

    let newEntry = new Contact();
    let w = newEntry.userid = req.user.id;
    let x = newEntry.name = req.body.name;
    let y = newEntry.email = req.body.email;
    let z = newEntry.mobile = req.body.mobile;
    console.log("lol",x,y,z);
    newEntry.save((err, data)=> {
        if(err) {
            res.send('error saving data');
        } else {
            console.log(data);
            res.redirect('/app/home');
        }
    });
})

app.get('/app/delete', (req, res)=> {
    let x = req.query.id;
    console.log("Inside node Delete")
    console.log(x);
    Contact.findOneAndRemove({'_id':x}, (err, data)=> {
        if(err) {
            res.send('error removing')
        } else {
            res.redirect('/app/home');
        }});
    });
	
app.get("/app/user/contacts", (req,res)=> {
    console.log('getting all contacts ');
    var temp = Contact.find({})
    .exec((err, contacts)=> {
        if(err) {
            res.send('error occured')
        } else {
            console.log(contacts);
            res.send(contacts);
        }
    });
})

app.listen(8081, ()=> {
  console.log('Server running on http://localhost:' + 8081);
});
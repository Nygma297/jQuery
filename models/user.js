var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var salt = '$2a$04$/VN/w3ktES8MKWqhLIckpe';

// User Schema
var UserSchema = new Schema({
    name:String,
    mobile:Number,
    email:String,
	pass:{
		type : String,
		required : true
}
});

var User = mongoose.model('User', UserSchema);
exports.User = User;
exports.createUser = (userDetails, callback)=> {
		bcrypt.hash(userDetails.pwd, salt, (err, hash)=> {
			if(err){
				return console.error(err);
			}
			let newUser = new User();

			newUser.name = userDetails.name;
			newUser.email = userDetails.email;
			newUser.mobile = userDetails.mobile;
			newUser.pass = hash;
	        newUser.save(callback);
	   
	});
}
//*/
exports.getUserByUsername = (email, callback)=> {
	console.log('Getting user');
	let query = {email: email};
	User.findOne(query, callback);
}

exports.getUserById = (id, callback)=> {
	console.log('getting ID');
	User.findById(id,callback);
}

// exports.comparePassword = function(candidateUser, candidatePass, salt, callback){
	// User.findOne({"email":candidateUser}, function(err, data){
	// 	var x = data["pass"];
	// })
	// console.log(x);
	// bcrypt.compare(candidatePass, x, function( err, isMatch) {
    // 	if(err) throw err;
	// 	if(isMatch){
	// 		callback(null, isMatch);
	// 		console.log(x);
	// 	}
	// });
// }
exports.comparePassword = (candidatePass, salt, callback)=> {
	console.log('comparing pass',candidatePass);
	bcrypt.compare(candidatePass, salt, (err, isMatch)=> {
    	if(err) throw err;
		console.log('Password match is ',isMatch);
    	callback(null, isMatch);
	});
}
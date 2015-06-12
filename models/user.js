var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    meta: {
        unPublished: [{
            type: Schema.ObjectId,
            ref: 'Argument'
        }],
        published: [{
            type: Schema.ObjectId,
            ref: 'Argument'
        }]
    }
});

/* Encryption methods 
 * If you're looking here and are a security pro, 
 * feel free to dive in and improve!  Or give us some pointers!
 * Although admittadly we don't have any huge value stored yet
=========================================================================*/

// generating a hash, storing it as the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password);
};

// taking the login password, comparing it against the hashSync
userSchema.methods.validPassword = function(password) {
	//this.local.password is the hash that was generated
	return bcrypt.compareSync(password, this.local.password); // true
};


/* creates a model and exports it for the app to use */
module.exports = mongoose.model('User', userSchema);
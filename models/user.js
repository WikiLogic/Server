var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    gravatar = require('gravatar');

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
        alias: String,
        gravatar: String,
        unPublished: [{
            type: Schema.Types.ObjectId,
            ref: 'Claim'
        }],
        published: [{
            type: Schema.Types.ObjectId,
            ref: 'Claim'
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

userSchema.pre('save', function (next) {
  if (!this.meta.gravatar) this.meta.gravatar = gravatar.url(this.local.email);
  next();
})


/* creates a model and exports it for the app to use */
module.exports = mongoose.model('User', userSchema);
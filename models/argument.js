
//var mongoose = require('mongoose');

/**
 * The Argument Schema
 * status: true means this is a supporting argument
 */

/*
var argumentSchema = mongoose.Schema({

    status: {
        type: Boolean,
        defaut: false
    }
    reasons: [{
        type: Schema.ObjectId,
        ref: 'Claim',
        default: []
    }]

});

*/
/* Argument methods 
=========================================================================*/

// generating a hash, storing it as the password
/*argumentSchema.methods.evaluate = function() {
    //check claims
    return true;
};
*/

/* creates a model and exports it for the app to use */
//module.exports = mongoose.model('Argument', argumentSchema);
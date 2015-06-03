var mongoose = require('mongoose');

var claimSchema = mongoose.Schema({
    description: {
        type: String,
        default: '',
        required: 'Please fill Statement name',
        trim: true
    },
    axiom: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    supporting: [{
            type: Schema.ObjectId,
            ref: 'Argument'
    }],
    opposing: [{
            type: Schema.ObjectId,
            ref: 'Argument'
    }],
    usedIn: [{
            type: Schema.ObjectId,
            ref: 'Argument'
    }],
    meta: {
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now
        },
        statusChangeCount: Number,
        viewCount: Number

    }
});

/* Evaluation methods 
 * 
=========================================================================*/

// Check groups to see if the statement is true
claimSchema.methods.evaluate = function() {
    //
    return true;
};



/* creates a model and exports it for the app to use */
module.exports = mongoose.model('Claim', claimtSchema);
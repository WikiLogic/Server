var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
 * Draft Claims are Claims in progress being worked on by a user.
 * They are not public and cannot be added as a reason within an argument.
 * They require at least one argument before being published.
 * The user model has a refrence to draft claims - (user refrence has been removed from this modal)
 */

var draftClaimSchema = mongoose.Schema({
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
            status: {
                type: Boolean,
                defaut: false
            },
            reasons: [{
                    type: Schema.ObjectId,
                    ref: 'Claim'
            }]
    }],
    opposing: [{
            status: {
                type: Boolean,
                defaut: false
            },
            reasons: [{
                    type: Schema.ObjectId,
                    ref: 'Claim'
            }]
    }],
    meta: {
        author: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }
});

/* Evaluation methods 
 * 
=========================================================================*/

/* If there isn't a date, set the creation date to now! */
draftClaimSchema.pre('save', function (next) {
  if (!this.meta.created) this.meta.created = new Date;
  next();
})

// Check arguments to see if the statement is true
draftClaimSchema.methods.evaluate = function() {
    //
    return true;
};



/* creates a model and exports it for the app to use */
module.exports = mongoose.model('DraftClaim', draftClaimSchema);
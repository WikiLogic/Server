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
    arguments: [{
            argNum: {
                type: Number,
                default:0
            }
            supporting:{
                type: Boolean,
                default: false
            },
            status: {
                type: Boolean,
                default:false
            },
            reasons: [{
                    type: Schema.ObjectId,
                    ref: 'Claim',
                    default: []
            }],
            default: []
    }],
    meta: {
        user: {
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

// Check groups to see if the statement is true
claimSchema.methods.evaluate = function() {
    //
    return true;
};



/* creates a model and exports it for the app to use */
module.exports = mongoose.model('Claim', claimtSchema);
import 'babel-polyfill'; //for older browsers
var WL_STATE = require('./state/WL_STATE.js');

console.log('WL_STATE: ', WL_STATE);
rivets.bind($('#god'), WL_STATE);

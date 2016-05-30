import 'babel-polyfill'; //for older browsers

require('script!./third_party/sightglass.js');
require('script!./third_party/rivets.js');
require('script!./third_party/jquery.js');

var WL_STATE = require('./state/WL_STATE.js');

rivets.bind($('#god'), WL_STATE);

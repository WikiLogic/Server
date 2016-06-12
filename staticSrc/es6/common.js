//first, init the global state
WL_STATE = require('./state/WL_STATE');

console.log('WL_STATE: ', WL_STATE);


var search = require('./dom_watchers/search-input');
console.log('initting search');
search.init();

var tabs = require('./dom_watchers/tabs');
tabs.init();
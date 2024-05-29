const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const defaultTTL = 86400;
let cacher = {

    addToCache: function add(key, value) {
        success = myCache.set( key, value, defaultTTL);
    },
    
    retrieveFromCache: function retrieve(key) {
        let value = myCache.get( key );
        if ( value === undefined ){
            // handle miss!
        }
      //  console.log("The value is...",value);
        return value;
    },
};

module.exports = cacher;
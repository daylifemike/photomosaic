(function (jQuery, window) {

    function registerNamespace(ns, raw) {
        var nsParts = ns.split('.');
        var root = window;
        for (var i = 0; i < nsParts.length; i++) {
            if (typeof root[nsParts[i]] == 'undefined') {
                root[nsParts[i]] = (raw) ? raw : {};
            }
            root = root[nsParts[i]];
        }
    }

    // verbatim from jQuery Migrate 1.2.1
    jQuery.sub = function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }

            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
    };

    

    
    registerNamespace('PhotoMosaic.$', jQuery || {});
    registerNamespace('PhotoMosaic.Utils');
    registerNamespace('PhotoMosaic.Inputs');
    registerNamespace('PhotoMosaic.Loader');
    registerNamespace('PhotoMosaic.Layouts');
    registerNamespace('PhotoMosaic.Plugins');
    registerNamespace('PhotoMosaic.ErrorChecks');
    registerNamespace('PhotoMosaic.Mosaics', []);
    registerNamespace('PhotoMosaic.version', '2.9');

}(jQuery, window));
/*
    Modernizr 2.8.3 (Custom Build) | MIT & BSD
    Build: http://modernizr.com/download/#-csstransforms-csstransitions-prefixed-testprop-testallprops-prefixes-domprefixes
    // Extra > Add CSS Classes + prefix "PM_"
*/
(function(window){
    window.PhotoMosaic.Plugins.Modernizr = function(a,b,c){function y(a){j.cssText=a}function z(a,b){return y(m.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.csstransforms=function(){return!!E("transform")},q.csstransitions=function(){return E("transition")};for(var F in q)x(q,F)&&(v=F.toLowerCase(),e[v]=q[F](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" PM_"+(b?"":"no-")+a),e[a]=b}return e},y(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return C([a])},e.testAllProps=E,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" PM_js PM_"+t.join(" PM_")+" ":""),e}(this,this.document);
}(window));
/*!
 * imagesLoaded PACKAGED v3.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


/*!
 * EventEmitter v4.2.6 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */
(function () {
    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in it's storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (typeof evt === 'object') {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after it's first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of it's properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (type === 'object') {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define('eventEmitter/EventEmitter',[],function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        this.EventEmitter = EventEmitter;
    }
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */
/*jshint browser: true, undef: true, unused: true */
/*global define: false */
(function( window ) {
    var docElem = document.documentElement;
    var bind = function() {};

    function getIEEvent( obj ) {
        var event = window.event;
        // add event.target
        event.target = event.target || event.srcElement || obj;
        return event;
    }

    if ( docElem.addEventListener ) {
        bind = function( obj, type, fn ) {
            obj.addEventListener( type, fn, false );
        };
    } else if ( docElem.attachEvent ) {
        bind = function( obj, type, fn ) {
            obj[ type + fn ] = fn.handleEvent ?
                function() {
                    var event = getIEEvent( obj );
                    fn.handleEvent.call( fn, event );
                } :
                function() {
                    var event = getIEEvent( obj );
                    fn.call( obj, event );
                };
            obj.attachEvent( "on" + type, obj[ type + fn ] );
        };
    }

    var unbind = function() {};

    if ( docElem.removeEventListener ) {
        unbind = function( obj, type, fn ) {
            obj.removeEventListener( type, fn, false );
        };
    } else if ( docElem.detachEvent ) {
        unbind = function( obj, type, fn ) {
            obj.detachEvent( "on" + type, obj[ type + fn ] );
            try {
                delete obj[ type + fn ];
            } catch ( err ) {
                // can't delete window object properties
                obj[ type + fn ] = undefined;
            }
        };
    }

    var eventie = {
        bind: bind,
        unbind: unbind
    };

    // transport
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( 'eventie/eventie',eventie );
    } else {
        // browser global
        window.eventie = eventie;
    }
})( this );

/*!
 * imagesLoaded v3.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
(function( window, factory ) { 
    // universal module definition
    /*global define: false, module: false, require: false */
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( [
            'eventEmitter/EventEmitter',
            'eventie/eventie'
        ], function( EventEmitter, eventie ) {
            return factory( window, EventEmitter, eventie );
        });
    } else if ( typeof exports === 'object' ) {
        // CommonJS
        module.exports = factory(
            window,
            require('eventEmitter'),
            require('eventie')
        );
    } else {
        // browser global
        window.PhotoMosaic.Plugins.imagesLoaded = factory(
            window,
            window.EventEmitter,
            window.eventie
        );
    }
})( this,

// --------------------------  factory -------------------------- //
function factory( window, EventEmitter, eventie ) {
    var $ = window.jQuery;
    var console = window.console;
    var hasConsole = typeof console !== 'undefined';

    // -------------------------- helpers -------------------------- //
    // extend objects
    function extend( a, b ) {
        for ( var prop in b ) {
            a[ prop ] = b[ prop ];
        }
        return a;
    }

    var objToString = Object.prototype.toString;
    function isArray( obj ) {
        return objToString.call( obj ) === '[object Array]';
    }

    // turn element or nodeList into an array
    function makeArray( obj ) {
        var ary = [];
        if ( isArray( obj ) ) {
            // use object if already an array
            ary = obj;
        } else if ( typeof obj.length === 'number' ) {
            // convert nodeList to array
            for ( var i=0, len = obj.length; i < len; i++ ) {
                ary.push( obj[i] );
            }
        } else {
            // array of single index
            ary.push( obj );
        }
        return ary;
    }

    // -------------------------- imagesLoaded -------------------------- //
    /**
     * @param {Array, Element, NodeList, String} elem
     * @param {Object or Function} options - if function, use as callback
     * @param {Function} onAlways - callback function
     */
    function ImagesLoaded( elem, options, onAlways ) {
        // coerce ImagesLoaded() without new, to be new ImagesLoaded()
        if ( !( this instanceof ImagesLoaded ) ) {
            return new ImagesLoaded( elem, options );
        }
        // use elem as selector string
        if ( typeof elem === 'string' ) {
            elem = document.querySelectorAll( elem );
        }

        this.elements = makeArray( elem );
        this.options = extend( {}, this.options );

        if ( typeof options === 'function' ) {
            onAlways = options;
        } else {
            extend( this.options, options );
        }

        if ( onAlways ) {
            this.on( 'always', onAlways );
        }

        this.getImages();

        if ( $ ) {
            // add jQuery Deferred object
            this.jqDeferred = new $.Deferred();
        }

        // HACK check async to allow time to bind listeners
        var _this = this;
        setTimeout( function() {
            _this.check();
        });
    }

    ImagesLoaded.prototype = new EventEmitter();

    ImagesLoaded.prototype.options = {};

    ImagesLoaded.prototype.getImages = function() {
        this.images = [];

        // filter & find items if we have an item selector
        for ( var i=0, len = this.elements.length; i < len; i++ ) {
            var elem = this.elements[i];
            // filter siblings
            if ( elem.nodeName === 'IMG' ) {
                this.addImage( elem );
            }
            // find children
            var childElems = elem.querySelectorAll('img');
            // concat childElems to filterFound array
            for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
                var img = childElems[j];
                this.addImage( img );
            }
        }
    };

    /**
     * @param {Image} img
     */
    ImagesLoaded.prototype.addImage = function( img ) {
        var loadingImage = new LoadingImage( img );
        this.images.push( loadingImage );
    };

    ImagesLoaded.prototype.check = function() {
        var _this = this;
        var checkedCount = 0;
        var length = this.images.length;
        this.hasAnyBroken = false;
        // complete if no images
        if ( !length ) {
            this.complete();
            return;
        }

        function onConfirm( image, message ) {
            if ( _this.options.debug && hasConsole ) {
                console.log( 'confirm', image, message );
            }

            _this.progress( image );
            checkedCount++;
            if ( checkedCount === length ) {
                _this.complete();
            }
            return true; // bind once
        }

        for ( var i=0; i < length; i++ ) {
            var loadingImage = this.images[i];
            loadingImage.on( 'confirm', onConfirm );
            loadingImage.check();
        }
    };

    ImagesLoaded.prototype.progress = function( image ) {
        this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
        // HACK - Chrome triggers event before object properties have changed. #83
        var _this = this;
        setTimeout( function() {
            _this.emit( 'progress', _this, image );
            if ( _this.jqDeferred && _this.jqDeferred.notify ) {
                _this.jqDeferred.notify( _this, image );
            }
        });
    };

    ImagesLoaded.prototype.complete = function() {
        var eventName = this.hasAnyBroken ? 'fail' : 'done';
        this.isComplete = true;
        var _this = this;
        // HACK - another setTimeout so that confirm happens after progress
        setTimeout( function() {
            _this.emit( eventName, _this );
            _this.emit( 'always', _this );
            if ( _this.jqDeferred ) {
                var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
                _this.jqDeferred[ jqMethod ]( _this );
            }
        });
    };

    // -------------------------- jquery -------------------------- //
    if ( $ ) {
        $.fn.imagesLoaded = function( options, callback ) {
            var instance = new ImagesLoaded( this, options, callback );
            return instance.jqDeferred.promise( $(this) );
        };
    }

    // --------------------------  -------------------------- //
    function LoadingImage( img ) {
        this.img = img;
    }

    LoadingImage.prototype = new EventEmitter();

    LoadingImage.prototype.check = function() {
        // first check cached any previous images that have same src
        var resource = cache[ this.img.src ] || new Resource( this.img.src );
        if ( resource.isConfirmed ) {
            this.confirm( resource.isLoaded, 'cached was confirmed' );
            return;
        }

        // If complete is true and browser supports natural sizes,
        // try to check for image status manually.
        if ( this.img.complete && this.img.naturalWidth !== undefined ) {
            // report based on naturalWidth
            this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
            return;
        }

        // If none of the checks above matched, simulate loading on detached element.
        var _this = this;
        resource.on( 'confirm', function( resrc, message ) {
            _this.confirm( resrc.isLoaded, message );
            return true;
        });

        resource.check();
    };

    LoadingImage.prototype.confirm = function( isLoaded, message ) {
        this.isLoaded = isLoaded;
        this.emit( 'confirm', this, message );
    };

    // -------------------------- Resource -------------------------- //
    // Resource checks each src, only once
    // separate class from LoadingImage to prevent memory leaks. See #115

    var cache = {};

    function Resource( src ) {
        this.src = src;
        // add to cache
        cache[ src ] = this;
    }

    Resource.prototype = new EventEmitter();

    Resource.prototype.check = function() {
        // only trigger checking once
        if ( this.isChecked ) {
            return;
        }
        // simulate loading on detached element
        var proxyImage = new Image();
        eventie.bind( proxyImage, 'load', this );
        eventie.bind( proxyImage, 'error', this );
        proxyImage.src = this.src;
        // set flag
        this.isChecked = true;
    };

    // ----- events ----- //

    // trigger specified handler for event type
    Resource.prototype.handleEvent = function( event ) {
        var method = 'on' + event.type;
        if ( this[ method ] ) {
            this[ method ]( event );
        }
    };

    Resource.prototype.onload = function( event ) {
        this.confirm( true, 'onload' );
        this.unbindProxyEvents( event );
    };

    Resource.prototype.onerror = function( event ) {
        this.confirm( false, 'onerror' );
        this.unbindProxyEvents( event );
    };

    // ----- confirm ----- //

    Resource.prototype.confirm = function( isLoaded, message ) {
        this.isConfirmed = true;
        this.isLoaded = isLoaded;
        this.emit( 'confirm', this, message );
    };

    Resource.prototype.unbindProxyEvents = function( event ) {
        eventie.unbind( event.target, 'load', this );
        eventie.unbind( event.target, 'error', this );
    };

    // -----  ----- //
    return ImagesLoaded;
});
/*
    Version: 2.0.5a
    Modified by Mike Kafka (http://codecanyon.net/user/makfak) to serve my own purposes
     - #28 - reference custom $ instance (root.jQuery >>> root.jQuery)
     - #41,42 - custom event namespaces to prevent colisions with other waypoints instances
*/
// Generated by CoffeeScript 1.6.2
/*!
jQuery Waypoints - v2.0.5
Copyright (c) 2011-2014 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define('waypoints', ['jquery'], function($) {
        return factory($, root);
      });
    } else {
      return factory(root.jQuery, root);
    }
  })(window, function($, window) {
    var $w, Context, Waypoint, allWaypoints, contextCounter, contextKey, contexts, isTouch, jQMethods, methods, resizeEvent, scrollEvent, waypointCounter, waypointKey, wp, wps;

    $w = $(window);
    isTouch = __indexOf.call(window, 'ontouchstart') >= 0;
    allWaypoints = {
      horizontal: {},
      vertical: {}
    };
    contextCounter = 1;
    contexts = {};
    contextKey = 'waypoints-context-id';
    resizeEvent = 'resize.waypoints_pm';
    scrollEvent = 'scroll.waypoints_pm';
    waypointCounter = 1;
    waypointKey = 'waypoints-waypoint-ids';
    wp = 'waypoint';
    wps = 'waypoints';
    Context = (function() {
      function Context($element) {
        var _this = this;

        this.$element = $element;
        this.element = $element[0];
        this.didResize = false;
        this.didScroll = false;
        this.id = 'context' + contextCounter++;
        this.oldScroll = {
          x: $element.scrollLeft(),
          y: $element.scrollTop()
        };
        this.waypoints = {
          horizontal: {},
          vertical: {}
        };
        this.element[contextKey] = this.id;
        contexts[this.id] = this;
        $element.bind(scrollEvent, function() {
          var scrollHandler;

          if (!(_this.didScroll || isTouch)) {
            _this.didScroll = true;
            scrollHandler = function() {
              _this.doScroll();
              return _this.didScroll = false;
            };
            return window.setTimeout(scrollHandler, $[wps].settings.scrollThrottle);
          }
        });
        $element.bind(resizeEvent, function() {
          var resizeHandler;

          if (!_this.didResize) {
            _this.didResize = true;
            resizeHandler = function() {
              $[wps]('refresh');
              return _this.didResize = false;
            };
            return window.setTimeout(resizeHandler, $[wps].settings.resizeThrottle);
          }
        });
      }

      Context.prototype.doScroll = function() {
        var axes,
          _this = this;

        axes = {
          horizontal: {
            newScroll: this.$element.scrollLeft(),
            oldScroll: this.oldScroll.x,
            forward: 'right',
            backward: 'left'
          },
          vertical: {
            newScroll: this.$element.scrollTop(),
            oldScroll: this.oldScroll.y,
            forward: 'down',
            backward: 'up'
          }
        };
        if (isTouch && (!axes.vertical.oldScroll || !axes.vertical.newScroll)) {
          $[wps]('refresh');
        }
        $.each(axes, function(aKey, axis) {
          var direction, isForward, triggered;

          triggered = [];
          isForward = axis.newScroll > axis.oldScroll;
          direction = isForward ? axis.forward : axis.backward;
          $.each(_this.waypoints[aKey], function(wKey, waypoint) {
            var _ref, _ref1;

            if ((axis.oldScroll < (_ref = waypoint.offset) && _ref <= axis.newScroll)) {
              return triggered.push(waypoint);
            } else if ((axis.newScroll < (_ref1 = waypoint.offset) && _ref1 <= axis.oldScroll)) {
              return triggered.push(waypoint);
            }
          });
          triggered.sort(function(a, b) {
            return a.offset - b.offset;
          });
          if (!isForward) {
            triggered.reverse();
          }
          return $.each(triggered, function(i, waypoint) {
            if (waypoint.options.continuous || i === triggered.length - 1) {
              return waypoint.trigger([direction]);
            }
          });
        });
        return this.oldScroll = {
          x: axes.horizontal.newScroll,
          y: axes.vertical.newScroll
        };
      };

      Context.prototype.refresh = function() {
        var axes, cOffset, isWin,
          _this = this;

        isWin = $.isWindow(this.element);
        cOffset = this.$element.offset();
        this.doScroll();
        axes = {
          horizontal: {
            contextOffset: isWin ? 0 : cOffset.left,
            contextScroll: isWin ? 0 : this.oldScroll.x,
            contextDimension: this.$element.width(),
            oldScroll: this.oldScroll.x,
            forward: 'right',
            backward: 'left',
            offsetProp: 'left'
          },
          vertical: {
            contextOffset: isWin ? 0 : cOffset.top,
            contextScroll: isWin ? 0 : this.oldScroll.y,
            contextDimension: isWin ? $[wps]('viewportHeight') : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: 'down',
            backward: 'up',
            offsetProp: 'top'
          }
        };
        return $.each(axes, function(aKey, axis) {
          return $.each(_this.waypoints[aKey], function(i, waypoint) {
            var adjustment, elementOffset, oldOffset, _ref, _ref1;

            adjustment = waypoint.options.offset;
            oldOffset = waypoint.offset;
            elementOffset = $.isWindow(waypoint.element) ? 0 : waypoint.$element.offset()[axis.offsetProp];
            if ($.isFunction(adjustment)) {
              adjustment = adjustment.apply(waypoint.element);
            } else if (typeof adjustment === 'string') {
              adjustment = parseFloat(adjustment);
              if (waypoint.options.offset.indexOf('%') > -1) {
                adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
              }
            }
            waypoint.offset = elementOffset - axis.contextOffset + axis.contextScroll - adjustment;
            if ((waypoint.options.onlyOnScroll && (oldOffset != null)) || !waypoint.enabled) {
              return;
            }
            if (oldOffset !== null && (oldOffset < (_ref = axis.oldScroll) && _ref <= waypoint.offset)) {
              return waypoint.trigger([axis.backward]);
            } else if (oldOffset !== null && (oldOffset > (_ref1 = axis.oldScroll) && _ref1 >= waypoint.offset)) {
              return waypoint.trigger([axis.forward]);
            } else if (oldOffset === null && axis.oldScroll >= waypoint.offset) {
              return waypoint.trigger([axis.forward]);
            }
          });
        });
      };

      Context.prototype.checkEmpty = function() {
        if ($.isEmptyObject(this.waypoints.horizontal) && $.isEmptyObject(this.waypoints.vertical)) {
          this.$element.unbind([resizeEvent, scrollEvent].join(' '));
          return delete contexts[this.id];
        }
      };

      return Context;

    })();
    Waypoint = (function() {
      function Waypoint($element, context, options) {
        var idList, _ref;

        if (options.offset === 'bottom-in-view') {
          options.offset = function() {
            var contextHeight;

            contextHeight = $[wps]('viewportHeight');
            if (!$.isWindow(context.element)) {
              contextHeight = context.$element.height();
            }
            return contextHeight - $(this).outerHeight();
          };
        }
        this.$element = $element;
        this.element = $element[0];
        this.axis = options.horizontal ? 'horizontal' : 'vertical';
        this.callback = options.handler;
        this.context = context;
        this.enabled = options.enabled;
        this.id = 'waypoints' + waypointCounter++;
        this.offset = null;
        this.options = options;
        context.waypoints[this.axis][this.id] = this;
        allWaypoints[this.axis][this.id] = this;
        idList = (_ref = this.element[waypointKey]) != null ? _ref : [];
        idList.push(this.id);
        this.element[waypointKey] = idList;
      }

      Waypoint.prototype.trigger = function(args) {
        if (!this.enabled) {
          return;
        }
        if (this.callback != null) {
          this.callback.apply(this.element, args);
        }
        if (this.options.triggerOnce) {
          return this.destroy();
        }
      };

      Waypoint.prototype.disable = function() {
        return this.enabled = false;
      };

      Waypoint.prototype.enable = function() {
        this.context.refresh();
        return this.enabled = true;
      };

      Waypoint.prototype.destroy = function() {
        delete allWaypoints[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };

      Waypoint.getWaypointsByElement = function(element) {
        var all, ids;

        ids = element[waypointKey];
        if (!ids) {
          return [];
        }
        all = $.extend({}, allWaypoints.horizontal, allWaypoints.vertical);
        return $.map(ids, function(id) {
          return all[id];
        });
      };

      return Waypoint;

    })();
    methods = {
      init: function(f, options) {
        var _ref;

        options = $.extend({}, $.fn[wp].defaults, options);
        if ((_ref = options.handler) == null) {
          options.handler = f;
        }
        this.each(function() {
          var $this, context, contextElement, _ref1;

          $this = $(this);
          contextElement = (_ref1 = options.context) != null ? _ref1 : $.fn[wp].defaults.context;
          if (!$.isWindow(contextElement)) {
            contextElement = $this.closest(contextElement);
          }
          contextElement = $(contextElement);
          context = contexts[contextElement[0][contextKey]];
          if (!context) {
            context = new Context(contextElement);
          }
          return new Waypoint($this, context, options);
        });
        $[wps]('refresh');
        return this;
      },
      disable: function() {
        return methods._invoke.call(this, 'disable');
      },
      enable: function() {
        return methods._invoke.call(this, 'enable');
      },
      destroy: function() {
        return methods._invoke.call(this, 'destroy');
      },
      prev: function(axis, selector) {
        return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
          if (index > 0) {
            return stack.push(waypoints[index - 1]);
          }
        });
      },
      next: function(axis, selector) {
        return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
          if (index < waypoints.length - 1) {
            return stack.push(waypoints[index + 1]);
          }
        });
      },
      _traverse: function(axis, selector, push) {
        var stack, waypoints;

        if (axis == null) {
          axis = 'vertical';
        }
        if (selector == null) {
          selector = window;
        }
        waypoints = jQMethods.aggregate(selector);
        stack = [];
        this.each(function() {
          var index;

          index = $.inArray(this, waypoints[axis]);
          return push(stack, index, waypoints[axis]);
        });
        return this.pushStack(stack);
      },
      _invoke: function(method) {
        this.each(function() {
          var waypoints;

          waypoints = Waypoint.getWaypointsByElement(this);
          return $.each(waypoints, function(i, waypoint) {
            waypoint[method]();
            return true;
          });
        });
        return this;
      }
    };
    $.fn[wp] = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (methods[method]) {
        return methods[method].apply(this, args);
      } else if ($.isFunction(method)) {
        return methods.init.apply(this, arguments);
      } else if ($.isPlainObject(method)) {
        return methods.init.apply(this, [null, method]);
      } else if (!method) {
        return $.error("jQuery Waypoints needs a callback function or handler option.");
      } else {
        return $.error("The " + method + " method does not exist in jQuery Waypoints.");
      }
    };
    $.fn[wp].defaults = {
      context: window,
      continuous: true,
      enabled: true,
      horizontal: false,
      offset: 0,
      triggerOnce: false
    };
    jQMethods = {
      refresh: function() {
        return $.each(contexts, function(i, context) {
          return context.refresh();
        });
      },
      viewportHeight: function() {
        var _ref;

        return (_ref = window.innerHeight) != null ? _ref : $w.height();
      },
      aggregate: function(contextSelector) {
        var collection, waypoints, _ref;

        collection = allWaypoints;
        if (contextSelector) {
          collection = (_ref = contexts[$(contextSelector)[0][contextKey]]) != null ? _ref.waypoints : void 0;
        }
        if (!collection) {
          return [];
        }
        waypoints = {
          horizontal: [],
          vertical: []
        };
        $.each(waypoints, function(axis, arr) {
          $.each(collection[axis], function(key, waypoint) {
            return arr.push(waypoint);
          });
          arr.sort(function(a, b) {
            return a.offset - b.offset;
          });
          waypoints[axis] = $.map(arr, function(waypoint) {
            return waypoint.element;
          });
          return waypoints[axis] = $.unique(waypoints[axis]);
        });
        return waypoints;
      },
      above: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
          return waypoint.offset <= context.oldScroll.y;
        });
      },
      below: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
          return waypoint.offset > context.oldScroll.y;
        });
      },
      left: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
          return waypoint.offset <= context.oldScroll.x;
        });
      },
      right: function(contextSelector) {
        if (contextSelector == null) {
          contextSelector = window;
        }
        return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
          return waypoint.offset > context.oldScroll.x;
        });
      },
      enable: function() {
        return jQMethods._invoke('enable');
      },
      disable: function() {
        return jQMethods._invoke('disable');
      },
      destroy: function() {
        return jQMethods._invoke('destroy');
      },
      extendFn: function(methodName, f) {
        return methods[methodName] = f;
      },
      _invoke: function(method) {
        var waypoints;

        waypoints = $.extend({}, allWaypoints.vertical, allWaypoints.horizontal);
        return $.each(waypoints, function(key, waypoint) {
          waypoint[method]();
          return true;
        });
      },
      _filter: function(selector, axis, test) {
        var context, waypoints;

        context = contexts[$(selector)[0][contextKey]];
        if (!context) {
          return [];
        }
        waypoints = [];
        $.each(context.waypoints[axis], function(i, waypoint) {
          if (test(context, waypoint)) {
            return waypoints.push(waypoint);
          }
        });
        waypoints.sort(function(a, b) {
          return a.offset - b.offset;
        });
        return $.map(waypoints, function(waypoint) {
          return waypoint.element;
        });
      }
    };
    $[wps] = function() {
      var args, method;

      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (jQMethods[method]) {
        return jQMethods[method].apply(null, args);
      } else {
        return jQMethods.aggregate.call(null, method);
      }
    };
    $[wps].settings = {
      resizeThrottle: 100,
      scrollThrottle: 30
    };
    return $w.on('load.waypoints', function() {
      return $[wps]('refresh');
    });
  });

}).call(this);
/*
    Version: 3.1.5e
    Modified by Mike Kafka (http://codecanyon.net/user/makfak) to serve my own purposes
    # b
     - new jQuery namespace (jQuery)
     - _getFileType (#662) extended to autodetect image URLs (avoid the need for "iframe=true")
     - content type switch (#330) extended to support iframe URLs w/o "iframe=true"
    # c
     - normalized all jQuery references to '$'
     - self-invoke arguments ref the window and test for availability (window.jQuery || jQuery)
    # d
     - new namespace on events
    # e
     - changed viewport buffer 200 >>> 100 (~#600)
     - locked the overlay to the screen (CSS)
     - removed the .ppt bumper (CSS)
*/
/* ------------------------------------------------------------------------
    Class: prettyPhoto
    Use: Lightbox clone for jQuery
    Author: Stephane Caron (http://www.no-margin-for-errors.com)
    Version: 3.1.5
------------------------------------------------------------------------- */
(function($) {
    $.prettyPhoto = {version: '3.1.5'};
    
    $.fn.prettyPhoto = function(pp_settings) {
        pp_settings = $.extend({
            hook: 'rel', /* the attribute tag to use for prettyPhoto hooks. default: 'rel'. For HTML5, use "data-rel" or similar. */
            animation_speed: 'fast', /* fast/slow/normal */
            ajaxcallback: function() {},
            slideshow: 5000, /* false OR interval time in ms */
            autoplay_slideshow: false, /* true/false */
            opacity: 0.80, /* Value between 0 and 1 */
            show_title: true, /* true/false */
            allow_resize: true, /* Resize the photos bigger than viewport. true/false */
            allow_expand: true, /* Allow the user to expand a resized image. true/false */
            default_width: 500,
            default_height: 344,
            counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
            theme: 'pp_default', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
            horizontal_padding: 20, /* The padding on each side of the picture */
            hideflash: false, /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
            wmode: 'opaque', /* Set the flash wmode attribute */
            autoplay: true, /* Automatically start videos: True/False */
            modal: false, /* If set to true, only the close button will close the window */
            deeplinking: true, /* Allow prettyPhoto to update the url to enable deeplinking. */
            overlay_gallery: true, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
            overlay_gallery_max: 30, /* Maximum number of pictures in the overlay gallery */
            keyboard_shortcuts: true, /* Set to false if you open forms inside prettyPhoto */
            changepicturecallback: function(){}, /* Called everytime an item is shown/changed */
            callback: function(){}, /* Called when prettyPhoto is closed */
            ie6_fallback: true,
            markup: '<div class="pp_pic_holder"> \
                        <div class="ppt">&nbsp;</div> \
                        <div class="pp_top"> \
                            <div class="pp_left"></div> \
                            <div class="pp_middle"></div> \
                            <div class="pp_right"></div> \
                        </div> \
                        <div class="pp_content_container"> \
                            <div class="pp_left"> \
                            <div class="pp_right"> \
                                <div class="pp_content"> \
                                    <div class="pp_loaderIcon"></div> \
                                    <div class="pp_fade"> \
                                        <a href="#" class="pp_expand" title="Expand the image">Expand</a> \
                                        <div class="pp_hoverContainer"> \
                                            <a class="pp_next" href="#">next</a> \
                                            <a class="pp_previous" href="#">previous</a> \
                                        </div> \
                                        <div id="pp_full_res"></div> \
                                        <div class="pp_details"> \
                                            <div class="pp_nav"> \
                                                <a href="#" class="pp_arrow_previous">Previous</a> \
                                                <p class="currentTextHolder">0/0</p> \
                                                <a href="#" class="pp_arrow_next">Next</a> \
                                            </div> \
                                            <p class="pp_description"></p> \
                                            <div class="pp_social">{pp_social}</div> \
                                            <a class="pp_close" href="#">Close</a> \
                                        </div> \
                                    </div> \
                                </div> \
                            </div> \
                            </div> \
                        </div> \
                        <div class="pp_bottom"> \
                            <div class="pp_left"></div> \
                            <div class="pp_middle"></div> \
                            <div class="pp_right"></div> \
                        </div> \
                    </div> \
                    <div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery"> \
                                <a href="#" class="pp_arrow_previous">Previous</a> \
                                <div> \
                                    <ul> \
                                        {gallery} \
                                    </ul> \
                                </div> \
                                <a href="#" class="pp_arrow_next">Next</a> \
                            </div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline">{content}</div>',
            custom_markup: '',
            social_tools: '<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>' /* html or false to disable */
        }, pp_settings);
        
        // Global variables accessible only by prettyPhoto
        var matchedObjects = this, percentBased = false, pp_dimensions, pp_open,
        
        // prettyPhoto container specific
        pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth,
        
        // Window size
        windowHeight = $(window).height(), windowWidth = $(window).width(),

        // Global elements
        pp_slideshow;
        
        doresize = true, scroll_pos = _get_scroll();
    
        // Window/Keyboard events
        $(window).unbind('resize.pm-prettyphoto').bind('resize.pm-prettyphoto',function(){ _center_overlay(); _resize_overlay(); });
        
        if(pp_settings.keyboard_shortcuts) {
            $(document).unbind('keydown.pm-prettyphoto').bind('keydown.pm-prettyphoto',function(e){
                if(typeof $pp_pic_holder != 'undefined'){
                    if($pp_pic_holder.is(':visible')){
                        switch(e.keyCode){
                            case 37:
                                $.prettyPhoto.changePage('previous');
                                e.preventDefault();
                                break;
                            case 39:
                                $.prettyPhoto.changePage('next');
                                e.preventDefault();
                                break;
                            case 27:
                                if(!settings.modal)
                                $.prettyPhoto.close();
                                e.preventDefault();
                                break;
                        };
                        // return false;
                    };
                };
            });
        };
        
        /**
        * Initialize prettyPhoto.
        */
        $.prettyPhoto.initialize = function() {
            
            settings = pp_settings;
            
            if(settings.theme == 'pp_default') settings.horizontal_padding = 16;
            
            // Find out if the picture is part of a set
            theRel = $(this).attr(settings.hook);
            galleryRegExp = /\[(?:.*)\]/;
            isSet = (galleryRegExp.exec(theRel)) ? true : false;
            
            // Put the SRCs, TITLEs, ALTs into an array.
            pp_images = (isSet) ? $.map(matchedObjects, function(n, i){ if($(n).attr(settings.hook).indexOf(theRel) != -1) return $(n).attr('href'); }) : $.makeArray($(this).attr('href'));
            pp_titles = (isSet) ? $.map(matchedObjects, function(n, i){ if($(n).attr(settings.hook).indexOf(theRel) != -1) return ($(n).find('img').attr('alt')) ? $(n).find('img').attr('alt') : ""; }) : $.makeArray($(this).find('img').attr('alt'));
            pp_descriptions = (isSet) ? $.map(matchedObjects, function(n, i){ if($(n).attr(settings.hook).indexOf(theRel) != -1) return ($(n).attr('title')) ? $(n).attr('title') : ""; }) : $.makeArray($(this).attr('title'));
            
            if(pp_images.length > settings.overlay_gallery_max) settings.overlay_gallery = false;
            
            set_position = $.inArray($(this).attr('href'), pp_images); // Define where in the array the clicked item is positionned
            rel_index = (isSet) ? set_position : $("a["+settings.hook+"^='"+theRel+"']").index($(this));
            
            _build_overlay(this); // Build the overlay {this} being the caller
            
            if(settings.allow_resize)
                $(window).bind('scroll.pm-prettyphoto',function(){ _center_overlay(); });
            
            
            $.prettyPhoto.open();
            
            return false;
        }


        /**
        * Opens the prettyPhoto modal box.
        * @param image {String,Array} Full path to the image to be open, can also be an array containing full images paths.
        * @param title {String,Array} The title to be displayed with the picture, can also be an array containing all the titles.
        * @param description {String,Array} The description to be displayed with the picture, can also be an array containing all the descriptions.
        */
        $.prettyPhoto.open = function(event) {
            if(typeof settings == "undefined"){ // Means it's an API call, need to manually get the settings and set the variables
                settings = pp_settings;
                pp_images = $.makeArray(arguments[0]);
                pp_titles = (arguments[1]) ? $.makeArray(arguments[1]) : $.makeArray("");
                pp_descriptions = (arguments[2]) ? $.makeArray(arguments[2]) : $.makeArray("");
                isSet = (pp_images.length > 1) ? true : false;
                set_position = (arguments[3])? arguments[3]: 0;
                _build_overlay(event.target); // Build the overlay {this} being the caller
            }
            
            if(settings.hideflash) $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility','hidden'); // Hide the flash

            _checkPosition($(pp_images).size()); // Hide the next/previous links if on first or last images.
        
            $('.pp_loaderIcon').show();
        
            if(settings.deeplinking)
                setHashtag();
        
            // Rebuild Facebook Like Button with updated href
            if(settings.social_tools){
                facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href)); 
                $pp_pic_holder.find('.pp_social').html(facebook_like_link);
            }
            
            // Fade the content in
            if($ppt.is(':hidden')) $ppt.css('opacity',0).show();
            $pp_overlay.show().fadeTo(settings.animation_speed,settings.opacity);

            // Display the current position
            $pp_pic_holder.find('.currentTextHolder').text((set_position+1) + settings.counter_separator_label + $(pp_images).size());

            // Set the description
            if(typeof pp_descriptions[set_position] != 'undefined' && pp_descriptions[set_position] != ""){
                $pp_pic_holder.find('.pp_description').show().html(unescape(pp_descriptions[set_position]));
            }else{
                $pp_pic_holder.find('.pp_description').hide();
            }
            
            // Get the dimensions
            movie_width = ( parseFloat(getParam('width',pp_images[set_position])) ) ? getParam('width',pp_images[set_position]) : settings.default_width.toString();
            movie_height = ( parseFloat(getParam('height',pp_images[set_position])) ) ? getParam('height',pp_images[set_position]) : settings.default_height.toString();
            
            // If the size is % based, calculate according to window dimensions
            percentBased=false;
            if(movie_height.indexOf('%') != -1) { movie_height = parseFloat(($(window).height() * parseFloat(movie_height) / 100) - 150); percentBased = true; }
            if(movie_width.indexOf('%') != -1) { movie_width = parseFloat(($(window).width() * parseFloat(movie_width) / 100) - 150); percentBased = true; }
            
            // Fade the holder
            $pp_pic_holder.fadeIn(function(){
                // Set the title
                (settings.show_title && pp_titles[set_position] != "" && typeof pp_titles[set_position] != "undefined") ? $ppt.html(unescape(pp_titles[set_position])) : $ppt.html('&nbsp;');
                
                imgPreloader = "";
                skipInjection = false;
                
                // Inject the proper content
                switch(_getFileType(pp_images[set_position])){
                    case 'image':
                        imgPreloader = new Image();

                        // Preload the neighbour images
                        nextImage = new Image();
                        if(isSet && set_position < $(pp_images).size() -1) nextImage.src = pp_images[set_position + 1];
                        prevImage = new Image();
                        if(isSet && pp_images[set_position - 1]) prevImage.src = pp_images[set_position - 1];

                        $pp_pic_holder.find('#pp_full_res')[0].innerHTML = settings.image_markup.replace(/{path}/g,pp_images[set_position]);

                        imgPreloader.onload = function(){
                            // Fit item to viewport
                            pp_dimensions = _fitToViewport(imgPreloader.width,imgPreloader.height);

                            _showContent();
                        };

                        imgPreloader.onerror = function(){
                            alert('Image cannot be loaded. Make sure the path is correct and image exist.');
                            $.prettyPhoto.close();
                        };
                    
                        imgPreloader.src = pp_images[set_position];
                    break;
                
                    case 'youtube':
                        pp_dimensions = _fitToViewport(movie_width,movie_height); // Fit item to viewport
                        
                        // Regular youtube link
                        movie_id = getParam('v',pp_images[set_position]);
                        
                        // youtu.be link
                        if(movie_id == ""){
                            movie_id = pp_images[set_position].split('youtu.be/');
                            movie_id = movie_id[1];
                            if(movie_id.indexOf('?') > 0)
                                movie_id = movie_id.substr(0,movie_id.indexOf('?')); // Strip anything after the ?

                            if(movie_id.indexOf('&') > 0)
                                movie_id = movie_id.substr(0,movie_id.indexOf('&')); // Strip anything after the &
                        }

                        movie = 'http://www.youtube.com/embed/'+movie_id;
                        (getParam('rel',pp_images[set_position])) ? movie+="?rel="+getParam('rel',pp_images[set_position]) : movie+="?rel=1";
                            
                        if(settings.autoplay) movie += "&autoplay=1";
                    
                        toInject = settings.iframe_markup.replace(/{width}/g,pp_dimensions['width']).replace(/{height}/g,pp_dimensions['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,movie);
                    break;
                
                    case 'vimeo':
                        pp_dimensions = _fitToViewport(movie_width,movie_height); // Fit item to viewport
                    
                        movie_id = pp_images[set_position];
                        var regExp = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/;
                        var match = movie_id.match(regExp);
                        
                        movie = 'http://player.vimeo.com/video/'+ match[3] +'?title=0&amp;byline=0&amp;portrait=0';
                        if(settings.autoplay) movie += "&autoplay=1;";
                
                        vimeo_width = pp_dimensions['width'] + '/embed/?moog_width='+ pp_dimensions['width'];
                
                        toInject = settings.iframe_markup.replace(/{width}/g,vimeo_width).replace(/{height}/g,pp_dimensions['height']).replace(/{path}/g,movie);
                    break;
                
                    case 'quicktime':
                        pp_dimensions = _fitToViewport(movie_width,movie_height); // Fit item to viewport
                        pp_dimensions['height']+=15; pp_dimensions['contentHeight']+=15; pp_dimensions['containerHeight']+=15; // Add space for the control bar
                
                        toInject = settings.quicktime_markup.replace(/{width}/g,pp_dimensions['width']).replace(/{height}/g,pp_dimensions['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,pp_images[set_position]).replace(/{autoplay}/g,settings.autoplay);
                    break;
                
                    case 'flash':
                        pp_dimensions = _fitToViewport(movie_width,movie_height); // Fit item to viewport
                    
                        flash_vars = pp_images[set_position];
                        flash_vars = flash_vars.substring(pp_images[set_position].indexOf('flashvars') + 10,pp_images[set_position].length);

                        filename = pp_images[set_position];
                        filename = filename.substring(0,filename.indexOf('?'));
                    
                        toInject =  settings.flash_markup.replace(/{width}/g,pp_dimensions['width']).replace(/{height}/g,pp_dimensions['height']).replace(/{wmode}/g,settings.wmode).replace(/{path}/g,filename+'?'+flash_vars);
                    break;
                
                    case 'iframe':
                        pp_dimensions = _fitToViewport(movie_width,movie_height); // Fit item to viewport
                
                        frame_url = pp_images[set_position];

                        if ( frame_url.indexOf('?') !== 0 && frame_url.indexOf('iframe') !== -1) {
                            frame_url = frame_url.substr(0,frame_url.indexOf('iframe')-1);
                        }

                        toInject = settings.iframe_markup.replace(/{width}/g,pp_dimensions['width']).replace(/{height}/g,pp_dimensions['height']).replace(/{path}/g,frame_url);
                    break;
                    
                    case 'ajax':
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport(movie_width,movie_height);
                        doresize = true; // Reset the dimensions
                    
                        skipInjection = true;
                        $.get(pp_images[set_position],function(responseHTML){
                            toInject = settings.inline_markup.replace(/{content}/g,responseHTML);
                            $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
                            _showContent();
                        });
                        
                    break;
                    
                    case 'custom':
                        pp_dimensions = _fitToViewport(movie_width,movie_height); // Fit item to viewport
                    
                        toInject = settings.custom_markup;
                    break;
                
                    case 'inline':
                        // to get the item height clone it, apply default width, wrap it in the prettyPhoto containers , then delete
                        myClone = $(pp_images[set_position]).clone().append('<br clear="all" />').css({'width':settings.default_width}).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo($('body')).show();
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport($(myClone).width(),$(myClone).height());
                        doresize = true; // Reset the dimensions
                        $(myClone).remove();
                        toInject = settings.inline_markup.replace(/{content}/g,$(pp_images[set_position]).html());
                    break;
                };

                if(!imgPreloader && !skipInjection){
                    $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
                
                    // Show content
                    _showContent();
                };
            });

            return false;
        };

    
        /**
        * Change page in the prettyPhoto modal box
        * @param direction {String} Direction of the paging, previous or next.
        */
        $.prettyPhoto.changePage = function(direction){
            currentGalleryPage = 0;
            
            if(direction == 'previous') {
                set_position--;
                if (set_position < 0) set_position = $(pp_images).size()-1;
            }else if(direction == 'next'){
                set_position++;
                if(set_position > $(pp_images).size()-1) set_position = 0;
            }else{
                set_position=direction;
            };
            
            rel_index = set_position;

            if(!doresize) doresize = true; // Allow the resizing of the images
            if(settings.allow_expand) {
                $('.pp_contract').removeClass('pp_contract').addClass('pp_expand');
            }

            _hideContent(function(){ $.prettyPhoto.open(); });
        };


        /**
        * Change gallery page in the prettyPhoto modal box
        * @param direction {String} Direction of the paging, previous or next.
        */
        $.prettyPhoto.changeGalleryPage = function(direction){
            if(direction=='next'){
                currentGalleryPage ++;

                if(currentGalleryPage > totalPage) currentGalleryPage = 0;
            }else if(direction=='previous'){
                currentGalleryPage --;

                if(currentGalleryPage < 0) currentGalleryPage = totalPage;
            }else{
                currentGalleryPage = direction;
            };
            
            slide_speed = (direction == 'next' || direction == 'previous') ? settings.animation_speed : 0;

            slide_to = currentGalleryPage * (itemsPerPage * itemWidth);

            $pp_gallery.find('ul').animate({left:-slide_to},slide_speed);
        };


        /**
        * Start the slideshow...
        */
        $.prettyPhoto.startSlideshow = function(){
            if(typeof pp_slideshow == 'undefined'){
                $pp_pic_holder.find('.pp_play').unbind('click').removeClass('pp_play').addClass('pp_pause').click(function(){
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                pp_slideshow = setInterval($.prettyPhoto.startSlideshow,settings.slideshow);
            }else{
                $.prettyPhoto.changePage('next');   
            };
        }


        /**
        * Stop the slideshow...
        */
        $.prettyPhoto.stopSlideshow = function(){
            $pp_pic_holder.find('.pp_pause').unbind('click').removeClass('pp_pause').addClass('pp_play').click(function(){
                $.prettyPhoto.startSlideshow();
                return false;
            });
            clearInterval(pp_slideshow);
            pp_slideshow=undefined;
        }


        /**
        * Closes prettyPhoto.
        */
        $.prettyPhoto.close = function(){
            if($pp_overlay.is(":animated")) return;
            
            $.prettyPhoto.stopSlideshow();
            
            $pp_pic_holder.stop().find('object,embed').css('visibility','hidden');
            
            $('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(settings.animation_speed,function(){ $(this).remove(); });
            
            $pp_overlay.fadeOut(settings.animation_speed, function(){
                
                if(settings.hideflash) $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility','visible'); // Show the flash
                
                $(this).remove(); // No more need for the prettyPhoto markup
                
                $(window).unbind('scroll.pm-prettyphoto');
                
                clearHashtag();
                
                settings.callback();
                
                doresize = true;
                
                pp_open = false;
                
                delete settings;
            });
        };
    
        /**
        * Set the proper sizes on the containers and animate the content in.
        */
        function _showContent(){
            $('.pp_loaderIcon').hide();

            // Calculate the opened top position of the pic holder
            projectedTop = scroll_pos['scrollTop'] + ((windowHeight/2) - (pp_dimensions['containerHeight']/2));
            if(projectedTop < 0) projectedTop = 0;

            $ppt.fadeTo(settings.animation_speed,1);

            // Resize the content holder
            $pp_pic_holder.find('.pp_content')
                .animate({
                    height:pp_dimensions['contentHeight'],
                    width:pp_dimensions['contentWidth']
                },settings.animation_speed);

            var halfWidth = (windowWidth/2) - (pp_dimensions['containerWidth']/2);

            // Resize picture the holder
            $pp_pic_holder.animate({
                'top': projectedTop,
                'left': (halfWidth < 0) ? 0 : halfWidth,
                'width': pp_dimensions['containerWidth']
            },settings.animation_speed,function(){
                $pp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(pp_dimensions['height']).width(pp_dimensions['width']);

                $pp_pic_holder.find('.pp_fade').fadeIn(settings.animation_speed); // Fade the new content

                // Show the nav
                if(isSet && _getFileType(pp_images[set_position])=="image") { $pp_pic_holder.find('.pp_hoverContainer').show(); }else{ $pp_pic_holder.find('.pp_hoverContainer').hide(); }
            
                if(settings.allow_expand) {
                    if(pp_dimensions['resized']){ // Fade the resizing link if the image is resized
                        $('a.pp_expand,a.pp_contract').show();
                    }else{
                        $('a.pp_expand').hide();
                    }
                }
                
                if(settings.autoplay_slideshow && !pp_slideshow && !pp_open) $.prettyPhoto.startSlideshow();
                
                settings.changepicturecallback(); // Callback!
                
                pp_open = true;
            });
            
            _insert_gallery();
            pp_settings.ajaxcallback();
        };
        
        /**
        * Hide the content...DUH!
        */
        function _hideContent(callback){
            // Fade out the current picture
            $pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility','hidden');
            $pp_pic_holder.find('.pp_fade').fadeOut(settings.animation_speed,function(){
                $('.pp_loaderIcon').show();
                
                callback();
            });
        };
    
        /**
        * Check the item position in the gallery array, hide or show the navigation links
        * @param setCount {integer} The total number of items in the set
        */
        function _checkPosition(setCount){
            (setCount > 1) ? $('.pp_nav').show() : $('.pp_nav').hide(); // Hide the bottom nav if it's not a set.
        };
    
        /**
        * Resize the item dimensions if it's bigger than the viewport
        * @param width {integer} Width of the item to be opened
        * @param height {integer} Height of the item to be opened
        * @return An array containin the "fitted" dimensions
        */
        function _fitToViewport(width,height){
            resized = false;

            _getDimensions(width,height);
            
            // Define them in case there's no resize needed
            imageWidth = width, imageHeight = height;

            if( ((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) && doresize && settings.allow_resize && !percentBased) {
                resized = true, fitting = false;
            
                while (!fitting){
                    if((pp_containerWidth > windowWidth)){
                        imageWidth = (windowWidth - 100);
                        imageHeight = (height/width) * imageWidth;
                    }else if((pp_containerHeight > windowHeight)){
                        imageHeight = (windowHeight - 100);
                        imageWidth = (width/height) * imageHeight;
                    }else{
                        fitting = true;
                    };

                    pp_containerHeight = imageHeight, pp_containerWidth = imageWidth;
                };
            

                
                if((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)){
                    _fitToViewport(pp_containerWidth,pp_containerHeight)
                };
                
                _getDimensions(imageWidth,imageHeight);
            };
            
            return {
                width:Math.floor(imageWidth),
                height:Math.floor(imageHeight),
                containerHeight:Math.floor(pp_containerHeight),
                containerWidth:Math.floor(pp_containerWidth) + (settings.horizontal_padding * 2),
                contentHeight:Math.floor(pp_contentHeight),
                contentWidth:Math.floor(pp_contentWidth),
                resized:resized
            };
        };
        
        /**
        * Get the containers dimensions according to the item size
        * @param width {integer} Width of the item to be opened
        * @param height {integer} Height of the item to be opened
        */
        function _getDimensions(width,height){
            width = parseFloat(width);
            height = parseFloat(height);

            // Get the details height, to do so, I need to clone it since it's invisible
            $pp_details = $pp_pic_holder.find('.pp_details');
            $pp_details.width(width);
            detailsHeight = parseFloat($pp_details.css('marginTop')) + parseFloat($pp_details.css('marginBottom'));

            $pp_details = $pp_details.clone().addClass(settings.theme).width(width).appendTo($('body')).css({
                'position':'absolute',
                'top':-10000
            });
            detailsHeight += $pp_details.height();
            detailsHeight = (detailsHeight <= 34) ? 36 : detailsHeight; // Min-height for the details
            $pp_details.remove();

            // Get the titles height, to do so, I need to clone it since it's invisible
            $pp_title = $pp_pic_holder.find('.ppt');
            $pp_title.width(width);
            titleHeight = parseFloat($pp_title.css('marginTop')) + parseFloat($pp_title.css('marginBottom'));
            $pp_title = $pp_title.clone().appendTo($('body')).css({
                'position':'absolute',
                'top':-10000
            });
            titleHeight += $pp_title.height();
            $pp_title.remove();

            // Get the container size, to resize the holder to the right dimensions
            pp_contentHeight = height + detailsHeight;
            pp_contentWidth = width;
            pp_containerHeight = pp_contentHeight + titleHeight + $pp_pic_holder.find('.pp_top').height() + $pp_pic_holder.find('.pp_bottom').height();
            pp_containerWidth = width;
        }
    
        function _getFileType(itemSrc){
            var noQueryString = itemSrc.split("?")[0];

            if (itemSrc.match(/youtube\.com\/watch/i) || itemSrc.match(/youtu\.be/i)) {
                return 'youtube';
            } else if (itemSrc.match(/vimeo\.com/i)) {
                return 'vimeo';
            } else if (itemSrc.match(/\b.mov\b/i)) {
                return 'quicktime';
            } else if (itemSrc.match(/\b.swf\b/i)) {
                return 'flash';
            } else if (itemSrc.match(/\bajax=true\b/i)) {
                return 'ajax';
            } else if (itemSrc.match(/\bcustom=true\b/i)) {
                return 'custom';
            } else if (itemSrc.substr(0,1) == '#') {
                return 'inline';
            } else if (
                itemSrc.match(/\biframe=true\b/i)
                || !noQueryString.match(/\.(gif|jpg|jpeg|tiff|png)$/i)
            ) {
                return 'iframe';
            } else {
                return 'image';
            };
        };
    
        function _center_overlay(){
            if(doresize && typeof $pp_pic_holder != 'undefined') {
                scroll_pos = _get_scroll();
                contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width();

                projectedTop = (windowHeight/2) + scroll_pos['scrollTop'] - (contentHeight/2);
                if(projectedTop < 0) projectedTop = 0;

                if(contentHeight > windowHeight)
                    return;

                $pp_pic_holder.css({
                    'top': projectedTop,
                    'left': (windowWidth/2) + scroll_pos['scrollLeft'] - (contentwidth/2)
                });
            };
        };
    
        function _get_scroll(){
            if (self.pageYOffset) {
                return {scrollTop:self.pageYOffset,scrollLeft:self.pageXOffset};
            } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                return {scrollTop:document.documentElement.scrollTop,scrollLeft:document.documentElement.scrollLeft};
            } else if (document.body) {// all other Explorers
                return {scrollTop:document.body.scrollTop,scrollLeft:document.body.scrollLeft};
            };
        };
    
        function _resize_overlay() {
            windowHeight = $(window).height(), windowWidth = $(window).width();
            
            if(typeof $pp_overlay != "undefined") $pp_overlay.height($(document).height()).width(windowWidth);
        };
    
        function _insert_gallery(){
            if(isSet && settings.overlay_gallery && _getFileType(pp_images[set_position])=="image") {
                itemWidth = 52+5; // 52 beign the thumb width, 5 being the right margin.
                navWidth = (settings.theme == "facebook" || settings.theme == "pp_default") ? 50 : 30; // Define the arrow width depending on the theme
                
                itemsPerPage = Math.floor((pp_dimensions['containerWidth'] - 100 - navWidth) / itemWidth);
                itemsPerPage = (itemsPerPage < pp_images.length) ? itemsPerPage : pp_images.length;
                totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;

                // Hide the nav in the case there's no need for links
                if(totalPage == 0){
                    navWidth = 0; // No nav means no width!
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').hide();
                }else{
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').show();
                };

                galleryWidth = itemsPerPage * itemWidth;
                fullGalleryWidth = pp_images.length * itemWidth;
                
                // Set the proper width to the gallery items
                $pp_gallery
                    .css('margin-left',-((galleryWidth/2) + (navWidth/2)))
                    .find('div:first').width(galleryWidth+5)
                    .find('ul').width(fullGalleryWidth)
                    .find('li.selected').removeClass('selected');
                
                goToPage = (Math.floor(set_position/itemsPerPage) < totalPage) ? Math.floor(set_position/itemsPerPage) : totalPage;

                $.prettyPhoto.changeGalleryPage(goToPage);
                
                $pp_gallery_li.filter(':eq('+set_position+')').addClass('selected');
            }else{
                $pp_pic_holder.find('.pp_content').unbind('mouseenter mouseleave');
                // $pp_gallery.hide();
            }
        }
    
        function _build_overlay(caller){
            // Inject Social Tool markup into General markup
            if(settings.social_tools)
                facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href)); 

            settings.markup = settings.markup.replace('{pp_social}',''); 
            
            $('body').append(settings.markup); // Inject the markup
            
            $pp_pic_holder = $('.pp_pic_holder') , $ppt = $('.ppt'), $pp_overlay = $('div.pp_overlay'); // Set my global selectors
            
            // Inject the inline gallery!
            if(isSet && settings.overlay_gallery) {
                currentGalleryPage = 0;
                toInject = "";
                for (var i=0; i < pp_images.length; i++) {
                    if(!pp_images[i].match(/\b(jpg|jpeg|png|gif)\b/gi)){
                        classname = 'default';
                        img_src = '';
                    }else{
                        classname = '';
                        img_src = pp_images[i];
                    }
                    toInject += "<li class='"+classname+"'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>";
                };
                
                toInject = settings.gallery_markup.replace(/{gallery}/g,toInject);
                
                $pp_pic_holder.find('#pp_full_res').after(toInject);
                
                $pp_gallery = $('.pp_pic_holder .pp_gallery'), $pp_gallery_li = $pp_gallery.find('li'); // Set the gallery selectors
                
                $pp_gallery.find('.pp_arrow_next').click(function(){
                    $.prettyPhoto.changeGalleryPage('next');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                
                $pp_gallery.find('.pp_arrow_previous').click(function(){
                    $.prettyPhoto.changeGalleryPage('previous');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                
                $pp_pic_holder.find('.pp_content').hover(
                    function(){
                        $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();
                    },
                    function(){
                        $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();
                    });

                itemWidth = 52+5; // 52 beign the thumb width, 5 being the right margin.
                $pp_gallery_li.each(function(i){
                    $(this)
                        .find('a')
                        .click(function(){
                            $.prettyPhoto.changePage(i);
                            $.prettyPhoto.stopSlideshow();
                            return false;
                        });
                });
            };
            
            
            // Inject the play/pause if it's a slideshow
            if(settings.slideshow){
                $pp_pic_holder.find('.pp_nav').prepend('<a href="#" class="pp_play">Play</a>')
                $pp_pic_holder.find('.pp_nav .pp_play').click(function(){
                    $.prettyPhoto.startSlideshow();
                    return false;
                });
            }
            
            $pp_pic_holder.attr('class','pp_pic_holder ' + settings.theme); // Set the proper theme
            
            $pp_overlay
                .css({
                    'opacity':0,
                    'height':$(document).height(),
                    'width':$(window).width()
                    })
                .bind('click',function(){
                    if(!settings.modal) $.prettyPhoto.close();
                });

            $('a.pp_close').bind('click',function(){ $.prettyPhoto.close(); return false; });


            if(settings.allow_expand) {
                $('a.pp_expand').bind('click',function(e){
                    // Expand the image
                    if($(this).hasClass('pp_expand')){
                        $(this).removeClass('pp_expand').addClass('pp_contract');
                        doresize = false;
                    }else{
                        $(this).removeClass('pp_contract').addClass('pp_expand');
                        doresize = true;
                    };
                
                    _hideContent(function(){ $.prettyPhoto.open(); });
            
                    return false;
                });
            }
        
            $pp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous').bind('click',function(){
                $.prettyPhoto.changePage('previous');
                $.prettyPhoto.stopSlideshow();
                return false;
            });
        
            $pp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').bind('click',function(){
                $.prettyPhoto.changePage('next');
                $.prettyPhoto.stopSlideshow();
                return false;
            });
            
            _center_overlay(); // Center it
        };

        if(!pp_alreadyInitialized && getHashtag()){
            pp_alreadyInitialized = true;
            
            // Grab the rel index to trigger the click on the correct element
            hashIndex = getHashtag();
            hashRel = hashIndex;
            hashIndex = hashIndex.substring(hashIndex.indexOf('/')+1,hashIndex.length-1);
            hashRel = hashRel.substring(0,hashRel.indexOf('/'));

            // Little timeout to make sure all the prettyPhoto initialize scripts has been run.
            // Useful in the event the page contain several init scripts.
            setTimeout(function(){ $("a["+pp_settings.hook+"^='"+hashRel+"']:eq("+hashIndex+")").trigger('click'); },50);
        }
        
        return this.unbind('click.pm-prettyphoto').bind('click.pm-prettyphoto',$.prettyPhoto.initialize); // Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
    };
    
    function getHashtag(){
        var url = location.href;
        hashtag = (url.indexOf('#prettyPhoto') !== -1) ? decodeURI(url.substring(url.indexOf('#prettyPhoto')+1,url.length)) : false;

        return hashtag;
    };
    
    function setHashtag(){
        if(typeof theRel == 'undefined') return; // theRel is set on normal calls, it's impossible to deeplink using the API
        location.hash = theRel + '/'+rel_index+'/';
    };
    
    function clearHashtag(){
        if ( location.href.indexOf('#prettyPhoto') !== -1 ) location.hash = "prettyPhoto";
    }
    
    function getParam(name,url){
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( url );
      return ( results == null ) ? "" : results[1];
    }
    
})(window.jQuery||jQuery);

var pp_alreadyInitialized = false; // Used for the deep linking to make sure not to call the same function several times.

PhotoMosaic.Utils = (function(){
    var S4 = function () {
        return ( ( (1 + Math.random()) * 0x10000 ) | 0 ).toString(16).substring(1);
    };

    return {
        log : {
            info: function (msg) {
                this.prefix(msg);
            },

            error: function (msg) {
                this.prefix("ERROR: " + msg);
            },

            prefix: function (msg) {
                this.print("PhotoMosaic: " + msg);
            },

            print: function (msg) {
                if (window.console !== undefined) {
                    window.console.log(msg);
                }
            }
        },

        makeID : function (small, prefix) {
            prefix = (prefix) ? prefix + '_' : '';
            if (small) {
                return prefix + S4() + S4() + '' + S4() + S4();
            } else {
                return prefix + ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() );
            }
        },

        deepSearch : function (obj, key, value) {
            // recursively traverses an nested arrays, and objects looking for a key/value pair
            var response = null;
            var i = 0;
            var prop;

            if (obj instanceof Array) {
                for (i = 0; i < obj.length; i++) {
                    response = this.deepSearch(obj[i], key, value);
                    if (response) {
                        return response;
                    }
                }
            } else {
                if (obj.hasOwnProperty(key) && obj[key] == value) {
                    return obj
                } else {
                    for (prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
                                response = this.deepSearch(obj[prop], key, value);
                                if (response) {
                                    return response;
                                }
                            }
                        }
                    }
                }
            }

            return response;
        },

        arrayToObj : function (array, key) {
            var response = {};
            for (var i = 0; i < array.length; i++) {
                response[ array[i][key] ] = array[i];
            };
            return response;
        },

        pickImageSize: function (images, sizes) {
            // currently only supported in PM4WP
            if (!sizes || !images[0].sizes) { return images; }

            for (var i = 0; i < images.length; i++) {
                var image = images[i];
                var size = null;
                var scaled = {
                    width : 0,
                    height : 0
                };

                for (var key in sizes) {
                    if (sizes.hasOwnProperty(key)) {
                        // are we dealing with a portrait or landscape image?
                        if (image.width.original >= image.height.original) {
                            scaled.width = sizes[key];
                            scaled.height = Math.floor((scaled.width * image.height.original) / image.width.original);
                        } else {
                            scaled.height = sizes[key];
                            scaled.width = Math.floor((scaled.height * image.width.original) / image.height.original);
                        }

                        // compare the dims of the image to the space to which is has been scaled
                        // if either of the image's dims are less than the container's dims - we'd be scaling up
                        // scaling up is bad
                        // keep looping until we scale the image down
                        if (scaled.width < image.width.adjusted || scaled.height < image.height.adjusted) {
                            continue;
                        } else {
                            size = key;
                            break;
                        }
                    }
                };

                // if none of the known sizes are big enough, go with the biggest we've got
                if (!size) {
                    size = 'full';
                }

                image.src = image.sizes[size];
            }

            return images;
        },

        // taken from UnderscoreJS _.debounce()
        debounce : function(func, wait, immediate) {
            var timeout = null;
            var args = null;
            var context = null;
            var timestamp = null;
            var result = null;

            var now = Date.now || function() { return new Date().getTime(); };

            var later = function() {
                var last = now() - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = now();
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        },

        logGalleryData : function (gallery) {
            var output = [];
            for (var i = 0; i < gallery.length; i++) {
                output.push({
                    src : gallery[i].src,
                    thumb : gallery[i].thumb,
                    caption : gallery[i].caption,
                    width : gallery[i].width.original,
                    height : gallery[i].height.original
                });
            }
            PhotoMosaic.Utils.log.info("Generate Gallery Data...");
            PhotoMosaic.Utils.log.print( JSON.stringify(output) );
        }
    };
}(window.jQuery));
PhotoMosaic.ErrorChecks = (function($){
    return {
        initial: function (opts) {
            if (opts.input === 'xml') {
                if (typeof opts.gallery !== 'string' || opts.gallery === '') {
                    PhotoMosaic.Utils.log.error("No XML file path specified.");
                    return true;
                }
            }

            if (opts.input === 'json') {
                if (typeof opts.gallery === 'string') {
                    if (opts.gallery === '') {
                        PhotoMosaic.Utils.log.error("No JSON object defined.");
                        return true;
                    }

                    if (typeof window[opts.gallery] !== 'undefined') {
                        opts.gallery = window[opts.gallery];
                    } else {
                        PhotoMosaic.Utils.log.error("No JSON object found when referencing '" + opts.gallery + "'.");
                        PhotoMosaic.Utils.log.info("Make sure your variable is avaible to the global scope (window['" + opts.gallery + "']) or simply pass the object literal (gallery:" + opts.gallery + ") instead of a string (gallery:\"" + opts.gallery + "\").");
                        return true;
                    }
                }

                if (opts.gallery.length === 0) {
                    PhotoMosaic.Utils.log.error("Specified gallery data is empty.");
                    return true;
                }
            }

            if (opts.prevent_crop && opts.height !== 'auto') {
                PhotoMosaic.Utils.log.info("Height must be set to 'auto' to Prevent Cropping. The value for height (" + opts.height + ") is being ignored so as to prevent cropping.");
                opts.height = "auto";
            }
            return false;
        },
// these got moved into layouts/columns.js
        imageDimensions: function (images) {
            var to_delete = [];

            $.each(images, function (i) {
                if (isNaN(this.height.adjusted)) {
                    to_delete.push(i);
                }
            });

            for (var i = to_delete.length - 1; i >= 0; i--) {
                PhotoMosaic.Utils.log.error("The following image failed to load and was skipped.\n" + images[to_delete[i]].src);
                var rest = images.slice( to_delete[i] + 1 );
                images.length = to_delete[i];
                images.push.apply(images, rest);
            }

            return images;
        },

        layout: function (json) {
            var i = 0;
            var j = 0;

            for (i = 0; i < json.columns.length; i++) {
                for (j = 0; j < json.columns[i].images.length; j++) {
                    if (json.columns[i].images[j].height.constraint <= 0) {
                        PhotoMosaic.Utils.log.error("Your gallery's height is too small for your current settings and won't render correctly.");
                        return true;
                    }
                };
            };

            return false;    
        }
    };
}(jQuery));
PhotoMosaic.Inputs = (function ($){
    return {
        json : function (gallery) {
            return gallery;
        },
        html : function ($node, opts) {
            var gallery = [];
            var $images = $node.find('img');

            for (var i = 0; i < $images.length; i++) {
                var $image = $images.eq(i)
                var image = {
                    caption : $image.attr('title'),
                    alt : $image.attr('alt'),
                    width : parseInt( $image.attr('width') ),
                    height : parseInt( $image.attr('height') )
                };

                if ($image.parent('a').length > 0 && opts.links) {
                    image.src = $image.attr('src');
                    image.url = $image.parent('a').attr('href');
                } else if ($image.parent('a').length > 0) {
                    image.src = $image.parent('a').attr('href');
                } else {
                    image.src = $image.attr('src');
                }

                gallery.push(image);
            }

            return gallery;
        },
        xml : function (gallery) {
            var response = [];

            gallery.find('photo').each(function (i) {
                var image = {};
                var data = $(this);

                image.caption = data.children('title').text();
                image.alt = data.children('alt').text();
                image.src = data.children('src').text();
                image.thumb = data.children('thumb').text();
                image.url = data.children('url').text();
                image.width = data.children('width').text();
                image.height = data.children('height').text();

                response.push(image);
            });

            return response;
        }
    };

}(window.jQuery));
(function ($) {
    var self = null;

    PhotoMosaic.Loader = function ($container, mosaic) {
        self = this;

        this.obj = $container;
        this.images = $container.find('img');
        this.mosaic = mosaic;
        this.opts = mosaic.opts;

        if (this.opts.lazyload === false) {
            this.skipLazyload();
        } else {
            this.trigger_point = $.waypoints('viewportHeight') + this.opts.lazyload;
            this.lazyload();
        }

        // if you want a loading transition but the browser doesn't support it... fade (old IEs)
        if ( this.opts.loading_transition !== 'none' && !PhotoMosaic.Plugins.Modernizr.csstransitions ) {
            this.images.css('opacity','0');
        }

        return this;
    };

    PhotoMosaic.Loader.prototype = {
        lazyload : function () {
            this.images.parent().waypoint({
                triggerOnce : true,
                offset : this.trigger_point,
                handler : this.handler
            });
        },

        skipLazyload : function () {
            this.images.parent().each(function () {
                self.handler.apply(this);
            });
        },

        handler : function () {
            var $this = $(this);
            var $image = $this.children('img');
            var image_loaded = null;

            $image.attr('src', $image.attr('data-src'));

            image_loaded = new PhotoMosaic.Plugins.imagesLoaded($image.get(0));
            image_loaded.on('progress', self.progress);
            image_loaded.on('fail', self.fail);
            image_loaded.on('always', self.always);
        },

        progress : function (instance, image) {
            // after each image has loaded
            setTimeout(function () {
                // if you don't want a loading transition OR it's handled by CSS
                if ( self.opts.loading_transition === 'none' || PhotoMosaic.Plugins.Modernizr.csstransitions ) {
                    var $image = $(image.img);
                    var $parent = $image.parents('span.loading, a.loading');
                    var toggleClasses = function () {
                        $parent.addClass('loaded');
                        $image.off(self.mosaic._transition_end_event_name);
                    };

                    $image.on(
                        self.mosaic._transition_end_event_name,
                        toggleClasses
                    );

                    $parent.removeClass('loading');

                } else {
                    // you want a transition but the browser doesn't support CSS Transitions... fade (old IEs)
                    $(image.img).animate(
                        { 'opacity' : '1' },
                        self.opts.resize_transition_settings.duration * 1000,
                        function(){
                            $(this).parents('span.loading, a.loading').removeClass('loading');
                        }
                    );
                }
            }, 0);
        },

        fail : function (instance) {
            // after all images have been loaded with at least one broken image
            setTimeout(function () {
                var id = '';
                var img = null;
                var i = 0;
                var j = 0;
                for (i = 0; i < instance.images.length; i++) {
                    if (!instance.images[i].isLoaded) {
                        $node = $(instance.images[i].img);
                        id = $node.attr('id');
                        img = PhotoMosaic.Utils.deepSearch(self.mosaic.images, 'id', id);

                        for (j = 0; j < self.mosaic.images.length; j++) {
                            if (self.mosaic.images[j] === img) {
                                self.mosaic.images.splice(j,1);
                            }
                        };

                        $node.parent().remove();
                    }
                };

                self.mosaic.refresh();
            }, 0);
        },

        always : function (instance) {
            // after all images have been either loaded or confirmed broken
            setTimeout(function () {
                var $mosaic = self.mosaic.obj.find('.photoMosaic')
                var $images = $mosaic.children('a, span'); 
                var $loading = $images.filter('.loading'); 

                // transitionend fires for each proprty being transitioned, we only care about when the last one ends
                var toggleClasses = PhotoMosaic.Utils.debounce(function () {
                    $mosaic.removeClass('loading').addClass('loaded');
                    self.mosaic.obj.off(self.mosaic._transition_end_event_name);
                }, 1000);

                if ($loading.length == 0) {
                    self.mosaic.obj.on(
                        self.mosaic._transition_end_event_name,
                        toggleClasses
                    );
                }
            }, 0);
        }
    };
}(window.jQuery));
(function ($) {
    PhotoMosaic.Layouts.Common = {
        makeColumnBuckets : function (opts) {
            var columns = [];
            var num_cols = 0;
            var max_width = 0;
            var num_images = 0
            var maths = {};
            var i = 0;

            if (opts.columns && opts.columns !== 'auto') {
                num_cols = opts.columns;
            } else {
                // TODO : make this less lame
                max_width = opts.width;
                num_images = opts.gallery.length;
                maths = {
                    plus : 425, // (300 + (150 / 1.2))
                    minus : 175 // (300 - (150 / 1.2))
                };

                num_cols = (max_width < maths.plus) ? 1 : Math.floor(max_width / maths.minus);

                if (num_images < num_cols) {
                    num_cols = num_images;
                }
            }

            for (i = 0; i < num_cols; i++) {
                columns.push( [] );
            };

            return columns;
        },

        getColumnWidth : function (columns, opts) {
            var num_cols = columns.length;
            var total_padding = opts.padding * (num_cols - 1); // we only pad between columns
            var usable_width = opts.width - total_padding;
            var col_width = Math.floor(usable_width / num_cols);
            return col_width;
        },

        getColumnHeights : function (imagesById, columns, opts) {
            var column_heights = [];
            var column_height = 0;
            var image = null;

            for (var i = 0; i < columns.length; i++) {
                column_height = 0;

                for (var j = 0; j < columns[i].length; j++) {
                    image = imagesById[ columns[i][j] ];
                    column_height += image.height.container;
                }

                column_height += (columns[i].length - 1) * opts.padding;
                column_heights.push( column_height );
            }

            return column_heights;
        },

        dealIntoColumns : function (images, columns, opts, isRefreshing) {
            switch ( opts.order ) {
                case 'random' :
                    columns = this.sortRandomly( images, columns, isRefreshing );
                    break;

                case 'masonry' :
                    columns = this.sortIntoMasonry( images, columns );
                    break;

                case 'columns' :
                    columns = this.sortIntoColumns( images, columns );
                    break;

                case 'rows' :
                default :
                    columns = this.sortIntoRows( images, columns );
                    break;
            }

            return columns;
        },

        sortRandomly : function (images, columns, isRefreshing) {
            // randomize and sort into rows
            // don't re-randomize if we're refreshing
            if (!isRefreshing) {
                images = this.randomizeImages( images );
            }

            columns = this.sortIntoRows( images, columns );

            return columns;
        },

        sortIntoMasonry : function (images, columns) {
            var num_columns = columns.length;
            var num_images = images.length;
            var column_heights = [];
            var which = 0;
            var i = 0;

            for (i = 0; i < num_columns; i++) {
                column_heights[i] = 0;
            } 

            // always place the next image into the shortest column
            for (i = 0; i < num_images; i++) {
                which = $.inArray(
                            Math.min.apply( Math, column_heights ),
                            column_heights
                        );
                columns[which].push( images[i].id );
                column_heights[which] = column_heights[which] + images[i].height.container;
            }

            return columns;
        },

        sortIntoRows : function (images, columns) {
            var num_columns = columns.length;
            var num_images = images.length;
            var which = 0;
            var i = 0;

            for (i = 0; i < num_images; i++) {
                which = i % num_columns;
                columns[which].push(images[i].id);
            }

            return columns;
        },

        sortIntoColumns : function (images, columns) {
            // columns --> rows => columns
            var images = $.extend(true, [], images); // deep copy because we .shift()
            var num_images = images.length;
            var i = 0;
            var j = 0;

            columns = this.sortIntoRows( images, columns );

            // Sorting into rows tells us how many images are in each column.
            // The specific image in each slot is wrong but the slot-division is good.
            // So we replace the image in each slot with the next one from the ordered list.
            for (i = 0; i < columns.length; i++) {
                for (j = 0; j < columns[i].length; j++) {
                    columns[i][j] = images[0].id;
                    images.shift();
                }
            }

            return columns;
        },

        randomizeImages : function (images) {
            return images.sort(function (a, b) {
                return (0.5 - Math.random());
            });
        },

        positionImagesInMosaic : function (imagesById, columns, column_width, opts) {
            var col_height = 0;
            var image = null;

            for (var i = 0; i < columns.length; i++) {
                col_height = 0;

                for (var j = 0; j < columns[i].length; j++) {
                    image = imagesById[ columns[i][j] ];

                    image.position = {
                        top : col_height,
                        left : (i * column_width) + (i * opts.padding)
                    };

                    col_height = col_height + image.height.container + opts.padding;
                };
            };
        },

        normalizeAdjustments : function (adjustments) {
            if (!adjustments.hasOwnProperty('top')) {
                adjustments.top = 0;
            }

            if (!adjustments.hasOwnProperty('left')) {
                adjustments.left = 0;
            }

            return adjustments;
        }
    };
}(window.jQuery));
(function ($) {
    'use strict';

    PhotoMosaic.Layouts.columns = function (mosaic) {
        this.node = mosaic.obj;
        this.opts = mosaic.opts;
        this._options = mosaic._options;
        this._options.gallery = mosaic.opts.gallery.slice(); // we want to be able to refer to the original gallery order
        this.images = mosaic.opts.gallery;
        this.imagesById = PhotoMosaic.Utils.arrayToObj( this.images, 'id' );
        this.isRefreshing = false;
        return this;
    };

    PhotoMosaic.Layouts.columns.prototype = {
        getData : function () {
            var images = this.images;
            var columns = null;
            var column_width = null;
            var mosaic_height = 0;

            if (this._options.width === 'auto' || this._options.width == 0) {
                this.opts.width = this.node.width();
            }

            // determine the number of columns
            this.columns = columns = PhotoMosaic.Layouts.Common.makeColumnBuckets( this.opts );

            // determine the column width (all columns have the same width)
            this.column_width = column_width = PhotoMosaic.Layouts.Common.getColumnWidth( columns, this.opts );

            // scale each image to the column width
            images = this.scaleToWidth( images, column_width );

            // sort the images (based on opts.order) and assign them to columns
            columns = PhotoMosaic.Layouts.Common.dealIntoColumns( images, columns, this.opts, this.isRefreshing );

            // determine the target height for the entire mosaic
            mosaic_height = this.getMosaicHeight( columns );

            //-- ??? mark last column -- is this still necessary?

            // adjust the images in each column to the new height (for a flat bottom edge)
            columns = this.adjustColumnsToHeight( columns, mosaic_height );

            // do everything possible to make sure we show SOMETHING
            if ( this.errorChecks.aspectRatio(images) ) {
                columns = this.balanceColumnsToHeight( columns, mosaic_height );
            }

            // bail if the user's settings creates a super-broken mosaic
            if ( this.errorChecks.height(images) ) {
                return false;
            }

            // create crop position info
            images = this.positionImagesInContainer( images );

            // convert all this knowledge into position data
            // TODO : stop being a side-effect
            PhotoMosaic.Layouts.Common.positionImagesInMosaic( this.imagesById, columns, column_width, this.opts );

            images = PhotoMosaic.Utils.pickImageSize( images, this.opts.sizes );

            this.isRefreshing = false;

            return {
                width : (column_width * columns.length) + (this.opts.padding * (columns.length - 1)),
                height : mosaic_height,
                images : images
            };
        },

        scaleToWidth : function (images, width) {
            for (var i = 0; i < images.length; i++) {
                images[i].width.container = images[i].width.adjusted = width;
                images[i].height.container = images[i].height.adjusted = Math.floor((images[i].height.original * width) / images[i].width.original);
            }

            return images;
        },

        getMosaicHeight : function (columns) {
            if (this.opts.height && this.opts.height !== 'auto') {
                return this.opts.height;
            }

            var column_heights = PhotoMosaic.Layouts.Common.getColumnHeights( this.imagesById, columns, this.opts );

            if (this.opts.prevent_crop) {
                return Math.max.apply( Math, column_heights );
            }

            /*
                function median (values) {
                    var half = Math.floor( values.length / 2 );
                    values.sort( function (a,b) {
                        return a - b;
                    } );
                    if (values.length % 2) {
                        return values[half];
                    } else {
                        return Math.ceil( (values[half-1] + values[half]) / 2 );
                    }
                }
            */

            function mean (values) {
                var sum = 0;
                var i = 0;

                for (i = 0; i < values.length; i++) {
                    sum += values[i];
                };

                return Math.ceil( sum / values.length );
            }

            return mean( column_heights );
        },

        adjustColumnsToHeight : function (columns, target_height) {
            if (this.opts.prevent_crop) {
                return columns;
            }
            for (var i = 0; i < columns.length; i++) {
                columns[i] = this.adjustColumnToHeight( columns[i], target_height );
            }
            return columns;
        },

        adjustColumnToHeight: function (ids, target_height) {
            var column_height = 0;
            var i = 0;

            // get the height of each column
            for (i = 0; i < ids.length; i++) {
                column_height += this.imagesById[ ids[i] ].height.container;
            }

            column_height += (ids.length - 1) * this.opts.padding;

            // ??? mark last image in column

            // how much do we need to grow or shrink the column
            var diff = target_height - column_height // (plus = grow, minus = shrink)
            var direction = (diff > 0) ? 'grow' : 'shrink';
            diff = Math.abs(diff);

            // spread the diff between the image
            i = 0;
            while (diff > 0) {
                i = (i >= ids.length) ? 0 : i;
                if (direction === 'grow') {
                    this.imagesById[ ids[i] ].height.container++;
                } else {
                    this.imagesById[ ids[i] ].height.container--;
                }
                i++;
                diff--;
            }

            return ids;
        },

        balanceColumnsToHeight : function (columns, target_height) {
            if (this.opts.prevent_crop) {
                return columns;
            }
            for (var i = 0; i < columns.length; i++) {
                columns[i] = this.balanceColumnToHeight( columns[i], target_height );
            }
            return columns;
        },

        balanceColumnToHeight : function (ids, target_height) {
            var column_height = target_height - ((ids.length - 1) * this.opts.padding);
            var divy = Math.floor(column_height / ids.length);
            var remainder = column_height % ids.length;

            for (var i = 0; i < ids.length; i++) {
                this.imagesById[ ids[i] ].height.container = divy;
            }

            for (var i = 0; i < remainder; i++) {
                this.imagesById[ ids[i] ].height.container++;
            }

            return ids;
        },

        positionImagesInContainer : function (images) {
            var image = null;

            for (var i = 0; i < images.length; i++) {
                image = images[i];

                image.adjustments = {};

                if (!this.opts.prevent_crop) {
                    // adjusted is still scaled to the column's width
                    if (image.height.adjusted > image.height.container) {
                        image.adjustments.top = Math.floor((image.height.adjusted - image.height.container) / 2);
                    } else {
                        image.width.adjusted = Math.floor((image.width.adjusted * image.height.container) / image.height.adjusted);
                        image.height.adjusted = image.height.container;

                        image.adjustments.left = Math.floor((image.width.adjusted - image.width.container) / 2);
                    }
                }

                image.adjustments = PhotoMosaic.Layouts.Common.normalizeAdjustments( image.adjustments );

                images[i] = image;
            };

            return images;
        },

        refresh : function () {
            this.isRefreshing = true;
            return this.getData();
        },

        update : function (props) {
            this.opts = $.extend({}, this.opts, props);

            // take care of any layout-specific change-logic
            if (props.hasOwnProperty('order')) {
                this.images = this._options.gallery.slice();

                if (props.order == 'random') {
                    this.images = PhotoMosaic.Layouts.Common.randomizeImages( this.images );
                }
            }

            if (props.hasOwnProperty('width')) {
                this._options.width = props.width;

                if (props.width === 'auto' || props.width == 0) {
                    this.opts.width = this.node.width();
                }
            }
        },

        errorChecks : {
            aspectRatio: function (images) {
                for (var i = 0; i < images.length; i++) {
                    if (images[i].height.container <= 10) { // 10 is pretty arbitrary
                        PhotoMosaic.Utils.log.error("Your gallery's height doesn't allow your images to proportioned based on their aspect ratios.");
                        return true;
                    }
                }
                return false;
            },
            height: function (images) {
                for (var i = 0; i < images.length; i++) {
                    if (images[i].height.container <= 0) {
                        PhotoMosaic.Utils.log.error("Your gallery has been hidden because its height is too small for your current settings and won't render correctly.");
                        return true;
                    }
                }
                return false;
            }
        }
    };
}(window.jQuery));
/*
    columns - int / auto
    padding - int
    shape - natural / x:y
    alignment - top / middle / bottom

    orphans - left / right / center
*/
(function ($) {
    PhotoMosaic.Layouts.grid = function (mosaic) {
        this.node = mosaic.obj;
        this.opts = mosaic.opts;
        this._options = mosaic._options;
        this._options.gallery = mosaic.opts.gallery.slice(); // we want to be able to refer to the original gallery order
        this.images = mosaic.opts.gallery;
        this.imagesById = PhotoMosaic.Utils.arrayToObj( this.images, 'id' );
        this.isRefreshing = false;
        return this;
    };

    PhotoMosaic.Layouts.grid.prototype = {
        getData : function () {
            var images = this.images;
            var columns = null;
            var column_width = null;
            var mosaic_height = 0;

            if (this._options.width === 'auto' || this._options.width == 0) {
                this.opts.width = this.node.width();
            }

            // determine the number of columns
            this.columns = columns = PhotoMosaic.Layouts.Common.makeColumnBuckets( this.opts );

            // determine the column width (all columns have the same width)
            this.column_width = column_width = PhotoMosaic.Layouts.Common.getColumnWidth( columns, this.opts );

            // set image container
            images = this.setContainers(images, column_width);

            // scale the image to the container (based on shape)
            images = this.scaleToContainer(images);

            // sort the images (based on opts.order) and assign them to columns
            columns = PhotoMosaic.Layouts.Common.dealIntoColumns( images, columns, this.opts, this.isRefreshing );

            // determine the target height for the entire mosaic
            mosaic_height = this.getMosaicHeight( this.imagesById, columns, this.opts );

            // align
            images = this.alignInContainer( images );

            // convert all this knowledge into position data
            // TODO : stop being a side-effect
            PhotoMosaic.Layouts.Common.positionImagesInMosaic( this.imagesById, columns, column_width, this.opts );

            images = PhotoMosaic.Utils.pickImageSize( images, this.opts.sizes );

            this.isRefreshing = false;

            return {
                width : (column_width * columns.length) + (this.opts.padding * (columns.length - 1)),
                height : mosaic_height,
                images : images
            };
        },

        setContainers : function (images, width) {
            var image = null;
            var aspect_ratio = null;

            for (var i = 0; i < images.length; i++) {
                image = images[i];
                aspect_ratio = this.getAspectRatio( this.opts.shape, image );

                image.width.container = width;
                image.height.container = Math.floor( (aspect_ratio[1] * width) / aspect_ratio[0] );

                images[i] = image;
            }

            return images;
        },

        scaleToContainer : function (images) {
            var image = null;
            var scaled_height = null;

            for (var i = 0; i < images.length; i++) {
                image = images[i];
                scaled_height = Math.floor( (image.height.original * image.width.container) / image.width.original );

                if ( this.shouldScaleWidth( image ) ) {
                    image.width.adjusted = image.width.container;
                    image.height.adjusted = Math.floor( (image.height.original * image.width.adjusted) / image.width.original );
                } else {
                    image.height.adjusted = image.height.container;
                    image.width.adjusted = Math.floor( (image.width.original * image.height.adjusted) / image.height.original );
                }
            }

            return images;
        },

        getMosaicHeight : function (imagesById, columns, opts) {
            var column_heights = PhotoMosaic.Layouts.Common.getColumnHeights( imagesById, columns, opts );
            return Math.max.apply( Math, column_heights );
        },

        alignInContainer : function (images) {
            var image = null;

            for (var i = 0; i < images.length; i++) {
                image = images[i];
                image.adjustments = {};

                if ( this.shouldScaleWidth( image ) ) {
                    image.adjustments.top = Math.floor( (image.height.adjusted - image.height.container) / 2 );
                } else {
                    image.adjustments.left = Math.floor( (image.width.adjusted - image.width.container) / 2 );
                }

                if (this.opts.sizing == 'contain') {
                    switch (this.opts.align) {
                        case 'top':
                            image.adjustments.top = 0;
                            break;

                        case 'middle':
                            image.adjustments.top = Math.floor( (image.height.container - image.height.adjusted) / 2 ) * -1;
                            break;

                        case 'bottom':
                            image.adjustments.top = (image.height.container - image.height.adjusted) * -1;
                            break;
                    }
                }

                image.adjustments = PhotoMosaic.Layouts.Common.normalizeAdjustments( image.adjustments );

                images[i] = image;
            };

            return images;
        },

        getAspectRatio : function (shape, image) {
            var aspect_ratio = null;

            if ( shape == 'natural' || this.errorChecks.shape(shape) ) {
                aspect_ratio = [1,1];
            } else {
                aspect_ratio = shape.split(':');
            }

            return aspect_ratio;
        },

        shouldScaleWidth : function (image) {
            var scaled_height = Math.floor( (image.height.original * image.width.container) / image.width.original );
            return (
                ((this.opts.sizing == 'cover') && (scaled_height > image.height.container)) ||
                ((this.opts.sizing == 'contain') && (scaled_height < image.height.container))
            );
        },

        refresh : function () {
            this.isRefreshing = true;
            return this.getData();
        },

        update : function (props) {
            this.opts = $.extend({}, this.opts, props);

            // take care of any layout-specific change-logic
            if (props.hasOwnProperty('order')) {
                this.images = this._options.gallery.slice();

                if (props.order == 'random') {
                    this.images = PhotoMosaic.Layouts.Common.randomizeImages( this.images );
                }
            }

            if (props.hasOwnProperty('width')) {
                this._options.width = props.width;

                if (props.width === 'auto' || props.width == 0) {
                    this.opts.width = this.node.width();
                }
            }
        },

        errorChecks : {
            shape : function (shape) {
                if ( (shape != 'natural') && (shape.indexOf(':') <= 0) ) {
                    PhotoMosaic.Utils.log.error("'shape' must be 'natural' or an aspect ratio in the form 'x:y'. ")
                    return true;
                }
                return false;
            }
        }
    };
}(window.jQuery));
(function ($) {
    'use strict';

    function prefixId (id) {
        return 'photoMosaic_' + id;
    }

    PhotoMosaic.Layouts.React = {
        mosaic : React.createClass({
            componentDidMount : function () {
                $(this.getDOMNode()).addClass('loading');
            },
            render : function () {
                var id = prefixId(this.props.id);
                var class_name = 'photoMosaic ' + this.props.class_name;
                var style = {
                    width : this.props.width,
                    height : this.props.height
                };
                var images = this.props.images.map(function (image) {
                    return (
                        PhotoMosaic.Layouts.React.image_wrapper(image)
                    );
                });

                if (this.props.center) {
                    style['margin-right'] = 'auto';
                    style['margin-left'] = 'auto';
                }

                return (
                    React.DOM.div({
                        id : id,
                        className : class_name,
                        style : style,
                        children : images
                    })
                );
            }
        }),

        image_wrapper : React.createClass({
            componentDidMount : function () {
                $(this.getDOMNode()).addClass('loading');
            },
            render : function () {
                var data = this.props;
                var node_type = (data.link) ? 'a' : 'span';
                var params = {
                    className : 'photomosaic-item',
                    key : data.id,
                    style : {
                        position : 'absolute',
                        top : data.position.top,
                        left : data.position.left,
                        width : data.width.container,
                        height : data.height.container
                    },
                    children : [
                        PhotoMosaic.Layouts.React.spinner( $.extend({}, data, {key : data.id + '_spinner'}) ),
                        PhotoMosaic.Layouts.React.image(data)
                    ]
                };

                if (data.link) {
                    if (data.external) { params.target = '_blank'; }
                    if (data.modal) { params.rel = data.modal; }
                    if (data.caption) { params.title = data.caption; }
                    params.href = data.path;
                }

                return (
                    React.DOM[node_type](params)
                );
            }
        }),

        image : React.createClass({
            render : function () {
                var data = this.props;
                var style = {
                    width : data.width.adjusted,
                    height : data.height.adjusted,
                };

                for (var key in data.adjustments) {
                    style[key] = data.adjustments[key] * -1;
                }

                return (
                    React.DOM.img({
                        id : data.id,
                        'data-src' : data.src,
                        title : data.caption,
                        alt : data.alt,
                        style : style
                    })
                );
            }
        }),

        spinner : React.createClass({
            render : function () {
                var data = this.props;
                var style = {
                    width : data.width.adjusted,
                    height : data.height.adjusted,
                };

                for (var key in data.adjustments) {
                    style[key] = data.adjustments[key] * -1;
                }

                return (
                    React.DOM.span({
                        className : 'photomosaic-spinner',
                        style : style
                    })
                );
            }
        }),

        loading : React.createClass({
            render : function () {
                return (
                    React.DOM.div({
                        id : prefixId(this.props.id),
                        className : 'photoMosaic',
                        children : React.DOM.div({
                            className : 'photoMosaicLoading',
                            children : 'loading gallery...'
                        })
                    })
                );
            }
        })
    };

}(window.jQuery));
(function ($) {
    'use strict';

    var pluginName = 'photoMosaic';
    var self;

    var photoMosaic = function (el, options, i) {
        self = this;

        this.el = el;
        this.obj = $(el);
        this._options = options;

        this._id = PhotoMosaic.Utils.makeID(true);

        this._transition_end_event_name = (function () {
            var event_names = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'msTransition': 'MSTransitionEnd',
                'transition': 'transitionend'
            };
            return event_names[ PhotoMosaic.Plugins.Modernizr.prefixed( 'transition' ) ];
        })();

        this.init();
    };

    photoMosaic.prototype = {
        _defaults: {
            input : 'json', // json, html, xml
            gallery : 'PMalbum', // json object, xml file path
            padding : 2,
            columns : 'auto', // auto (str) or (int)
            width : 'auto', // auto (str) or (int)
            height : 'auto', // auto (str) or (int)
            links : true,
            external_links: false,
            order : 'rows', // rows, columns, masonry, random
            center : true,
            prevent_crop : false,
            show_loading : false,
            loading_transition : 'fade', // none, fade, scale-up|down, slide-top|right|bottom|left, custom
            resize_transition : true,
            resize_transition_settings : {
                time: 0,
                duration: 0.3,
                effect: 'easeOut'
            },
            modal_name : null,
            modal_group : true,
            modal_hash : null,
            modal_ready_callback : null,
            lazyload : 0, // int || false

            layout : 'columns', // rows, columns, grid
            shape : '16:9', // aspect-ratio (16:9)
            sizing : 'contain', // cover, contain
            align : 'middle', // top, middle, bottom
            orphans : 'left', // left, center, right

            log_gallery_data : false
            // random : false (deprecated: v2.2)
            // force_order : false (deprecated: v2.2)
            // auto_columns : false (deprecated: v2.2)
            // responsive_transition --> resize_transition (deprecated: v2.8)
            // responsive_transition_settings --> resize_transition_settings (deprecated: v2.8)
        },

        init: function () {
            var self = this;

            this.opts = $.extend({}, this._defaults, this._options);
            this.opts = this.adjustDeprecatedOptions(this.opts);
            this._options = $.extend(true, {}, this.opts); // jQuery deep copy

            this.preload = 'PM_preloadify' + this._id;

            // Error Checks
            if ( PhotoMosaic.ErrorChecks.initial(this.opts) ) {
                return;
            }

            $.when(
                this.getGalleryData()
            ).then(function (data) {
                self.opts.gallery = self.setImageIDs(data);
                self.configure();
            });
        },

        configure: function () {
            var self = this;

            if (this.opts.show_loading) {
                this.react = React.renderComponent(
                    PhotoMosaic.Layouts.React.loading({ id : this._id }),
                    this.obj.get(0)
                );
            }

            // if all items have defined w/h we don't need to
            // wait for them to load to do the mosaic math
            if (this.hasDims()) {
                this.opts.gallery = this.prepData(this.opts.gallery);
                this.render();
            } else {
                $.when(this.preloadify()).then(
                    $.proxy(this.preloadDone, this), // all loaded successfully
                    $.proxy(this.preloadDone, this), // not all loaded successfully
                    $.proxy(this.preloadProgress, this) // an item has finished, successful or not
                );
            }
        },

        render: function () {
            var self = this;
            var layout_data = null;
            var view_model = null;
            var mosaic_data = {
                id : this._id,
                class_name : this.makeSpecialClasses(),
                center : this.opts.center
            };

            // bail if we don't have any images (e.g. they all failed to load)
            if ( PhotoMosaic.ErrorChecks.initial(this.opts) ) { return; }

            this.layout = new PhotoMosaic.Layouts[ this.opts.layout ]( this );
            layout_data = this.layout.getData();

            view_model = $.extend({}, mosaic_data, layout_data);

            this.react = React.renderComponent(
                PhotoMosaic.Layouts.React.mosaic(view_model), // the component to render
                this.obj.get(0), // the dom node container
                function () {  // the callback
                    // triggers lazyloading / imagesLoaded
                    self.loader = new PhotoMosaic.Loader(self.obj, self);

                    // update the mosaic on window.resize
                    $(window)
                        .unbind('resize.photoMosaic' + self._id)
                        .bind('resize.photoMosaic' + self._id, function () {
                            self.refresh();
                        });

                    // run the user's modal_ready_callback
                    self.modalCallback();
                }
            );

            // logging
            if (this.opts.log_gallery_data) {
                PhotoMosaic.Utils.logGalleryData(this.opts.gallery);
            }
        },

        preloadify: function () {
            var $images = $('<div>').attr({
                    'id': this.preload,
                    'class' : 'PM_preloadify'
                });
            var self = this;

            $.each(this.opts.gallery, function (i) {
                var image_url = (this.thumb && this.thumb !== '') ? this.thumb : this.src;
                var $item = $('<img>')
                                .attr({ src : image_url })
                                .addClass(this.id);

                $images.append($item);
            });

            $('body').append($images);

            return $images.imagesLoaded();
        },

        preloadDone : function () {
            this.opts.gallery = this.prepData(this.opts.gallery, true);
            this.render();
        },

        preloadProgress : function (instance, image) {
            var img = null;
            if (!image.isLoaded) {
                id = image.img.className;

                for (i = 0; i < this.opts.gallery.length; i++) {
                    if (this.opts.gallery[i].id == id) {
                        this.opts.gallery.splice(i,1);
                    }
                }

                PhotoMosaic.Utils.log.error("The following image failed to load and was skipped.\n" + image.img.src);
            }
        },

        prepData: function (gallery, isPreload) {
            var self = this;
            var $preload = $('#' + this.preload);
            var $img = null;
            var image = null;
            var image_url = '';
            var modal_text = '';
            var mem = {};
            var images = [];

            $.each(gallery, function (i) {
                image = $.extend(true, {}, this); // jQuery deep copy

                if (isPreload) {
                    $img = $img = $preload.find('.' + this.id);
                    mem = {
                        w : $img.width(),
                        h : $img.height()
                    };
                } else {
                    mem = {
                        w : parseInt(this.width),
                        h : parseInt(this.height)
                    };
                }

                image.width = {
                    original: mem.w
                };
                image.height = {
                    original: mem.h
                };

                image_url = (image.thumb && image.thumb !== '') ? image.thumb : image.src;

                // image sizes
                image.full = image.src;
                image.src = image_url;
                image.padding = self.opts.padding;

                // modal hooks
                if (self.opts.modal_name) {
                    if (self.opts.modal_group) {
                        if (self.opts.modal_hash) {
                            modal_text = self.opts.modal_name + '[' + self.opts.modal_hash + ']';
                        } else {
                            modal_text = self.opts.modal_name + '[' + self._id + ']';
                        }
                    } else {
                        modal_text = self.opts.modal_name;
                    }
                    image.modal = modal_text;
                }

                // link paths
                if (self.opts.links && image.url) {
                    image.link = true;
                    image.path = image.url;
                    image.external = self.opts.external_links;
                    // delete image.modal;
                } else if (self.opts.links) {
                    image.link = true;
                    image.path = image.full;
                    image.external = self.opts.external_links;
                } else {
                    image.link = false;
                }

                images.push(image);
            });

            return images;
        },

        getGalleryData: function () {
            var self = this;

            // construct the gallery
            if (this.opts.input === 'json') {
                return PhotoMosaic.Inputs.json(this.opts.gallery);

            } else if (this.opts.input === 'html') {
                return PhotoMosaic.Inputs.html(this.obj, this.opts);

            } else if (this.opts.input === 'xml' ) {
                return $.when(
                        $.get(this.opts.gallery)
                    ).then(
                        // success
                        function (data) {
                            var gallery;
                            if ($(data).find('photos').length > 0) {
                                return PhotoMosaic.Inputs.xml( $(data).find('photos') );
                            } else {
                                PhotoMosaic.Utils.log.error("The XML doesn't contain any <photo> nodes.");
                                return;
                            }
                        },
                        // fail
                        function () {
                            PhotoMosaic.Utils.log.error("The XML either couldn't be found or was malformed.");
                            return;
                        }
                    );
            }
        },

        setImageIDs: function (gallery) {
            for (var i = 0; i < gallery.length; i++) {
                gallery[i].key = gallery[i].id = PhotoMosaic.Utils.makeID(false, 'pm');
            };
            return gallery;
        },

        hasDims: function () {
            var some = false; // set to true if any dims are found
            var all = true; // set to false if any dims aren't found

            if (this.hasSpecifiedDims !== undefined) {
                return this.hasSpecifiedDims;
            }

            for (var i = 0; i < this.opts.gallery.length; i++) {
                // are w/h properties present?
                if (this.opts.gallery[i].hasOwnProperty('width') && this.opts.gallery[i].hasOwnProperty('height')) {
                    // is there valid data?
                    // in some cases WP reports 0 for both the height and width
                    if (
                        isNaN(parseInt(this.opts.gallery[i].width)) ||
                        isNaN(parseInt(this.opts.gallery[i].height)) ||
                        this.opts.gallery[i].width == 0 ||
                        this.opts.gallery[i].height == 0
                    ) {
                        all = false;
                    } else {
                        some = true;
                    }
                } else {
                    all = false;
                }
            };

            if (some && !all) {
                PhotoMosaic.Utils.log.error("Width / Height data not present for all images.");
            }

            this.hasSpecifiedDims = all;

            return this.hasSpecifiedDims;
        },

        getLoadingTransition: function () {
            var transition = 'none';

            if (PhotoMosaic.Plugins.Modernizr.csstransitions && PhotoMosaic.Plugins.Modernizr.csstransforms && this.opts.loading_transition !== false) {
                transition = this.opts.loading_transition
            }
            return 'loading-transition-' + transition;
        },

        getResizeTransition : function () {
            return (this.opts.resize_transition) ? '' : 'resize-transition-none';
        },

        getLayoutClass: function () {
            return 'layout-' + this.opts.layout + ((this.opts.layout == 'grid') ? '-' + this.opts.sizing : '');
        },

        getUniqueClass: function () {
            return (this.opts.modal_hash) ? 'photomosaic-' + this.opts.modal_hash : '';
        },

        getAvia: function () {
            // Kriesi's Avia framework overwrites the 'left' prop on my links
            // 'noLightbox' prevents that shit from happening
            return (typeof window.avia_framework_globals !== 'undefined') ? 'noLightbox' : '';
        },

        makeSpecialClasses: function () {
            var classes = [
                this.getUniqueClass(),
                this.getLoadingTransition(),
                this.getResizeTransition(),
                this.getLayoutClass(),
                this.getAvia()
            ];
            return classes.join(' ');
        },

        refresh: function () {
            var self = this;
            var mosaic_data = {
                id : this._id,
                class_name : this.makeSpecialClasses(),
                center : this.opts.center
            };

            var layout_data = this.layout.refresh();
            var view_model = $.extend({}, mosaic_data, layout_data);

            // transitionend fires for each proprty being transitioned, we only care about when the last one ends
            var checkLazyload = PhotoMosaic.Utils.debounce(function () {
                $.waypoints('refresh');
            }, 300);

            self.react.setProps(
                view_model,
                function () {
                    // if applicable, wait until after the CSS transitions fire to trigger a lazyloading check
                    if (PhotoMosaic.Plugins.Modernizr.csstransitions && self.opts.lazyload !== false) {
                        self.obj.on(
                            self._transition_end_event_name,
                            checkLazyload
                        );
                    }
                }
            );
        },

        update: function (props) {
            if ('object' != typeof(props)) {
                PhotoMosaic.Utils.log.error("The 'update' method accepts an object of parameters to be updated.");
                return false;
            }

            this.opts = $.extend({}, this.opts, props);

            if (props.hasOwnProperty('layout')) {
                this.layout = new PhotoMosaic.Layouts[ this.opts.layout ]( this );
            } else {
                this.layout.update(props);
            }

            this.refresh();
        },

        modalCallback: function () {
            var $node = this.obj.children().get(0);
            if ($.isFunction(this.opts.modal_ready_callback)) {
                this.opts.modal_ready_callback.apply(this, [$node]);
            }
        },

        adjustDeprecatedOptions: function (opts) {
            // random : true | false
            if (opts.random) {
                opts.order = 'random';
            }

            // force_order : true | false
            if (opts.force_order) {
                opts.order = 'columns';
            }

            // responsive_transition renamed to resize_transition
            if (opts.hasOwnProperty('responsive_transition')) {
                opts.resize_transition = opts.responsive_transition;
            }
            if (opts.hasOwnProperty('responsive_transition_settings')) {
                opts.resize_transition_settings = opts.responsive_transition_settings;
            }

            return opts;
        },

        _name : pluginName,

        version : PhotoMosaic.version
    };


    $.fn[pluginName] = function (options) {
        return this.each(function () {
            var instance = $.data(this, pluginName);

            if ( instance && options ) {
                instance.update(options);
            } else if ( instance ) {
                instance.refresh();
            } else {
                options = options || {};
                instance = $.data(this, pluginName, new photoMosaic(this, options));

                // for debugging
                window.PhotoMosaic.$ = $;
                window.PhotoMosaic.Mosaics.push({
                    'el' : this,
                    '$el' : $(this),
                    'opts' : options,
                    'instance' : instance
                });
            }
        });
    };

}(window.jQuery));
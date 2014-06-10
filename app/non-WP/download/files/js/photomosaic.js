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
    registerNamespace('PhotoMosaic.version', '2.7.5');

}(jQuery, window));
/*
    Modernizr 2.6.2 (Custom Build) | MIT & BSD
    Build: http://modernizr.com/download/#-csstransforms-csstransitions-testprop-testallprops-domprefixes
*/
(function(window){
    window.PhotoMosaic.Plugins.Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!D("transform")},p.csstransitions=function(){return D("transition")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" PM_"+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" PM_js PM_"+s.join(" PM_")+" ":""),e}(this,this.document);
}(window));
/*
    mustache.js — Logic-less templates in JavaScript
    See http://mustache.github.com/ for more info.
*/
(function(window){

    window.PhotoMosaic.Plugins.Mustache = function(){var Renderer=function(){};Renderer.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":true},context:{},render:function(template,context,partials,in_recursion){if(!in_recursion){this.context=context;this.buffer=[];}
    if(!this.includes("",template)){if(in_recursion){return template;}else{this.send(template);return;}}
    template=this.render_pragmas(template);var html=this.render_section(template,context,partials);if(in_recursion){return this.render_tags(html,context,partials,in_recursion);}
    this.render_tags(html,context,partials,in_recursion);},send:function(line){if(line!=""){this.buffer.push(line);}},render_pragmas:function(template){if(!this.includes("%",template)){return template;}
    var that=this;var regex=new RegExp(this.otag+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+
    this.ctag);return template.replace(regex,function(match,pragma,options){if(!that.pragmas_implemented[pragma]){throw({message:"This implementation of mustache doesn't understand the '"+
    pragma+"' pragma"});}
    that.pragmas[pragma]={};if(options){var opts=options.split("=");that.pragmas[pragma][opts[0]]=opts[1];}
    return"";});},render_partial:function(name,context,partials){name=this.trim(name);if(!partials||partials[name]===undefined){throw({message:"unknown_partial '"+name+"'"});}
    if(typeof(context[name])!="object"){return this.render(partials[name],context,partials,true);}
    return this.render(partials[name],context[name],partials,true);},render_section:function(template,context,partials){if(!this.includes("#",template)&&!this.includes("^",template)){return template;}
    var that=this;var regex=new RegExp(this.otag+"(\\^|\\#)\\s*(.+)\\s*"+this.ctag+"\n*([\\s\\S]+?)"+this.otag+"\\/\\s*\\2\\s*"+this.ctag+"\\s*","mg");return template.replace(regex,function(match,type,name,content){var value=that.find(name,context);if(type=="^"){if(!value||that.is_array(value)&&value.length===0){return that.render(content,context,partials,true);}else{return"";}}else if(type=="#"){if(that.is_array(value)){return that.map(value,function(row){return that.render(content,that.create_context(row),partials,true);}).join("");}else if(that.is_object(value)){return that.render(content,that.create_context(value),partials,true);}else if(typeof value==="function"){return value.call(context,content,function(text){return that.render(text,context,partials,true);});}else if(value){return that.render(content,context,partials,true);}else{return"";}}});},render_tags:function(template,context,partials,in_recursion){var that=this;var new_regex=function(){return new RegExp(that.otag+"(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?"+
    that.ctag+"+","g");};var regex=new_regex();var tag_replace_callback=function(match,operator,name){switch(operator){case"!":return"";case"=":that.set_delimiters(name);regex=new_regex();return"";case">":return that.render_partial(name,context,partials);case"{":return that.find(name,context);default:return that.escape(that.find(name,context));}};var lines=template.split("\n");for(var i=0;i<lines.length;i++){lines[i]=lines[i].replace(regex,tag_replace_callback,this);if(!in_recursion){this.send(lines[i]);}}
    if(in_recursion){return lines.join("\n");}},set_delimiters:function(delimiters){var dels=delimiters.split(" ");this.otag=this.escape_regex(dels[0]);this.ctag=this.escape_regex(dels[1]);},escape_regex:function(text){if(!arguments.callee.sRE){var specials=['/','.','*','+','?','|','(',')','[',']','{','}','\\'];arguments.callee.sRE=new RegExp('(\\'+specials.join('|\\')+')','g');}
    return text.replace(arguments.callee.sRE,'\\$1');},find:function(name,context){name=this.trim(name);function is_kinda_truthy(bool){return bool===false||bool===0||bool;}
    var value;if(is_kinda_truthy(context[name])){value=context[name];}else if(is_kinda_truthy(this.context[name])){value=this.context[name];}
    if(typeof value==="function"){return value.apply(context);}
    if(value!==undefined){return value;}
    return"";},includes:function(needle,haystack){return haystack.indexOf(this.otag+needle)!=-1;},escape:function(s){s=String(s===null?"":s);return s.replace(/&(?!\w+;)|["'<>\\]/g,function(s){switch(s){case "&": return "&amp;";case "\\": return "\\\\";case '"': return '&quot;';case "'": return '&#39;';case "<": return "&lt;";case ">": return "&gt;";default: return s;
    }});},create_context:function(_context){if(this.is_object(_context)){return _context;}else{var iterator=".";if(this.pragmas["IMPLICIT-ITERATOR"]){iterator=this.pragmas["IMPLICIT-ITERATOR"].iterator;}
    var ctx={};ctx[iterator]=_context;return ctx;}},is_object:function(a){return a&&typeof a=="object";},is_array:function(a){return Object.prototype.toString.call(a)==='[object Array]';},trim:function(s){return s.replace(/^\s*|\s*$/g,"");},map:function(array,fn){if(typeof array.map=="function"){return array.map(fn);}else{var r=[];var l=array.length;for(var i=0;i<l;i++){r.push(fn(array[i]));}
    return r;}}};return({name:"mustache.js",version:"0.3.1-dev",to_html:function(template,view,partials,send_fun){var renderer=new Renderer();if(send_fun){renderer.send=send_fun;}
    renderer.render(template,view,partials);if(!send_fun){return renderer.buffer.join("\n");}}});}();

}(window));
/*!
* JSTween JavaScript Library v1.1
* http://www.jstween.org/
*
* Copyright 2011, Marco Wolfsheimer
* JSTween by Marco Wolfsheimer is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
*
* Date: Sun Mar 13 12:46:40 2011 -0000
*/
 
/*
TERMS OF USE - EASING EQUATIONS

Open source under the BSD License. 

Copyright � 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
    Edited by Michael Kafka (makfak)
     - hardcoded jQuery references changed to '$'
     - jQuery added to closure
     - moved from window.JSTween to PhotoMosaic.JSTween
*/
window.PhotoMosaic.Plugins.JSTween = (function ($, that) {

    var __prop = /[\-]{0,1}[0-9\.]{1,}|#[0-9\.abcdef]{3,6}/gi,
        __unit = /[pxemtcin%]{1,2}|deg/gi,
        __value = /[0-9\.\-]{1,}/gi,
        __hexValue = /[0-9a-f]{3,6}/gi,
        __hasHash = /^#/,
        __singleValue = /^[0-9\.\-]{1,}([pxemtcin%]{1,2}|deg)$/,
        __letters = /[a-z]{1,}/,
        __hasRGB = /^rgb\(/,
        __hasScroll = /^scroll/,
        __cssHyphen = /-([a-z])/ig,
        __cssMSHyphen = /^-ms/ig,
        __cssSuportLookup = {
            opacity:[ 'opacity', '-moz-opacity', 'filter' ],
            shadow: [ 'box-shadow', '-moz-box-shadow', '-o-box-shadow', '-ms-box-shadow', '-webkit-box-shadow' ],
            transform: [ '-moz-transform', 'transform', '-o-transform', '-ms-transform','-webkit-transform' ],
            transformOrigin: [ '-moz-transform-origin', 'transform-origin', '-o-transform-origin', '-ms-transform-origin', '-webkit-transform-origin' ],
            borderRadius:[ '-moz-border-radius', 'border-radius', '-webkit-border-radius' ],
            borderRadiusTopLeft:[ '-moz-border-radius-topleft', 'border-top-left-radius', '-webkit-border-top-left-radius' ],
            borderRadiusTopRight:[ '-moz-border-radius-topright', 'border-top-right-radius', '-webkit-border-top-right-radius' ],
            borderRadiusBottomLeft:[ '-moz-border-radius-bottomleft', 'border-bottom-left-radius', '-webkit-border-bottom-left-radius' ],
            borderRadiusBottomRight:[ '-moz-border-radius-bottomright', 'border-bottom-right-radius', '-webkit-border-bottom-right-radius' ],
            backgroundSize: [ 'background-size', '-moz-background-size', '-o-background-size', '-webkit-background-size' ]
        },
        __timeline = {},
        __elements = [],
        __frame = 0,
        __runTime = 0,
        __playing = false,
        __playCallback = false,
        __frameTime = false,
        __playTime = 0,
        __config = {},
        __mobile = ( /iPad/i.test( navigator.userAgent ) || /iPhone OS/i.test( navigator.userAgent ) );

        var init = function () {

            framerate( __mobile ? 30 : 45 );
            cssSupport();

            // Fail nicely if $ does not exist
            try{ attach();  } catch(e){ return; }
        };

        var attach = function() {

            var fn = $.fn;

            $.JSTween = that;

            fn.tween = function (options) {

                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    tween(this[i], options);
                }

                return this;
            };

            $.framerate = function (options) {
                framerate(options);
            };

            $.play = function ( callback ) {
                play( callback );
            };

            $.clear = function ( elem, prop ) {
                clear( elem, prop );
            };

            fn.play = function ( callback ) {
                play( callback );
                return this;
            };

            fn.clear = function (prop) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    clear(this[i], prop);
                }

                return this;
            };

            fn.property = function (name) {
                var prop = [], i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    prop.push( getProperty( this[i], name) );
                }

                return prop.length === 1 ? prop[0] : prop;
            };

            fn.opacity = function (value) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    opacity(this[i], value);
                }

                return this;
            };

            fn.alpha = fn.opacity;
            fn.transparency = fn.opacity;

            fn.rotate = function (value) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    rotate(this[i], value);
                }

                return this;
            };

            fn.action = function (type, value, units, callback) {
                var elementID,
                    prop,
                    i,
                    length = this.length,
                    parsedType = {};

                if( typeof type === 'object' ) {

                    for( prop in type ) {
                        if( type.hasOwnProperty( prop ) && typeof type[prop] === 'string' ) {
                            if( __singleValue.test( type[prop] ) ) {
                                parsedType[prop] = { value: parseFloat( type[prop].match( __value )[0], 10 ), units: type[prop].match( __unit )[0] };
                            } else {
                                parsedType[prop] = { value: type[prop], units: undefined };
                            }
                        }
                    }

                    for( i = 0; i < length; i++ ) {
                        elementID = $.JSTween.register(this[i]);

                        for( prop in parsedType ) {
                            if( parsedType.hasOwnProperty( prop ) ) {
                                $.JSTween.action( elementID, prop, parsedType[prop].value,  parsedType[prop].units, undefined, true);
                            }
                        }
                    }

                } else {
                    for( i = 0; i < length; i++ ) {
                        action( register(this[i]), type, value, units, callback, true);
                    }
                }
                return this;
            };

            fn.state = function (type) {
                if (this.length > 0 ) {
                    if( this[0].__animate !== undefined ) {
                        if( type !== undefined && this[0].__animate.state[type] !== undefined  ) {
                            return this[0].__animate.state[type];
                        } else if( type === undefined ) {
                            return this[0].__animate.state;
                        }
                    }
                }
            };

            fn.transform = function (value) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    transform(this[i], value);
                }

                return this;
            };

            fn.transformOrigin = function (value) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    transformOrigin(this[i], value);
                }

                return this;
            };

            fn.backgroundSize = function (value) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    backgroundSize(this[i], value);
                }

                return this;
            };

            fn.shadow = function (value) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    shadow(this[i], value);
                }

                return this;
            };

            fn.borderRadius = function (value, units) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    borderRadius(this[i], value, units );
                }

                return this;
            };

            fn.borderRadiusTopRight = function (value, units) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    borderRadiusCorner(this[i], 'top', 'right', value, units);
                }

                return this;
            };

            fn.borderRadiusTopLeft = function (value, units) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    borderRadiusCorner(this[i], 'top', 'left', value, units);
                }

                return this;
            };

            fn.borderRadiusBottomRight = function (value, units) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    borderRadiusCorner(this[i], 'bottom', 'right', value, units);
                }

                return this;
            };

            fn.borderRadiusBottomLeft = function (value, units) {
                var i, length = this.length;

                for( i = 0; i < length; i++ ) {
                    borderRadiusCorner(this[i], 'bottom', 'left', value, units);
                }
                return this;
            };

            fn.borderRadiusCorner = function (top, right, value, units) {
                var i, length = this.length;

                for( i = 0; i < this.length; i++ ) {
                    borderRadiusCorner(this[i], top, right, value, units);
                }
                return this;
            };
        };

        var upperCase = function( all, letter ) {
            return letter.toUpperCase();
        };

        var camelCase = function( string ){
            return string.replace( __cssMSHyphen, 'ms' ).replace( __cssHyphen, upperCase );
        };

        var framerate = function (fps) {
            if( !fps ) { return __config.frameRate; }

            __config.frameRate = fps || 45;
            __config.frameDelay = Math.round(1000 / __config.frameRate);
            __config.frameLength = (1 / __config.frameRate);

            return __config.frameRate;
        };

        var cssSupport = function(){
            var htmlTag = document.getElementsByTagName('html'),
                htmlStyle, propType;

            if( htmlTag[0] !== undefined ) {
                htmlStyle = htmlTag[0].style;

                for( propType in __cssSuportLookup ) {
                    if ( __cssSuportLookup.hasOwnProperty( propType ) ) {
                        for( i = 0; i < __cssSuportLookup[ propType ].length; i++ ) {
                            if( htmlStyle[ __cssSuportLookup[propType][i] ] !== undefined ) {
                                __cssSuportLookup[propType] = __cssSuportLookup[propType][i];
                                break;
                            } else if ( htmlStyle[ camelCase( __cssSuportLookup[propType][i] ) ] !== undefined ) {
                                __cssSuportLookup[propType] = camelCase( __cssSuportLookup[propType][i] );
                                break;
                            }
                        }
                    }
                }
            }
        };

        var getProperty = function (element, name) {
            if( element.__animate !== undefined ) {
                if( name === undefined ) {
                    return element.__animate.state;
                } else if ( element.__animate.state[name] ) {
                    return element.__animate.state[name];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        var getScroll = function (element, property, stop) {
            if (element.tagName === undefined && ( element.scroll !== undefined || element.scrollTo !== undefined ) ) {
                return $( element ).scrollLeft() + 'px ' + $( element ).scrollTop() + 'px';
            } else {
                return element.scrollLeft + 'px ' + element.scrollTop + 'px';
            }
        };

        var getComputedStyle = function (element, property, stop) {

            var foundValue = getProperty(element, property),
                computedStyle, value, units, scroll;

            // First, see if we have an animation state value for this property already.. much quicker than attacking the DOM
            if (foundValue !== false && !__hasScroll.test(property)) {
                return {
                    value: foundValue.value,
                    units: element.__animate.state[property].units
                };
            } else {
                // Yes I know.. switch isn't wonderfull.. but a necessary way to keep the coad bloat down and performance up in JSTween.
                switch (property) {

                    case 'transform':
                    case 'transformOrigin':
                    case 'shadow':
                    case 'boxShadow':
                    case 'backgroundSize':
                        value = stop;
                        break;

                    case 'opacity':
                    case 'transparency':
                    case 'alpha':
                        value = 100;
                        break;

                    case 'scrollLeft':
                    case 'scrollTop':
                    case 'scroll':
                    case 'scrollTo':
                        value = getScroll(element, property, stop);
                        break;

                    default:

                        if (window.getComputedStyle !== undefined) {
                            computedStyle = window.getComputedStyle(element, null)[property];
                        } else if (element.currentStyle !== undefined) {
                            computedStyle = element.currentStyle[property];
                        }

                        if (computedStyle === 'auto' || computedStyle === undefined || computedStyle === '') {
                            value = 0;
                            units = 'px';
                        } else if( __hasRGB.test( computedStyle ) ) {
                            value = convertRGBToHex( computedStyle );
                        } else {
                            value = parseFloat(computedStyle.match( __value ), 10);
                            units = computedStyle.match( __unit );
                        }

                        break;
                }

                return {
                    value: value,
                    units: units
                };

            }
        };

        var parseOptions = function (element, options) {

            var newOptions = {},
                property, computedStyle;

            for (property in options) {

                if (options.hasOwnProperty(property) && property !== 'onStart' && property !== 'onStop' && property !== 'onFrame') {

                    newOptions[property] = {};

                    // Find missing start values if needed
                    if (options[property].start === undefined) {
                        computedStyle = getComputedStyle(element, property, options[property].stop);
                        newOptions[property].start = computedStyle.value;
                    } else {
                        newOptions[property].start = parseProperty(options[property].start);
                    }

                    newOptions[property].stop = parseProperty(options[property].stop, 1);
                    newOptions[property].duration = parseProperty(options[property].duration || newOptions[property].dur, 1);
                    newOptions[property].time = parseProperty(options[property].time, 0);
                    newOptions[property].merge = parseProperty(options[property].merge, false);
                    newOptions[property].effect = parseProperty(options[property].effect, 'linear');
                    newOptions[property].framerate = parseProperty(options[property].framerate, __config.frameRate);
                    newOptions[property].units = parseProperty(options[property].units, computedStyle ? computedStyle.units : 'px');
                    newOptions[property].end = parseProperty(options[property].end, (newOptions[property].time + newOptions[property].duration));

                    // Clean up scolling metrics and turn them into paired strings
                    if ( __hasScroll.test( property ) ) {
                        if (typeof newOptions[property].start === 'number') {
                            newOptions[property].start = newOptions[property].start + 'px ' + newOptions[property].start + 'px';
                        }
                        if (typeof newOptions[property].stop === 'number') {
                            newOptions[property].stop = newOptions[property].stop + 'px ' + newOptions[property].stop + 'px';
                        }
                    }

                    newOptions[property].callback = {
                        onStart: options[property].onStart,
                        onFrame: options[property].onFrame,
                        onStop: options[property].onStop
                    };
                }
            }

            return newOptions;
        };

        var parseProperty = function (property, defaultValue) {
            if (typeof property === 'function') {
                return property();
            } else if (property !== undefined) {
                return property;
            } else {
                return defaultValue;
            }
        };

        var convertRGBToHex = function (color) {

            var colours = color.match(__value), red, green, blue;

            red = parseInt( colours[0], 10 ).toString(16);
                if (red.length === 1) { red = "0" + red; }

            green = parseInt( colours[1], 10 ).toString(16);
                if (green.length === 1) { green = "0" + green; }

            blue = parseInt( colours[2], 10 ).toString(16);
                if (blue.length === 1) { blue = "0" + blue; }

            return '#' + red + green + blue;
        };

        var parseColor = function (color) {
            if (color.length === 3) {
                return [parseInt(color.substr(0, 1), 16) * 16, parseInt(color.substr(1, 1), 16) * 16, parseInt(color.substr(2, 1), 16) * 16];
            } else {
                return [parseInt(color.substr(0, 2), 16), parseInt(color.substr(2, 2), 16), parseInt(color.substr(4, 2), 16)];
            }
        };

        var parseCSSProperty = function (str) {

            var values = str.match( __prop ),
                delimiters = str.split( __prop ),
                units = [],
                id,
                length = values.length;

            for (id = 0; id < length; id++) {
                if (__hasHash.test( values[id])) {
                    values[id] = parseColor(values[id].match( __hexValue )[0]);
                } else {
                    values[id] = parseFloat(values[id].match(__value)[0], 10);
                }
            }

            return {
                value: values,
                delimiter: delimiters
            };
        };

        var mergeStringProperty = function (start, stop, property, options, time, end) {

            var frameProperty = "",
                color = "",
                i, n,
                length = start.value.length,
                startLength = 0;

            for (i = 0; i < length; i++) {

                if (typeof start.value[i] === 'object' && start.value[i].length !== undefined) {

                    frameProperty += start.delimiter[i] + "#";

                    startLength = start.value[i].length;

                    for (n = 0; n < startLength; n++) {

                        color = Math.round(effects[options.effect]((time - options.time), start.value[i][n], (stop.value[i][n] - start.value[i][n]), (end - options.time)), 10).toString(16);

                        if (color.length === 1) {
                            color = "0" + color;
                        }
                        frameProperty += color;
                    }

                } else {
                    frameProperty += start.delimiter[i] + effects[options.effect]((time - options.time), start.value[i], (stop.value[i] - start.value[i]), (end - options.time));
                }
            }

            return frameProperty + start.delimiter[start.delimiter.length - 1];
        };

        var loopStringFrames = function( elementID, property, propertyOptions ){

            var frameCounter,
                startParsed = parseCSSProperty(propertyOptions.start),
                stopParsed = parseCSSProperty(propertyOptions.stop),
                time,
                offset,
                frameValue,
                frameSkip,
                frameLength = __config.frameLength,
                end = propertyOptions.end;


            frameCounter = frameSkip = Math.round(__config.frameRate / propertyOptions.framerate - 1);

            for ( time = propertyOptions.time; time < end; time += frameLength) {

                offset = __frame + Math.round(time * __config.frameRate);

                if (frameCounter === 0) {

                    frameValue = mergeStringProperty(startParsed, stopParsed, property, propertyOptions, time, propertyOptions.end);
                    makeFrame(offset, elementID, property, frameValue, propertyOptions.units, false, false);
                    frameCounter = frameSkip;

                } else {

                    makeFrame(offset, elementID, property);
                    frameCounter--;
                }
            }

            // Final frame, make sure the element lands in the correct place
            offset = __frame + (Math.round(propertyOptions.end * __config.frameRate));
            makeFrame(offset, elementID, property, propertyOptions.stop, propertyOptions.units, false, true);
        };

        var loopFrames = function( elementID, property, propertyOptions ){

            var frameCounter,
                time,
                offset,
                frameValue,
                frameSkip,
                frameLength = __config.frameLength,
                end = propertyOptions.end;

            frameCounter = frameSkip = Math.round(__config.frameRate / propertyOptions.framerate - 1);  

            for ( time = propertyOptions.time; time < end; time += frameLength) {

                offset = __frame + (Math.round(time * __config.frameRate));

                if (frameCounter === 0) {

                    frameValue = effects[propertyOptions.effect]((time - propertyOptions.time), propertyOptions.start, (propertyOptions.stop - propertyOptions.start), (propertyOptions.end - propertyOptions.time));
                    makeFrame(offset, elementID, property, frameValue, propertyOptions.units, false, false);
                    frameCounter = frameSkip;

                } else {

                    makeFrame(offset, elementID, property);
                    frameCounter--;
                }
            }

            // Final frame, make sure the element lands in the correct place
            offset = __frame + (Math.round(propertyOptions.end * __config.frameRate));
            makeFrame(offset, elementID, property, propertyOptions.stop, propertyOptions.units, false, true);
        };

        var getTimeBounds = function( options ) {

            var bounds = { start:0, stop:0 }, property;

            for (property in options) {
                if (options.hasOwnProperty(property)) {
                    if( options[property].end > bounds.stop ) { bounds.stop = options[property].end; }
                }
            }

            bounds.start = bounds.stop;

            for (property in options) {
                if (options.hasOwnProperty(property)) {
                    if( options[property].time < bounds.start ) { bounds.start = options[property].time; }
                }
            }

            return bounds;
        };

        var tween = function (element, config) {

            var elementID = register(element),
                offset = 0,
                time = 0,
                startParsed, stopParsed, frameSkip = 0,
                options = parseOptions(element, config),
                property,
                bounds = getTimeBounds( options );

            for (property in options) {

                if (options.hasOwnProperty(property)) {

                    // Make property frames
                    if (typeof options[property].start === 'string') {
                        loopStringFrames( elementID, property, options[property] );
                    } else {
                        loopFrames( elementID, property, options[property] );
                    }

                    // PROPERTY CALLBACKS

                    // onStart
                    if (typeof options[property].callback.onStart === 'function') {
                        addCallback(__frame + (Math.round(options[property].time * __config.frameRate)), elementID, property, options[property].callback.onStart);
                    }

                    // onFrame
                    if (typeof options[property].callback.onFrame === 'function') {
                        for (time = options[property].time; time < options[property].end; time += __config.frameLength) {
                            offset = __frame + (Math.round(time * __config.frameRate));
                            addCallback(offset, elementID, property, options[property].callback.onFrame);
                        }
                    }

                    // onStop
                    if (typeof options[property].callback.onStop === 'function') {
                        addCallback(__frame + (Math.round(options[property].end * __config.frameRate)), elementID, property, options[property].callback.onStop);
                    }

                    // CLEANUP

                    // Get the offset and increase the current runtime if needed
                    offset = __frame + (Math.round(options[property].end * __config.frameRate));

                    // Clean up
                    if (offset > __runTime) {
                        __runTime = offset;
                    }

                }
            }

            if (typeof config.onStart === 'function') {
                addCallback(__frame + (Math.round(bounds.start * __config.frameRate)), elementID, 'callback', config.onStart);
            }

            if (typeof config.onFrame === 'function') {
                for (frame = __frame + Math.round(bounds.start * __config.frameRate); frame <= __frame + Math.round(bounds.stop * __config.frameRate); frame++) {
                    addCallback(frame, elementID, 'callback', config.onFrame);
                }
            }

            if (typeof config.onStop === 'function') {
                addCallback(__frame + (Math.round(bounds.stop * __config.frameRate)), elementID, 'callback', config.onStop);
            }
        };

        var makeFrame = function (offset, elementID, type, value, units, callback, skip) {

            /// Wow this is long winded.. but we need to check for existing frames, properties and elements. IT COULD be abstracted out into smaller methods but that would have a performance hit
            if (elementID !== undefined) {

                if (__timeline[offset] === undefined) {

                    __timeline[offset] = {};
                    __timeline[offset][elementID] = {};
                    __timeline[offset][elementID][type] = {
                        value: value,
                        units: units,
                        callback: [],
                        skip: skip
                    };

                } else if (__timeline[offset][elementID] === undefined) {

                    __timeline[offset][elementID] = {};
                    __timeline[offset][elementID][type] = {
                        value: value,
                        units: units,
                        callback: [],
                        skip: skip
                    };

                } else if (__timeline[offset][elementID][type] === undefined) {

                    __timeline[offset][elementID][type] = {
                        value: value,
                        units: units,
                        callback: [],
                        skip: skip
                    };

                } else {

                    if (value !== false) {
                        __timeline[offset][elementID][type].value = value;
                    }

                    if (units !== false) {
                        __timeline[offset][elementID][type].units = units;
                    }

                    __timeline[offset][elementID][type].skip = skip;

                }

                if (typeof callback === 'function') {
                    __timeline[offset][elementID][type].callback.push(callback);
                }

            } else if (__timeline[offset] === undefined) {
                __timeline[offset] = {};
            }

        };

        var addCallback = function (offset, elementID, type, callback) {
            makeFrame(offset, elementID, type, false, false, callback, true);
        };

        var play = function ( callback ) {

            if (__playing === false) {
                __frameTime = false;
                __playing = true;
                __playTime = timestamp();
                __playCallback = callback;
                playHead();
            }
        };

        var clear = function (element, property) {

            var time;

            if( element !== undefined && property !== undefined && element.__animate !== undefined ) {

                for (time in __timeline) {
                    if (__timeline.hasOwnProperty(time) && __timeline[time][element.__animate.id] !== undefined && __timeline[time][element.__animate.id][property] !== undefined) {
                        delete __timeline[time][element.__animate.id][property];
                    }
                }

            } else if( element !== undefined && element.__animate !== undefined ) {

                for (time in __timeline) {
                    if (__timeline.hasOwnProperty(time) && __timeline[time][element.__animate.id] !== undefined) {
                        delete __timeline[time][element.__animate.id];
                    }
                }

            } else {

                for (time in __timeline) {
                    if (__timeline.hasOwnProperty(time)) {
                        delete __timeline[time];
                    }
                }
            }
        };

        var timestamp = function () {
            var now = new Date();
            return now.getTime();
        };

        var playHead = function () {

            var current, elementID, type, delay;

            if (__frame <= __runTime ) {

                delay = (__config.frameDelay - ((timestamp() - __playTime) - ( __frame * __config.frameDelay)));
                if (delay < 0) {
                    delay = 0;
                } else if (delay > __config.frameDelay) {
                    delay = __config.frameDelay;
                }

                setTimeout(function () {
                    playHead(delay ? true : false);
                }, delay);

                for (elementID in __timeline[__frame]) {

                    if (__timeline[__frame].hasOwnProperty(elementID)) {

                        current = __timeline[__frame][elementID];

                        for (type in current) {
                            if (current.hasOwnProperty(type)) {
                                action(elementID, type, current[type].value, current[type].units, current[type].callback, ( current[type].skip === true ? true : ( delay ? true : false ) ) );
                            }
                        }
                    }
                }

                delete __timeline[__frame];
                __frame++;
                __frameTime = timestamp();

            } else {
                __frameTime = __playing = false;
                __frame = 0;

                if( typeof __playCallback === 'function' ) {
                    __playCallback();
                    __playCallback = false;
                }
            }
        };

        var action = function (elementID, type, value, units, callback, updateDOM ) {

            // Always render the last frame / property for this element
            var prop = __elements[elementID].__animate.state[type];

            if (updateDOM === true && value !== false && ( prop === undefined || ( prop.value != value ||prop.units != units ) ) ) {

                // Again.. the switch of the century.. I don't like this pattern but the altenative is even nastier
                switch (type) {

                case "zIndex":
                    __elements[elementID].style.zIndex = value;
                    break;

                case "alpha":
                case "transparency":
                case "opacity":
                    opacity(__elements[elementID], value);
                    break;

                case "scroll":
                case "scrollTop":
                case "scrollLeft":
                case 'scrollTo':
                    scroll(__elements[elementID], type, value);
                    break;

                case 'shadow':
                case 'boxShadow':
                    shadow(__elements[elementID], value);
                    break;

                case 'rotate':
                    rotate(__elements[elementID], value);
                    break;

                case 'transformOrigin':
                    transformOrigin(__elements[elementID], value);
                    break;

                case 'transform':
                    transform(__elements[elementID], value);
                    break;

                case 'backgroundSize':
                    backgroundSize(__elements[elementID], value);
                    break;

                case 'borderRadius':
                    borderRadius(__elements[elementID], value, units);
                    break;

                case 'borderRadiusTopRight':
                    borderRadiusCorner(__elements[elementID], 'top', 'right', value, units);
                    break;

                case 'borderRadiusTopLeft':
                    borderRadiusCorner(__elements[elementID], 'top', 'left', value, units);
                    break;

                case 'borderRadiusBottomRight':
                    borderRadiusCorner(__elements[elementID], 'bottom', 'right', value, units);
                    break;

                case 'borderRadiusBottomLeft':
                    borderRadiusCorner(__elements[elementID], 'bottom', 'left', value, units);
                    break;

                default:
                    if (typeof value === 'string') {
                        __elements[elementID].style[type] = value;
                    } else {
                        __elements[elementID].style[type] = value + units;
                    }
                    break;
                }
            }

            __elements[elementID].__animate.state[type] = {
                value: value,
                units: units
            };

            if (callback !== undefined && callback.length > 0) {
                for (i = 0; i < callback.length; i++) {
                    if (typeof callback[i] === 'function') {
                        callback[i](__elements[elementID], {
                            type: type,
                            value: value,
                            units: units,
                            id: elementID
                        });
                    }
                }
            }
        };

        var scroll = function (element, property, value) {

            var parsedValue;

            if (element.tagName === undefined && ( typeof element.scroll === 'function' || typeof element.scrollTo === 'function' ) && typeof value === 'string') {

                parsedValue = value.match(__value);

                if (parsedValue) {
                    if (self.pageYOffset) {
                        window.scroll(parseInt(parsedValue[0], 10), parseInt(parsedValue[1], 10));
                    } else if (document.documentElement && document.documentElement.scrollTop) {
                        window.scrollTo(parseInt(parsedValue[0], 10), parseInt(parsedValue[1], 10));
                    } else if (document.body) {
                        window.scrollTo(parseInt(parsedValue[0], 10), parseInt(parsedValue[1], 10));
                    }
                }

            } else {

                if (typeof value === 'string') {
                    parsedValue = value.match(__value);
                } else {
                    parsedValue = [value, value];
                }

                if (property === 'scrollTop') {

                    element.scrollTop = parseInt(parsedValue[1], 10);

                } else if (property === 'scrollLeft') {

                    element.scrollLeft = parseInt(parsedValue[0], 10);

                } else {

                    element.scrollLeft = parseInt(parsedValue[0], 10);
                    element.scrollTop = parseInt(parsedValue[1], 10);
                }
            }
        };

        var setProperty = function( element, prop, value, units ) {
            element.style[prop] = value + ( units ? units : '');
        };

        var opacity = function (element, value) {
            if( __cssSuportLookup.opacity === 'filter' ) {
                setProperty(element, 'filter', 'alpha(opacity=' + value + ')');
            } else {
                setProperty(element, __cssSuportLookup.opacity,  (value / 100) );
            }
        };

        var shadow = function (element, value) {
            setProperty(element, __cssSuportLookup.shadow, value);
        };

        var rotate = function (element, value) {
            setProperty(element, __cssSuportLookup.transform, 'rotate(' + value + 'deg)');
        };

        var transform = function (element, value) {
            setProperty(element, __cssSuportLookup.transform, value);
        };

        var backgroundSize = function (element, value) {
            setProperty(element, __cssSuportLookup.backgroundSize, value);
        };

        var transformOrigin = function (element, value) {
            setProperty(element, __cssSuportLookup.transformOrigin, value);
        };

        var borderRadius = function (element, value, units) {
            setProperty(element, __cssSuportLookup.borderRadius, value, units);
        };

        var borderRadiusCorner = function (element, upDown, leftRight, value, units) {

            if( upDown === 'top' ) {

                if( leftRight === 'left' ) {
                    setProperty(element, __cssSuportLookup.borderRadiusTopLeft, value, units);
                } else {
                    setProperty(element, __cssSuportLookup.borderRadiusTopRight, value, units);
                }

            } else {

                if( leftRight === 'left' ) {
                    setProperty(element, __cssSuportLookup.borderRadiusBottomLeft, value, units);
                } else {
                    setProperty(element, __cssSuportLookup.borderRadiusBottomRight, value, units);
                }
            }
        };

        var register = function (element) {

            if (element.__animate === undefined) {

                var elementID = __elements.length;

                element.__animate = {
                    id: elementID,
                    state: {},
                    callback: {},
                    dragging: false
                };

                __elements.push(element);
                return elementID;

            } else {
                return element.__animate.id;
            }
        };

        var effects = {
            linear: function (t, b, c, d) {
                return c * t / d + b;
            },
            quadIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            quadOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            quadInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }

                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },
            cubicIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            cubicOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            cubicInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t + b;
                }

                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },

            // Copy of cubic
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t + b;
                }

                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },
            // End copy
            quartIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            quartOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            quartInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }

                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            quintIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            quintOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            quintInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t * t + b;
                }

                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },
            sineIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            sineOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            sineInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },
            expoIn: function (t, b, c, d) {
                return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            expoOut: function (t, b, c, d) {
                return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            expoInOut: function (t, b, c, d) {
                if (t === 0) { return b; }
                if (t === d) { return b + c; }
                if ((t /= d / 2) < 1) {
                    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                }

                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            circIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            circOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            circInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }

                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },
            bounceIn: function (t, b, c, d) {
                return c - effects.bounceOut(d - t, 0, c, d) + b;
            },
            bounceOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else

                if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                } else

                if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
                }
            },
            bounceInOut: function (t, b, c, d) {
                if (t < d / 2) {
                    return effects.bounceIn(t * 2, 0, c, d) * 0.5 + b;
                }

                return effects.bounceOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            },
            elasticIn: function (t, b, c, d, a, p) {
                if (t === 0) { return b; }

                if ((t /= d) === 1) {
                    return b + c;
                }

                if (!p) {
                    p = d * 0.3;
                }

                if (!a) {
                    a = 1;
                }
                var s = 0;

                if (a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }

                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            elasticOut: function (t, b, c, d, a, p) {
                if (t === 0) {
                    return b;
                }

                if ((t /= d) === 1) {
                    return b + c;
                }

                if (!p) {
                    p = d * 0.3;
                }

                if (!a) {
                    a = 1;
                }
                var s = 0;

                if (a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }

                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            elasticInOut: function (t, b, c, d, a, p) {
                if (t === 0) {
                    return b;
                }

                if ((t /= d / 2) === 2) {
                    return b + c;
                }

                if (!p) {
                    p = d * (0.3 * 1.5);
                }

                if (!a) {
                    a = 1;
                }
                var s = 0;

                if (a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }

                if (t < 1) {

                    return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                }

                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
            }
        };

    that.tween = tween;
    that.action = action;
    that.register = register;
    that.shadow = shadow;
    that.opacity = opacity;
    that.borderRadius = borderRadius;
    that.borderRadiusCorner = borderRadiusCorner;
    that.backgroundSize = backgroundSize;
    that.transformOrigin = transformOrigin;
    that.rotate = rotate;
    that.transform = transform;
    that.clear = clear;
    that.play = play;
    that.property = getProperty;
    that.getScroll = getScroll;
    that.scroll = scroll;
    that.framerate = framerate;

    init();

    return that;

}( window.jQuery, window.PhotoMosaic.Plugins.JSTween||{} ));
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

        logGalleryData: function (gallery) {
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
        },
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
                    width : parseInt( $image.attr('width') ) || null,
                    height : parseInt( $image.attr('height') ) || null
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

    PhotoMosaic.Loader = function (images, mosaic) {
        self = this;

        this.images = images;
        this.mosaic = mosaic;
        this.opts = mosaic.opts;

        if (this.opts.lazyload === false) {
            this.skipLazyload();
        } else {
            this.trigger_point = $.waypoints('viewportHeight') + this.opts.lazyload;
            this.lazyload();
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

        handler : function (direction) {
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
                if ( self.opts.loading_transition === 'none' || PhotoMosaic.Plugins.Modernizr.csstransitions ) {
                    $(image.img).parents('span.loading, a.loading').removeClass('loading');
                } else {
                    $(image.img).animate(
                        { 'opacity' : '1' },
                        self.opts.responsive_transition_settings.duration * 1000,
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

                if ($loading.length == 0) {
                    $mosaic.removeClass('loading');
                }
            }, 0);
        }
    };
}(window.jQuery));
/*
    PhotoMosaic
    requires: jQuery 1.7+, JSTween 1.1, Mustache, Modernizr, & ImagesLoaded
    optional: prettyPhoto
*/
(function ($) {
    var pluginName = 'photoMosaic';
    var self;

    var Plugin = function (el, options, i) {
        self = this;

        this.el = el;
        this.obj = $(el);
        this._options = options;

        this._id = PhotoMosaic.Utils.makeID(true);

        this.init();
    };

    Plugin.prototype = {
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
            responsive_transition : true,
            responsive_transition_settings : {
                time: 0,
                duration: 0.3,
                effect: 'easeOut'
            },
            modal_name : null,
            modal_group : true,
            modal_ready_callback : null,
            lazyload : 0, // int || false
            log_gallery_data : false
            // random : false (deprecated: v2.2)
            // force_order : false (deprecated: v2.2)
            // auto_columns : false (deprecated: v2.2)
        },

        template: ' ' +
            '<div id="photoMosaic_{{id}}" class="photoMosaic loading {{clazz}}" style="width:{{width}}px; height:{{height}}px; {{#center}}margin-left:auto; margin-right:auto;{{/center}}">' +
                '{{#images}}' +
                    '{{#link}}' +
                        '<a class="photomosaic-item loading" href="{{path}}" {{#external}}target="_blank"{{/external}}' +
                            ' {{#modal}}rel="{{modal}}"{{/modal}}' +
                            ' {{#caption}}title="{{caption}}"{{/caption}}' +
                            'style="' +
                                ' width:{{#width}}{{constraint}}{{/width}}px;' +
                                ' height:{{#height}}{{constraint}}{{/height}}px;' +
                                ' position:absolute; {{#position}}top:{{top}}px; left:{{left}}px;{{/position}}' +
                            '"' +
                        '>' +
                    '{{/link}}' +
                    '{{^link}}' +
                        '<span class="photomosaic-item loading"' +
                            'style="' +
                                ' width:{{#width}}{{constraint}}{{/width}}px;' +
                                ' height:{{#height}}{{constraint}}{{/height}}px;' +
                                ' position:absolute; {{#position}}top:{{top}}px; left:{{left}}px;{{/position}}' +
                            '"' +
                        '>' +
                    '{{/link}}' +
                        '<img id="{{id}}" data-src="{{src}}" style="' +
                            'width:{{#width}}{{adjusted}}{{/width}}px; ' +
                            'height:{{#height}}{{adjusted}}{{/height}}px; ' +
                            '{{#adjustment}}{{type}}:-{{value}}px;{{/adjustment}}" ' +
                            'title="{{caption}}"' +
                            'alt="{{alt}}"/>' +
                    '{{#link}}</a>{{/link}}' +
                    '{{^link}}</span>{{/link}}' +
                '{{/images}}' +
            '</div>',

        loading_template: ' ' +
            '<div id="photoMosaic_{{id}}" class="photoMosaic">' +
                '<div class="photoMosaicLoading">loading gallery...</div>' +
            '</div>',

        init: function () {
            var self = this;

            this.opts = $.extend({}, this._defaults, this._options);
            this.opts = this.adjustDeprecatedOptions(this.opts);
            this._options = $.extend(true, {}, this.opts); // jQuery deep copy

            this.preload = 'PM_preloadify' + this._id;

            if (this.opts.width === 'auto') {
                this.opts.width = this.obj.width();
            }

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
                this.obj.html(PhotoMosaic.Plugins.Mustache.to_html(this.loading_template, {
                    id: this._id
                }));
            }

            // if all items have defined w/h we don't need to
            // wait for them to load to do the mosaic math
            if (this.hasDims()) {
                this.opts.gallery = this.prepData(this.opts.gallery);
                this.render();
            } else {
                $.when(this.preloadify()).then(function () {
                    self.opts.gallery = self.prepData(self.opts.gallery, true);
                    self.render();
                });
            }
        },

        render: function () {
            var self = this;
            var $images = null;

            // var view_model = new PhotoMosaic.Layouts.columns(this.opts.gallery, this.opts);
            // var html = PhotoMosaic.Plugins.Mustache.to_html(this.template, view_model);
            // this.obj.html( html );
            this.obj.html(this.makeMosaic());

            $images = this.obj.find('img');

            if ( self.opts.loading_transition !== 'none' && !PhotoMosaic.Plugins.Modernizr.csstransitions ) {
                $images.css('opacity','0');
            }

            setTimeout(function(){;
                self.loader = new PhotoMosaic.Loader($images, self);
            },0);

            this.bindEvents();

            this.modalCallback();

            if (this.opts.log_gallery_data) {
                PhotoMosaic.Utils.logGalleryData(this.opts.gallery);
            }
        },

        makeMosaic: function () {
            var self = this;

            this.images = [];
            this.columns = [];
            this.opts.columns = this.autoCols();
            this.col_width = Math.floor((this.opts.width - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns);

            $.each(this.opts.gallery, function (i) {
                this.width.adjusted = self.col_width;
                this.height.adjusted = Math.floor((this.height.original * this.width.adjusted) / this.width.original);

                self.images.push(this);
            });

            // ERROR CHECK: remove any images that didn't 404 but failed to load
            // TODO : make less Layout::columns -centric
            this.images = PhotoMosaic.ErrorChecks.imageDimensions(this.images);
            if (this.images.length === 0) {
                return PhotoMosaic.Plugins.Mustache.to_html('', {});
            }

            var json = this.makeMosaicView();

            // ERROR CHECK: don't load if the layout is broken
            // TODO : make less Layout::columns -centric
            if (PhotoMosaic.ErrorChecks.layout(json)) {
                return PhotoMosaic.Plugins.Mustache.to_html('', {});
            }

            return PhotoMosaic.Plugins.Mustache.to_html(this.template, json);
        },

        makeMosaicView: function (isRefreshing) {
            /*
                Images are already in order.

                Deal into columns
                 - order == random --> randomize => rows
                 - order == rows --> rows
                 - order == columns --> rows => columns
                 - order == masonry --> masonry
            */
            if (this.opts.order === 'random' && !isRefreshing) {
                this.images.sort(function (a, b) {
                    return (0.5 - Math.random());
                });
            }

            this.columns = this.sortIntoRows(this.images);

            if (this.opts.order === 'columns') {
                this.columns = this.sortIntoColumns(this.columns, this.images);
            }

            if (this.opts.order === 'masonry') {
                this.columns = this.sortIntoMasonry(this.images);
            }

            // construct template object
            var json = {
                    id: this._id,
                    clazz: this.makeSpecialClasses(),
                    width: (this.col_width * this.columns.length) + (this.opts.padding * (this.columns.length - 1)),
                    center: this.opts.center,
                    columns:[]
                };

            // get column heights (img height adjusted for col width)
            var col_heights = [];

            for (var i = 0; i < this.columns.length; i++) {
                var col_height = 0;

                for (var j = 0; j < this.columns[i].length; j++) {
                    col_height += this.columns[i][j].height.adjusted;
                }

                col_height += (this.columns[i].length - 1) * this.opts.padding;
                col_heights.push(col_height);

                json.columns[i] = {};
                json.columns[i].images = this.columns[i];
                json.columns[i].height = col_height;
                json.columns[i].padding = this.opts.padding;
            }

            // normalize column heights
            var shortest_col = Math.min.apply( Math, col_heights );
                var tallest_col = Math.max.apply( Math, col_heights );
                var average_col_height = Math.ceil((shortest_col + tallest_col) / 2);

            if (this.opts.height === 'auto') {
                json = this.adjustHeights(json, average_col_height);
            } else {
                json = this.adjustHeights(json, this.opts.height);
            }

            // create position information for each image
            for (var i = 0; i < json.columns.length; i++) {
                var col_height = 0;

                for (var j = 0; j < json.columns[i].images.length; j++) {
                    json.columns[i].images[j].position = {
                        top : col_height,
                        left : (i * this.col_width) + (i * this.opts.padding)
                    };

                    col_height = col_height + json.columns[i].images[j].height.constraint + this.opts.padding;
                };
            };

            // lightboxes index by node order and we add nodes by columns
            // leading to a mismatch between read order and lightbox-gallery-step-through order
            json.images = this.unpackColumns(json.columns);

            // double check that we're using the best image
            var size = null;

            for (var i = 0; i < json.images.length; i++) {
                size = this.pickImageSize(json.images[i]);
                if (size) {
                    json.images[i].src = json.images[i].sizes[size.name];
                }
            };

            return json;
        },

        autoCols: function (){
            if (!this._auto_cols && this.opts.columns !== 'auto') {
                this._auto_cols = false;
                return this.opts.columns;
            }

            this._auto_cols = true;

            var max_width = this.opts.width;
            var num_images = this.opts.gallery.length;
            var maths = {
                plus : 425, // (300 + (150 / 1.2))
                minus : 175 // (300 - (150 / 1.2))
            };
            var cols = (max_width < maths.plus) ? 1 : Math.floor(max_width / maths.minus);

            if (num_images < cols) {
                cols = num_images;
            }

            return cols;
        },

        sortIntoRows: function (imgs) {
            var images = $.extend(true, [], imgs); // jQuery deep copy || imgs.slice()
            var col = 0;
            var columns = [];

            for (var i = 0; i < images.length; i++) {
                col = i % this.opts.columns;

                if (!columns[col]) {
                    columns[col] = [];
                }

                columns[col].push(images[i]);
            }

            return columns;
        },

        sortIntoColumns: function (columns, imgs) {
            var images = $.extend(true, [], imgs); // jQuery deep copy || imgs.slice()
            var forced_cols = [];

            for (var i = 0; i < columns.length; i++) {
                for (var j = 0; j < columns[i].length; j++) {
                    if (!forced_cols[i]) {
                        forced_cols[i] = [];
                    }
                    forced_cols[i].push(images[0]);
                    images.shift();
                }
            }

            return forced_cols;
        },

        sortIntoMasonry: function (imgs) {
            var images = $.extend(true, [], imgs); // jQuery deep copy || imgs.slice()
            var col_heights = [];
            var col = 0;
            var columns = [];

            // construct column-height memory obj
            for (var i = 0; i < this.opts.columns; i++) {
                col_heights[i] = 0;
                columns.push([]);
            }

            for (var i = 0; i < images.length; i++) {
                col = $.inArray( Math.min.apply( Math, col_heights ), col_heights );
                columns[col].push(images[i]);
                col_heights[col] = col_heights[col] + images[i].height.adjusted;
            }

            return columns;
        },

        unpackColumns: function (columns) {
            var image;
            var images = [];

            for (var i = 0; i < this.images.length; i++) {
                image = PhotoMosaic.Utils.deepSearch(columns, 'id', this.images[i].id);
                images.push(image);
            };

            return images;
        },

        adjustHeights: function (json, target_height) {
            var column_heights = [];
            var column = null;
            var adjusted_height = 0;

            json = this.markLastColumn(json);

            for (var i = 0; i < json.columns.length; i++) {
                column = json.columns[i];
                json = this.markLastImageInColumn(json, i);

                if (this.opts.prevent_crop) {
                    column = this.scaleColumn(column, column.height);
                } else {
                    column = this.scaleColumn(column, target_height);
                }

                column_heights.push(column.height);

                json.columns[i] = column;
            }

            if (this.opts.prevent_crop) {
                adjusted_height = Math.max.apply(Math, column_heights);
            } else {
                adjusted_height = Math.min.apply(Math, column_heights);
            }

            json.height = adjusted_height;

            if (!this.opts.prevent_crop) {
                json = this.flattenColumns(json, adjusted_height);
            }

            json = this.adjustImagesToConstraint(json);

            return json;
        },

        scaleColumn: function (col, height) {
            var count = col.images.length;
            var total_padding = (this.opts.padding * (count - 1));
            var column_start = col.height - total_padding;
            var column_end = height - total_padding;
            var image = null;
            var images_height = 0;
            var image_start = 0;
            var image_end = 0;
            var mod = 0;

            // image's already have width|height.adjusted set
            // they need width|height.constraint
            for (var i = 0; i < count; i++) {
                image = col.images[i];

                image_start = image.height.adjusted;
                image_end = Math.floor( column_end * ( Math.floor( (image_start / column_start) * 1000 ) / 1000 ) );
                images_height += image_end;

                if (this.opts.prevent_crop) {
                    image = this.setImageContraints(image, image.width.adjusted, image.height.adjusted);
                } else {
                    image = this.setImageContraints(image, this.col_width, image_end);
                }
            }

            col.height = images_height + total_padding;

            return col;
        },

        flattenColumns: function (json, height) {
            var column = null;
            var image = null;
            var diff = 0;
            var total_padding = null;
            var adjusted_height;

            for (var i = 0; i < json.columns.length; i++) {
                column = json.columns[i];
                image = column.images[column.images.length - 1];
                diff = Math.abs(column.height - height);
                total_padding = (this.opts.padding * (column.images.length - 1));

                if (diff > 0) {
                    if (column.height > height) {
                        adjusted_height = (image.height.constraint - diff);
                    } else {
                        adjusted_height = (image.height.constraint + diff);
                    }

                    image = this.setImageContraints(image, null, adjusted_height);
                }
            }

            return json;
        },

        setImageContraints: function (image, width, height) {
            image.width.constraint = width || image.width.constraint;
            image.height.constraint = height || image.height.constraint;
            return image;
        },

        adjustImagesToConstraint: function (json) {
            var column;
            var image;
            var test_height;

            for (var i = 0; i < json.columns.length; i++) {
                column = json.columns[i];

                for (var j = 0; j < column.images.length; j++) {
                    image = column.images[j];

                    // adjusted is still scaled to the column's width
                    if (image.height.adjusted > image.height.constraint) {
                        image.adjustment = {
                            type : 'top',
                            value : Math.floor((image.height.adjusted - image.height.constraint) / 2)
                        };
                    } else {
                        image.width.adjusted = Math.floor((image.width.adjusted * image.height.constraint) / image.height.adjusted);
                        image.height.adjusted = image.height.constraint;

                        image.adjustment = {
                            type : 'left',
                            value : Math.floor((image.width.adjusted - image.width.constraint) / 2)
                        };
                    }

                    column.images[j] = image;
                };

                json.columns[i] = column;
            };

            return json;
        },

        findSmallestImage: function (images) {
            var smallest_height = 0;
            var index_of_smallest = 0;

            for (var i = 0; i < images.length; i++) {
                if (smallest_height === 0) {
                    smallest_height = images[i].height.adjusted;
                } else if (images[i].height.adjusted < smallest_height) {
                    smallest_height = images[i].height.adjusted;
                    index_of_smallest = i;
                }
            }

            return { 
                height : smallest_height,
                index : index_of_smallest
            };
        },

        findLargestImage: function (images) {
            var largest_height = 0;
            var index_of_largest = 0;

            for (var i = 0; i < images.length; i++) {
                if (images[i].height.adjusted > largest_height) {
                    largest_height = images[i].height.adjusted;
                    index_of_largest = i;
                }
            }

            return { 
                height : largest_height,
                index : index_of_largest
            };
        },

        markLastColumn: function (json) {
            json.columns[json.columns.length - 1].last = true;
            return json;
        },

        markLastImageInColumn: function (json, i) {
            json.columns[i].images[json.columns[i].images.length - 1].last = true;
            return json;
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
                        modal_text = self.opts.modal_name + '[' + self._id + ']';
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
                gallery[i].id = PhotoMosaic.Utils.makeID(false, 'pm');
            };
            return gallery;
        },

        pickImageSize: function (image) {
            // currently only supported in PM4WP
            if (!this.opts.sizes || !image.sizes) {
                return null;
            }

            var size = null;
            var scaled = {
                width : 0,
                height : 0
            };

            for (var key in this.opts.sizes) {
                if (this.opts.sizes.hasOwnProperty(key)) {
                    // are we dealing with a portrait or landscape image?
                    if (image.width.original >= image.height.original) {
                        scaled.width = this.opts.sizes[key];
                        scaled.height = Math.floor((scaled.width * image.height.original) / image.width.original);
                    } else {
                        scaled.height = this.opts.sizes[key];
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

            return {
                name : size,
                px : this.opts.sizes[size]
            };
        },

        swapImage: function (image, size) {
            var self = this;
            var $img = this.obj.find('#' + image.id);
            var $a = $img.parent();
            var $new_img = $('<img/>')
                                .attr('src', image.sizes[size])
                                .attr('class', size)
                                .attr('style', $img.attr('style'))
                                .opacity(0);

            // the size classname + check is a hacky window.resize debounce
            if (
                $a.find('.' + size).length === 0 &&
                $a.find('img[src="' + image.sizes[size] + '"]').length === 0
            ) {
                $a.append($new_img);

                $new_img.imagesLoaded({
                    fail: function ($images, $proper, $broken) {
                        $images.remove();
                    },
                    done: function ($images) {
                        var sibs = $images.siblings();
                        var id = sibs.eq(0).attr('id');
                        $images.attr('id', id);
                        $images.opacity(100);
                        sibs.remove();
                        setTimeout(function () {
                            $images.removeClass();
                        }, 0);
                    }
                });
            }

            return image.sizes[size];
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

        getTransition: function () {
            var transition = 'none';

            if (PhotoMosaic.Plugins.Modernizr.csstransitions && PhotoMosaic.Plugins.Modernizr.csstransforms) {
                transition = this.opts.loading_transition
            }
            return 'transition-' + transition;
        },

        getAvia: function () {
            // Kriesi's Avia framework overwrites the 'left' prop on my links
            // 'noLightbox' prevents that shit from happening
            return (typeof window.avia_framework_globals !== 'undefined') ? 'noLightbox' : '';
        },

        makeSpecialClasses: function () {
            var classes = [
                this.getTransition(),
                this.getAvia()
            ];
            return classes.join(' ');
        },

        bindEvents: function () {
            var self = this;

            $(window).unbind('resize.photoMosaic' + this._id).bind('resize.photoMosaic' + this._id, function () {
                self.refresh();
            });
        },

        refresh: function () {
            var self = this;
            var image = null;
            var $img = null;
            var $a = null;
            var json = null;
            var size = null;

            this.obj.addClass('resizing');

            // get the container width
            this.opts.width = (this._options.width !== 'auto') ? this.opts.width : this.obj.width();

            // get new column count & math
            this.opts.columns = this.autoCols();
            this.col_width = Math.floor((this.opts.width - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns);

            for (var i = 0; i < this.images.length; i++) {
                image = this.images[i];

                image.width.adjusted = this.col_width;
                image.height.adjusted = Math.floor((image.height.original * image.width.adjusted) / image.width.original);

                size = this.pickImageSize(image);

                if (size) {
                    for (key in image.sizes) {
                        if (image.sizes.hasOwnProperty(key)) {
                            if (image.sizes[key] === image.src) {
                                // we get a new image if we need a bigger image
                                if (size.px > this.opts.sizes[key]) {
                                    image.src = this.swapImage(image, size.name);
                                }
                            }
                        }
                    };
                }

                this.images[i] = image;
            };

            if (size) {
                this._size = size;
            }

            var json = this.makeMosaicView(true);

            this.obj.children().css({
                width: json.width,
                height: json.height
            });

            for (var i = 0; i < json.images.length; i++) {
                image = json.images[i];
                $img = this.obj.find('#' + image.id).parent().find('img');
                $a = $img.parent();

                $img.css({
                    width : image.width.adjusted + 'px',
                    height : image.height.adjusted + 'px',
                    top : '0px',
                    left : '0px'
                });

                $img.css(image.adjustment.type, (image.adjustment.value * -1) + 'px');

                $a.css({
                    width : image.width.constraint + 'px',
                    height : image.height.constraint + 'px'
                });

                if ( !this.shouldAnimate() || !PhotoMosaic.Plugins.Modernizr.csstransitions ) {
                    $a.css({
                        top : image.position.top + 'px',
                        left : image.position.left + 'px'
                    });
                } else {
                    $a.tween({
                        top: $.extend({}, this.opts.responsive_transition_settings, {
                            stop: image.position.top
                        }),
                        left: $.extend({}, this.opts.responsive_transition_settings, {
                            stop: image.position.left
                        })
                    });
                }
            }

            if (this.shouldAnimate()) {
                $.play();
            }

            setTimeout(function () {
                self.obj.removeClass('resizing');
            }, 0);
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

            return opts;
        },

        shouldAnimate: function () {
            return (
                this._auto_cols &&
                this.opts.responsive_transition
            );
        },

        _name : pluginName,

        version : PhotoMosaic.version

    };


    $.fn[pluginName] = function (options) {
        options = options || {};
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Plugin(this, options));

                // for debugging
                window.PhotoMosaic.$ = $;
                window.PhotoMosaic.Mosaics.push({
                    'el' : this,
                    'opts' : options
                });
            }
        });
    };

}(window.jQuery));
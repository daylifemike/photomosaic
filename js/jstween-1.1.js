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

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
	Edited by Michael Kafka (makfak) - hardcoded jQuery references changed to 'JQPM'
*/

var JSTween = ( function ( that ) {
 
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
			
			// Fail nicely if JQPM does not exist
			try{ attach();	} catch(e){ return; }		
		};
		
		var attach = function() {
		
			var fn = JQPM.fn;

			JQPM.JSTween = that;
						
			fn.tween = function (options) {
						
				var i, length = this.length;
			
				for( i = 0; i < length; i++ ) {
					tween(this[i], options);
				}
			
				return this;
			};
			
			JQPM.framerate = function (options) {
				framerate(options);
			};
			
			JQPM.play = function ( callback ) {
				play( callback );
			};
			
			JQPM.clear = function ( elem, prop ) {
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
					
						elementID = JQPM.JSTween.register(this[i]);
					
						for( prop in parsedType ) {
												
							if( parsedType.hasOwnProperty( prop ) ) {
							
								JQPM.JSTween.action( elementID, prop, parsedType[prop].value,  parsedType[prop].units, undefined, true);
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
	
}( JSTween || {} ) );
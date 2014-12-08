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

        pickImageSize : function (images, sizes) {
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

        // setImageConstraint : function (images, layout, sizing) {
        //     var prefix = "photomosaic-constrain-";
        //     var image = null;
        //     var container_is_larger = null;
        //     var sizing = sizing || 'cover';

        //     function constrainWhichDimension (container_is_larger) {
        //         var dim = "width";
        //         if ((container_is_larger && (sizing === 'contain')) ||
        //             (!container_is_larger && (sizing === 'cover'))) {
        //             dim = "height";
        //         }
        //         return dim;
        //     }

        //     for (var i = 0; i < images.length; i++) {
        //         image = images[i];
        //         container_is_larger = (image.width.container / image.height.container) > (image.width.original / image.height.original);

        //         image.constraint = prefix + constrainWhichDimension(container_is_larger);
        //     }

        //     images[i] = image;

        //     return images;
        // },

        decodeHTML : function (str) {
            var e = document.createElement('div');
            e.innerHTML = str;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
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
}(window.JQPM));
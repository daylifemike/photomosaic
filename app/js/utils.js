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
                if (window.console !== 'undefined') {
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
}(window.JQPM));
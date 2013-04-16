/* 
 *  PhotoMosaic v2.3 starts around line ~#70
 */

(function (window) {
    if (!window.PhotoMosaic) {
        window.PhotoMosaic = {};
    }
}(window));

/*
    mustache.js — Logic-less templates in JavaScript
    See http://mustache.github.com/ for more info.
*/
(function(window){

if (!window.PhotoMosaic) {
    window.PhotoMosaic = {};
}

window.PhotoMosaic.Mustache = function(){var Renderer=function(){};Renderer.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":true},context:{},render:function(template,context,partials,in_recursion){if(!in_recursion){this.context=context;this.buffer=[];}
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

/*
    Modernizr 2.6.2 (Custom Build) | MIT & BSD
    Build: http://modernizr.com/download/#-csstransforms-csstransitions-testprop-testallprops-domprefixes
*/
(function(window){
if (!window.PhotoMosaic) {
    window.PhotoMosaic = {};
}
window.PhotoMosaic.Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!D("transform")},p.csstransitions=function(){return D("transition")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" PM_"+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" PM_js PM_"+s.join(" PM_"):""),e}(this,this.document);
}(window));

/*
    imagesLoaded.js — Because you can't do ".load()"" on cached images.
    See http://desandro.github.com/imagesloaded/ for more info.
*/
(function(c,n){var l="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(f){function m(){var b=c(i),a=c(h);d&&(h.length?d.reject(e,b,a):d.resolve(e));c.isFunction(f)&&f.call(g,e,b,a)}function j(b,a){b.src===l||-1!==c.inArray(b,k)||(k.push(b),a?h.push(b):i.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),o&&d.notifyWith(c(b),[a,e,c(i),c(h)]),e.length===k.length&&(setTimeout(m),e.unbind(".imagesLoaded")))}var g=this,d=c.isFunction(c.Deferred)?c.Deferred():
0,o=c.isFunction(d.notify),e=g.find("img").add(g.filter("img")),k=[],i=[],h=[];c.isPlainObject(f)&&c.each(f,function(b,a){if("callback"===b)f=a;else if(d)d[b](a)});e.length?e.bind("load.imagesLoaded error.imagesLoaded",function(b){j(b.target,"error"===b.type)}).each(function(b,a){var d=a.src,e=c.data(a,"imagesLoaded");if(e&&e.src===d)j(a,e.isBroken);else if(a.complete&&a.naturalWidth!==n)j(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=l,a.src=d}):m();return d?d.promise(g):
g}}(JQPM));


/*
    jQuery photoMosaic v2.3
    requires jQuery 1.7+, JSTween (included separately), Mustache, Modernizr, & ImagesLoaded (included above)
*/
(function ($) {
    // for debugging
    if (window.PhotoMosaic) {
        window.PhotoMosaic.$ = $;
        window.PhotoMosaic.mosaics = [];
    }

    var pluginName = 'photoMosaic';

    var Plugin = function (el, options, i) {
        this._name = pluginName;
        this.version = '2.3';
        this.el = el;
        this.obj = $(el);
        this._options = options;
        this._id = (Date.parse(new Date()) + Math.round(Math.random() * 10000));

        this.init();
    };

    $.extend(Plugin.prototype, {

        // IE sucks so hard
        log: {
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
                if (console !== 'undefined') {
                    console.log(msg);
                }
            }
        },

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
            log_gallery_data : false
            // random : false (deprecated: v2.2)
            // force_order : false (deprecated: v2.2)
            // auto_columns : false (deprecated: v2.2)
        },

        template: ' ' +
            '<div id="photoMosaic_{{id}}" class="photoMosaic loading {{transition}}" style="width:{{width}}px; height:{{height}}px; {{#center}}margin-left:auto; margin-right:auto;{{/center}}">' +
                '{{#columns}}' +
                    '{{#images}}' +
                        '{{#link}}' + 
                            '<a class="loading" href="{{path}}" {{#external}}target="_blank"{{/external}}' +
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
                            '<span class="loading"' +
                                'style="' +
                                    ' width:{{#width}}{{constraint}}{{/width}}px;' +
                                    ' height:{{#height}}{{constraint}}{{/height}}px;' +
                                    ' position:absolute; {{#position}}top:{{top}}px; left:{{left}}px;{{/position}}' +
                                '"' +
                            '>' +
                        '{{/link}}' +
                            '<img id="{{id}}" src="{{src}}" style="' +
                                'width:{{#width}}{{adjusted}}{{/width}}px; ' +
                                'height:{{#height}}{{adjusted}}{{/height}}px; ' +
                                '{{#adjustment}}{{type}}:-{{value}}px;{{/adjustment}}" ' +
                                'title="{{caption}}"/>' +
                        '{{#link}}</a>{{/link}}' +
                        '{{^link}}</span>{{/link}}' +
                    '{{/images}}' +
                '{{/columns}}' +
            '</div>',

        loading_template: ' ' +
                '<div id="photoMosaic_{{id}}" class="photoMosaic">' +
                    '<div class="photoMosaicLoading">loading gallery...</div>' +
                '</div>',

        init: function () {
            var self = this;

            this.opts = $.extend({}, this._defaults, this._options);
            this.opts = this.adjustDeprecatedOptions(this.opts);

            this.preload = 'PM_preloadify' + this._id;

            this.images = [];
            this.columns = [];

            if (this.opts.width === 'auto') {
                this.opts.width = this.obj.width();
            }

            // Error Checks
            if (this.opts.input === 'xml' && this.opts.gallery === '') {
                this.log.error("No XML file path specified.");
                return;
            }
            if (this.opts.input === 'xml' && this.opts.gallery === 'PMalbum') {
                this.log.error("No XML file path specified.");
                return;
            }
            if (this.opts.input === 'json' && this.opts.gallery === '') {
                this.log.error("No JSON object defined.");
                return;
            }
            if (this.opts.input === 'json' && this.opts.gallery.length === 0) {
                this.log.error("Specified gallery data is empty.");
                return;
            }
            if (this.opts.input === 'json' && this.opts.gallery === 'PMalbum') {
                if (PMalbum !== 'undefined') {
                    this.opts.gallery = PMalbum;
                } else {
                    this.log.error("The JSON object 'PMalbum' can not be found.");
                    return;
                }
            }
            if (this.opts.gallery.length - 1 < this.current_album) {
                this.log.error("'start_album' uses a 0-index (0 = the first album). No album was found at the specified index (" + this.current_album + ")");
                return;
            }
            if (this.opts.prevent_crop && this.opts.height !== 'auto') {
                this.log.info("Height must be set to 'auto' to Prevent Cropping. The value for height (" + this.opts.height + ") is being ignored so as to prevent cropping.");
                this.opts.height = "auto";
            }

            this.opts.gallery = this.getGalleryData();

            // loading message
            // must follow getGalleryData() for HTML input to work
            if (this.opts.show_loading) {
                this.obj.html(PhotoMosaic.Mustache.to_html(this.loading_template, {
                    id: this._id
                }));
            }

            this.opts.columns = this.autoCols();

            this.col_width = Math.floor((this.opts.width - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns);

            this._size = this.pickImageSize(this.opts.gallery);

            if (this._size) {
                for (var i = 0; i < this.opts.gallery.length; i++) {
                    this.opts.gallery[i].thumb = this.opts.gallery[i].sizes[this._size];
                };
            }

            // if all items have defined w/h we don't need to
            // wait for them to load to do the mosaic math
            if (this.hasDims()) {
                this.opts.gallery = this.prepData(this.opts.gallery);
                this.render();
            } else {
                $.when(this.preloadify()).then(function () {
                    self.opts.gallery = self.addPreloadData(self.opts.gallery);
                    self.render();
                });
            }
        },

        render: function () {
            var self = this;

            this.obj.html(this.makeMosaic());

            this.obj.imagesLoaded({
                progress: function (isBroken, $images, $proper, $broken) {
                    setTimeout(function () {
                        $($proper[$proper.length - 1]).parents('a').removeClass('loading');
                    }, 0);
                },
                always: function () {
                    setTimeout(function () {
                        self.obj.children('.photoMosaic').removeClass('loading');
                    }, 1000);
                }
            });

            this.bindEvents();

            this.modalCallback();

            if (this.opts.log_gallery_data) {
                this.logGalleryData();
            }
        },

        makeMosaic: function () {
            var self = this;

            // get image sizes, set modalhook, & get link paths
            $.each(this.opts.gallery, function (i) {
                var image = $.extend(true, {}, this); // jQuery deep copy
                var image_url = (image.thumb && image.thumb !== '') ? image.thumb : image.src;
                var modal_text;

                image.id = self.makeID();

                // image sizes
                image.full = image.src;
                image.src = image_url;
                image.padding = self.opts.padding;

                image.width.adjusted = self.col_width;
                image.height.adjusted = Math.floor((image.height.original * image.width.adjusted) / image.width.original);

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
                    image.caption = '';
                    image.external = self.opts.external_links;
                    // delete image.modal;
                } else if (self.opts.links) {
                    image.link = true;
                    image.path = image.full;
                    image.external = self.opts.external_links;
                } else {
                    image.link = false;
                }

                self.images.push(image);
            });

            // remove any images that failed to load
            this.images = this.errorCheck(this.images);

            var json = this.makeMosaicView();

            // ERROR CHECK: don't load if the layout is broken
            if (this.layoutHasErrors(json)) {
                this.log.error("Your gallery's height is too small for your current settings and won't render correctly.");
                return PhotoMosaic.Mustache.to_html('', {});
            }

            return PhotoMosaic.Mustache.to_html(this.template, json);
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
                    transition: this.getTransition(),
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
                // var tallest_col = Math.max.apply( Math, col_heights );
                // var average_col_height = Math.ceil((shortest_col + tallest_col) / 2);

            if (this.opts.height === 'auto') {
                json = this.adjustHeights(json, shortest_col);
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
            // this.opts.sizes only supported in PM4WP
            var sizes = {
                medium : this.opts.sizes.mediumz || 300,
                thumb : this.opts.sizes.thumbnailz || 150
            };
            var maths = {
                plus : (sizes.medium + (sizes.thumb / 1.5)),
                minus : (sizes.medium - (sizes.thumb / 1.2))
            };

            if (num_images < this.opts.columns) {
                cols = num_images;
            } else {
                cols = (max_width < maths.plus) ? 1 : Math.floor(max_width / maths.minus);
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

                image = this.setImageContraints(image, this.col_width, image_end);
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

        errorCheck: function (images) {
            var to_delete = [];

            $.each(images, function (i) {
                if (isNaN(this.height.adjusted)){
                    to_delete.push(i);
                }
            });

            for (var i = to_delete.length - 1; i >= 0; i--) {
                this.log.error("The following image failed to load and was skipped.\n" + images[to_delete[i]].src);
                var rest = images.slice( to_delete[i] + 1 );
                images.length = to_delete[i];
                images.push.apply(images, rest);
            }

            return images;
        },

        layoutHasErrors: function (json) {
            var hasErrors = false;

            for (var i = 0; i < json.columns.length; i++) {
                for (var j = 0; j < json.columns[i].images.length; j++) {
                    if (json.columns[i].images[j].height.constraint <= 0) {
                        hasErrors = true;
                    }
                };
            };

            return hasErrors;
        },

        preloadify: function () {
            var $images = $('<div>').attr({
                    'id': this.preload,
                    'class' : 'PM_preloadify'
                });

            $.each(this.opts.gallery, function (i) {
                var image_url = (this.thumb && this.thumb !== '') ? this.thumb : this.src;
                var $item = $('<img>').attr({src : image_url});
                $images.append($item);
            });

            $('body').append($images);

            return $images.imagesLoaded();
        },

        addPreloadData: function (gallery) {
            var $preload = $('#' + this.preload);

            $.each(gallery, function (i) {
                var image_url = (this.thumb && this.thumb !== '') ? this.thumb : this.src;
                var $img = $preload.find('img[src="'+ image_url +'"]');

                this.width = {
                    original: $img.width()
                };
                this.height = {
                    original: $img.height()
                };
            });

            return gallery;
        },

        prepData: function (gallery) {
            var mem = { w:0, h:0 };

            $.each(gallery, function (i) {
                mem.w = parseInt(this.width);
                mem.h = parseInt(this.height);

                this.width = {
                    original: mem.w
                };
                this.height = {
                    original: mem.h
                };
            });

            return gallery;
        },

        getGalleryData: function () {
            var self = this;
            var gallery;

            // construct the gallery
            if (this.opts.input === 'html') {
                gallery = this.constructGalleryFromHTML();

            } else if (this.opts.input === 'xml' ) {
                $.get(this.opts.gallery, function (data) {
                    if ($(data).find('photos').length > 0) {
                        gallery = $(data).find('photos');
                        gallery = self.constructGalleryFromXML(gallery);
                    } else {
                        this.log.error("The XML either couldn't be found or was malformed.");
                        return;
                    }
                });

            } else if (this.opts.input === 'json') {
                gallery = this.opts.gallery;
            }

            return gallery;
        },

        pickImageSize: function (gallery) {
            var size = null;

            // currently only supported in PM4WP
            if (!this.opts.sizes || !gallery[0].sizes) {
                return null;
            }

            for (key in this.opts.sizes) {
                if (!size && (this.opts.sizes[key] > this.col_width)) {
                    size = key;
                }
            };

            if (!size) {
                size = 'full';
            }

            return size;
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
                        $images.attr('id', id)
                        $images.opacity(100);
                        sibs.remove();
                        setTimeout(function () {
                            $images.removeClass();
                        }, 0);
                    }
                });
            }
        },

        constructGalleryFromHTML: function () {
            var gallery = [];
            var $images = this.obj.find('img');

            for (var i = 0; i < $images.length; i++) {
                var image = {};

                image.src = ($images.eq(i).parent('a').length > 0 && this.opts.links) ? $images.eq(i).parent('a').attr('href') : $images.eq(i).attr('src');
                image.caption = $images.eq(i).attr('title');

                gallery.push(image);
            }

            return gallery;
        },

        constructGalleryFromXML: function (gallery) {
            var response = [];

            gallery.find('photo').each(function (i) {
                var photo = {};
                var data = $(this);

                photo.caption = data.children('title').text();
                photo.src = data.children('src').text();
                photo.thumb = data.children('thumb').text();
                photo.url = data.children('url').text();
                photo.width = data.children('width').text();
                photo.height = data.children('height').text();

                response.push(photo);
            });

            return response;
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
                this.log.error("Width / Height data not present for all images.");
            }

            this.hasSpecifiedDims = all;

            return this.hasSpecifiedDims;
        },

        getTransition: function () {
            var transition = 'none';

            if (PhotoMosaic.Modernizr.csstransitions && PhotoMosaic.Modernizr.csstransforms) {
                transition = this.opts.loading_transition
            }
            return 'transition-' + transition;
        },

        bindEvents: function () {
            var self = this;

            $(window).unbind('resize.photoMosaic').bind('resize.photoMosaic', function () {
                self.refresh();
            });
        },

        refresh: function () {
            if (this._options.width !== 'auto') {
                return;
            }

            var self = this;
            var image = null;
            var $img = null;
            var $a = null;
            var json = null;
            var size = this.pickImageSize(this.images);


            this.obj.addClass('resizing');

            // get the container width
            this.opts.width = this.obj.width();

            // get new column count & math
            this.opts.columns = this.autoCols();
            this.col_width = Math.floor((this.opts.width - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns);

            for (var i = 0; i < this.images.length; i++) {
                image = this.images[i];

                image.width.adjusted = this.col_width;
                image.height.adjusted = Math.floor((image.height.original * image.width.adjusted) / image.width.original);

                if (size) {
                    // we get a new image if we need a bigger image
                    if (this.opts.sizes[size] > this.opts.sizes[this._size]) {
                        this.swapImage(image, size);
                    }
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

            for (var i = 0; i < json.columns.length; i++) {
                for (var j = 0; j < json.columns[i].images.length; j++) {
                    image = json.columns[i].images[j];
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
                        height : image.height.constraint + 'px',
                    });

                    if (!this.shouldAnimate()) {
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

        makeID: function () {
            var S4 = function () {
                return ( ( (1 + Math.random()) * 0x10000 ) | 0 ).toString(16).substring(1);
            };
            return 'pm_' + ( S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4() );
        },

        logGalleryData: function () {
            var response = [];
            for (var i = 0; i < this.opts.gallery.length; i++) {
                response.push({
                    src: this.opts.gallery[i].src,
                    thumb: this.opts.gallery[i].thumb,
                    caption: this.opts.gallery[i].caption,
                    width: this.opts.gallery[i].width.original,
                    height: this.opts.gallery[i].height.original
                });
            }
            this.log.info("Generate Gallery Data...");
            this.log.print( JSON.stringify(response) );
        },

        shouldAnimate: function () {
            return (
                this._auto_cols &&
                this.opts.responsive_transition
            );
        },

        __: function () { return this.version }

    });


    $.fn[pluginName] = function (options) {
        options = options || {};
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Plugin(this, options));

                // for debugging
                window.PhotoMosaic.mosaics.push({
                    'el' : this,
                    'opts' : options
                });
            }
        });
    };

}(JQPM));
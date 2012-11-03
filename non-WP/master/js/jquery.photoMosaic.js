/* 
 *  PhotoMosaic starts around line ~#60
 */

(function(window){window['PhotoMosaic']={};})(window);

/*
    mustache.js — Logic-less templates in JavaScript
    See http://mustache.github.com/ for more info.
*/
(function(window){var Mustache=function(){var Renderer=function(){};Renderer.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":true},context:{},render:function(template,context,partials,in_recursion){if(!in_recursion){this.context=context;this.buffer=[];}
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
window['PhotoMosaic'].Mustache=Mustache;
})(window);

/*
    Modernizr 2.6.2 (Custom Build) | MIT & BSD
    Build: http://modernizr.com/download/#-csstransforms-csstransitions-testprop-testallprops-domprefixes
*/
(function(window){
window['PhotoMosaic'].Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!D("transform")},p.csstransitions=function(){return D("transition")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" PM_"+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" PM_js PM_"+s.join(" PM_"):""),e}(this,this.document);
})(window);

/*
    imagesLoaded.js — Because you can't do ".load()"" on cached images.
    See http://desandro.github.com/imagesloaded/ for more info.
*/
(function(c,n){var l="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(f){function m(){var b=c(i),a=c(h);d&&(h.length?d.reject(e,b,a):d.resolve(e));c.isFunction(f)&&f.call(g,e,b,a)}function j(b,a){b.src===l||-1!==c.inArray(b,k)||(k.push(b),a?h.push(b):i.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),o&&d.notifyWith(c(b),[a,e,c(i),c(h)]),e.length===k.length&&(setTimeout(m),e.unbind(".imagesLoaded")))}var g=this,d=c.isFunction(c.Deferred)?c.Deferred():
0,o=c.isFunction(d.notify),e=g.find("img").add(g.filter("img")),k=[],i=[],h=[];c.isPlainObject(f)&&c.each(f,function(b,a){if("callback"===b)f=a;else if(d)d[b](a)});e.length?e.bind("load.imagesLoaded error.imagesLoaded",function(b){j(b.target,"error"===b.type)}).each(function(b,a){var d=a.src,e=c.data(a,"imagesLoaded");if(e&&e.src===d)j(a,e.isBroken);else if(a.complete&&a.naturalWidth!==n)j(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=l,a.src=d}):m();return d?d.promise(g):
g}})(jQuery);


/*
    jQuery photoMosaic v2
    requires jQuery 1.7+ (included separately), Mustache, Modernizr, & ImagesLoaded (included above)
*/

(function($) {

    if(typeof console === "undefined") {
        console = {
            log: function(msg) {
                console.errors.push(msg);
            },
            errors: []
        };
    }

    // for debugging
    if (window['PhotoMosaic']) {
        window['PhotoMosaic']['$'] = $;
        window['PhotoMosaic']['mosaics'] = [];
    }

    var photoMosaic = function() { };

    $.extend(photoMosaic.prototype, {

        init: function(el, options, i) {
            var defaults = {
                input : 'json', // json, html, xml
                gallery : 'PMalbum', // json object, xml file path
                padding : 2,
                columns : 3,
                width : 'auto', // auto (str) or (int) 
                height : 'auto', // auto (str) or (int)
                links : true,
                external_links: false,
                random : false,
                force_order : false,
                auto_columns : false,
                center : true,
                show_loading : false,
                loading_transition : 'fade', // none, fade, scale-up|down, slide-top|right|bottom|left, custom
                modal_name : null,
                modal_group : true,
                modal_ready_callback : null,
                log_gallery_data : false
            };
            
            this.opts = $.extend({}, defaults, options);
            this.obj = $(el);
            this.id = (Date.parse(new Date()) + Math.round(Math.random() * 10000));

            this.preload = 'PM_preloadify' + this.id;

            this.images = [];
            this.columns = [];
            
            if(this.opts.width === 'auto') {
                this.opts.width = this.obj.width();
            }

            this.template = ' ' +
                '<div id="photoMosaic_' + this.id + '" class="photoMosaic loading {{transition}}" style="width:{{width}}px; {{#center}}margin-left:auto; margin-right:auto;{{/center}}">' +
                    '{{#columns}}' +
                        '<ol style="float:left; margin:0 {{^last}}{{padding}}px 0 0{{/last}} !important;">' +
                            '{{#images}}' +
                                '<li class="loading" style="width:{{#width}}{{constraint}}{{/width}}px; height:{{#height}}{{constraint}}{{/height}}px; margin:0 {{^last}}0 {{padding}}px 0{{/last}} !important;">' +
                                    '{{#link}}<a href="{{path}}" {{#external}}target="_blank"{{/external}} {{#modal}}rel="{{modal}}"{{/modal}} {{#caption}}title="{{caption}}"{{/caption}}>{{/link}}' +
                                    '{{^link}}<span>{{/link}}' +
                                        '<img src="{{src}}" style="' +
                                                'width:{{#width}}{{adjusted}}{{/width}}px; ' +
                                                'height:{{#height}}{{adjusted}}{{/height}}px; ' +
                                                '{{#adjustment}}{{type}}:-{{value}}px;{{/adjustment}}" ' +
                                            'title="{{caption}}"/>' +
                                    '{{#link}}</a>{{/link}}' +
                                    '{{^link}}</span>{{/link}}' +
                                '</li>' +
                            '{{/images}}' +
                        '</ol>' +
                    '{{/columns}}' +
                '</div>';

            this.loading_template = ' ' +
                '<div id="photoMosaic_' + this.id + '" class="photoMosaic">' +
                    '<div class="photoMosaicLoading">loading gallery...</div>' +
                '</div>';

            // Error Checks
            if ( this.opts.input === 'xml' && this.opts.gallery === '' ) {
                console.log("PhotoMosaic: ERROR: No XML file path specified.");
                return;
            }
            if ( this.opts.input ==='xml' && this.opts.gallery === 'PMalbum' ) {
                console.log('PhotoMosaic: ERROR: No XML file path specified.');
                return;
            }
            if ( this.opts.input === 'json' && this.opts.gallery === '' ) {
                console.log("PhotoMosaic: ERROR: No JSON object defined.");
                return;
            }
            if ( this.opts.input === 'json' && this.opts.gallery.length === 0 ) {
                console.log("PhotoMosaic: ERROR: Specified gallery data is empty.");
                return;
            }
            if ( this.opts.input ==='json' && this.opts.gallery === 'PMalbum' ) {
                if ( typeof(PMalbum) !== 'undefined' ) {
                    this.opts.gallery = PMalbum;
                } else {
                    console.log('PhotoMosaic: ERROR: The JSON object "PMalbum" can not be found.');
                    return;
                }
            }
            if ( this.opts.gallery.length - 1 < this.current_album ) {
                console.log('PhotoMosaic: ERROR: "start_album" uses a 0-index (0 = the first album).'
                     + 'No album was found at the specified index ('+ this.current_album +')');
                return;
            }
            
            // loading message
            if ( this.opts.show_loading ) {
                this.obj.html( PhotoMosaic.Mustache.to_html(this.loading_template, {}) );
            }

            var self = this;

            this.opts.gallery = this.getGalleryData();

            this.opts.columns = this.autoCols();

            this.col_mod = (this.opts.width - (this.opts.padding * (this.opts.columns - 1))) % this.opts.columns;
            this.col_width = ((this.opts.width - this.col_mod) - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns;

            // if all items have defined w/h we don't need to
            // wait for them to load to do the mosaic math
            if (this.hasDims()) {
                this.opts.gallery = this.prepData(this.opts.gallery);
                this.render();
            } else {
                $.when(this.preloadify()).then(function() {
                    self.opts.gallery = self.addPreloadData(self.opts.gallery);
                    self.render();
                });
            }
        },

        render: function() {
            var self = this;

            this.obj.html( this.makeMosaic() );

            this.obj.imagesLoaded({
                progress: function (isBroken, $images, $proper, $broken) {
                    $($proper[$proper.length - 1]).parents('li').removeClass('loading');
                },
                always: function () {
                    setTimeout(function() {
                        self.obj.children('.photoMosaic').removeClass('loading');
                    }, 1000);
                }
            });

            this.modalCallback();

            if (this.opts.log_gallery_data) {
                this.logGalleryData();
            }
        },

        makeMosaic: function() {
            var self = this;

            // get image sizes, set modalhook, & get link paths
            $.each(this.opts.gallery, function(i) {
                var image = $.extend(true, {}, this); // jQuery deep copy
                var image_url = (image.thumb && image.thumb !== '') ? image.thumb : image.src;
                var modal_text;

                // image sizes
                image.full = image.src;
                image.src = image_url;
                image.padding = self.opts.padding;

                image.width.adjusted = self.col_width;
                image.height.adjusted = Math.floor((image.height.original * image.width.adjusted) / image.width.original);

                // modal hooks
                if (self.opts.modal_name) {
                    if (self.opts.modal_group) {
                        modal_text = self.opts.modal_name + '[' + self.id + ']';    
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
                    delete image.modal;
                } else if (self.opts.links) {
                    image.link = true;
                    image.path = image.full;
                    image.external = self.opts.external_links;
                } else {
                    image.link = false;
                }

                self.images.push(image);
            });

            // ERROR CHECK: remove any images that failed to load
            this.images = this.errorCheck(this.images);

            // alt sort images by height (tall, short, tall, short)
            if (!this.opts.force_order) {
                this.images.sort(function(a,b) {
                    if (self.opts.random) {
                        return (0.5 - Math.random());
                    } else {
                        return (a.height.original - b.height.original);
                    }
                });
                this.images.reverse();
            }
            
            var order = [];
            var bool = true;
            
            if (!this.opts.force_order) {
                while (this.images.length > 0) {
                    if (bool) {
                        order.push(this.images.shift());
                    } else {
                        order.push(this.images.pop());
                    }
                    bool = !bool;
                }
                this.images = order;
            }

            // deal into columns
            var current_col = 0;

            for (var i = 0; i < this.images.length; i++) {
                if (current_col === this.opts.columns) {
                    current_col = 0;
                }

                if (!this.columns[current_col]) {
                    this.columns[current_col] = [];
                }
                this.columns[current_col].push(this.images[i]);

                current_col++;
            }
            
            // unfortunate special-case "force order"
            if (this.opts.force_order) {
                var forced_cols = [];
                for (var i = 0; i < this.columns.length; i++) {
                    for (var j = 0; j < this.columns[i].length; j++) {
                        if (!forced_cols[i]) {
                            forced_cols[i] = [];
                        }
                        forced_cols[i].push(this.images[0]);
                        this.images.shift();
                    }
                }
                this.columns = forced_cols;
            }
            
            // construct template object &
            // get column heights (img height adjusted for col width)
            var json = {
                    transition: this.getTransition(),
                    width: this.opts.width,
                    center: this.opts.center,
                    columns:[]
                };
            var col_heights = [];
            
            for (var i = 0; i < this.columns.length; i++) {
                var col_height = 0;

                for (var j = 0; j < this.columns[i].length; j++) {
                    col_height = col_height + this.columns[i][j].height.adjusted;
                }
                col_height = col_height + (this.columns[i].length - 1) * this.opts.padding;
                col_heights.push(col_height);
                
                json.columns[i] = {};
                json.columns[i].images = this.columns[i];
                json.columns[i].height = col_height;
                json.columns[i].padding = this.opts.padding;
            }
            
            // normalize column heights
            var shortest_col = this.getSmallest(col_heights);
            var tallest_col = this.getBiggest(col_heights);
            var average_col_height = Math.floor((shortest_col + tallest_col) / 2);

            if (this.opts.height === 'auto') {
                json = this.adjustHeights(json, average_col_height);
            } else {
                json = this.adjustHeights(json, this.opts.height);
            }

            // ERROR CHECK: don't load if the layout is broken
            if (this.layoutHasErrors(json)) {
                console.log("PhotoMosaic: ERROR: Your gallery's height is too small for your current settings " +
                    "and won't render correctly.");
                return PhotoMosaic.Mustache.to_html('', {});
            }

            return PhotoMosaic.Mustache.to_html(this.template, json);
        },
        
        adjustHeights: function(json, target_height) {
            json = this.markLastColumn(json);
            
            for (i = 0; i < json.columns.length; i++) {
                json = this.markLastImageInColumn(json, i);
                    
                if(json.columns[i].height > target_height) {
                    json.columns[i] = this.scaleColumnDown(json.columns[i], target_height);
                } else {
                    json.columns[i] = this.scaleColumnUp(json.columns[i], target_height);
                }
            }
            
            return json;
        },
        
        autoCols: function(){
            var max_width = this.opts.width;
            var num_images = eval(this.opts.gallery).length;
            var cols = 0;
            var ratio = {w:4, h:3};
            var i = 0;

            if(this.opts.auto_columns) {
                while(cols === 0) {
                    if(num_images <= ((i + ratio.w) * (i + ratio.h))) {
                        cols = i + ratio.w;
                    } else {
                        ++i;
                    }
                }
                return cols;
            } else {
                return this.opts.columns;
            }
        },
        
        scaleColumnDown: function(col, height) {
            var count = col.images.length;
            var diff = col.height - height;
            var mod = diff % count;
            var divy = Math.floor(diff / count);
            var divy_mod = divy + mod;
            var offset = Math.floor(divy / 2);
            var offset_mod = Math.floor((divy + mod) / 2);
            var largest = this.findLargestImage(col.images);

            for (var i = 0; i < count; i++) {
                if(i === largest.index) {
                    col.images[i].height.constraint = col.images[i].height.adjusted - divy_mod;
                } else {
                    col.images[i].height.constraint = col.images[i].height.adjusted - divy;
                }
                col.images[i].width.constraint = col.images[i].width.adjusted;
                col.images[i].adjustment = {
                    type : 'top',
                    value : Math.floor((col.images[i].height.adjusted - col.images[i].height.constraint) / 2)
                };
            }
            
            return col;
        },
        
        scaleColumnUp: function(col, height) {
            var count = col.images.length;
            var diff = height - col.height;
            var mod = diff % count;
            var divy = Math.floor(diff / count);
            var divy_mod = divy + mod;
            var offset = Math.floor(divy / 2);
            var offset_mod = Math.floor((divy + mod) / 2);
            var smallest_image = this.findSmallestImage(col.images);
 
            for (var i = 0; i < count; i++) {
                if(i === smallest_image.index) {
                    col.images[i].height.constraint = col.images[i].height.adjusted + divy_mod;
                } else {
                    col.images[i].height.constraint = col.images[i].height.adjusted + divy;
                }
                col.images[i].width.constraint = col.images[i].width.adjusted;
                col.images[i].width.adjusted = Math.floor((col.images[i].width.adjusted * col.images[i].height.constraint) / col.images[i].height.adjusted);
                col.images[i].height.adjusted = col.images[i].height.constraint;

                col.images[i].adjustment = {
                    type : 'left',
                    value : Math.floor((col.images[i].width.adjusted - col.images[i].width.constraint) / 2)
                };
            }

            return col;
        },
        
        getSmallest: function(list) {
            var smallest = 0;
                
            for (var i = 0; i < list.length; i++) {
                if (smallest === 0) {
                    smallest = list[i];
                } else if (list[i] < smallest) {
                    smallest = list[i];    
                }
            }

            return smallest;
        },
        
        getBiggest: function(list) {
            var biggest = 0;

            for (var i = 0; i < list.length; i++) {
                if (list[i] > biggest) {
                    biggest = list[i];
                }
            }

            return biggest;
        },

        findSmallestImage: function(images) {
            var smallest_height = 0;
            var index_of_smallest = 0;
                
            for (var i = 0; i < images.length; i++) {
                if(smallest_height === 0) {
                    smallest_height = images[i].height.adjusted;
                } else if(images[i].height.adjusted < smallest_height) {
                    smallest_height = images[i].height.adjusted;
                    index_of_smallest = i;
                }
            }
            
            return { 
                height : smallest_height,
                index : index_of_smallest
            };
        },

        findLargestImage: function(images) {
            var largest_height = 0;
            var index_of_largest = 0;
                
            for (var i = 0; i < images.length; i++) {
                if(images[i].height.adjusted > largest_height) {
                    largest_height = images[i].height.adjusted;
                    index_of_largest = i;
                }
            }
            
            return { 
                height : largest_height,
                index : index_of_largest
            };
        },
        
        markLastColumn: function(json) {
            json.columns[json.columns.length - 1].last = true;
            return json;
        },
        
        markLastImageInColumn: function(json, i) {
            json.columns[i].images[json.columns[i].images.length - 1].last = true;
            return json;
        },
        
        errorCheck: function(images){
            var to_delete = [];

            $.each(images, function(i) {
                if(isNaN(this.height.adjusted)){
                    to_delete.push(i);
                }
            });

            for (var i = to_delete.length - 1; i >= 0; i--) {
                console.log('PhotoMosaic: ERROR: The following image failed to load and was skipped.\n' + images[to_delete[i]].src);
                var rest = images.slice( to_delete[i] + 1 );
                images.length = to_delete[i];
                images.push.apply(images, rest);
            }
            
            return images;
        },

        layoutHasErrors: function(json) {
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

        preloadify: function() {
            var $images = $('<div>').attr({
                    'id': this.preload,
                    'class' : 'PM_preloadify'
                });

            $.each(this.opts.gallery, function(i) {
                var image_url = (this.thumb && this.thumb !== '') ? this.thumb : this.src;
                var $item = $('<img>').attr({src : image_url});
                $images.append($item);
            });

            $('body').append($images);

            return $images.imagesLoaded();
        },

        addPreloadData: function(gallery) {
            var $preload = $('#' + this.preload);

            $.each(gallery, function(i) {
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

        prepData: function(gallery) {
            var mem = { w:0, h:0 };

            $.each(gallery, function(i) {
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

        getGalleryData: function() {
            var self = this;
            var gallery;

            // construct the gallery
            if ( this.opts.input === 'html' ) {
                gallery = this.constructGalleryFromHTML();

            } else if ( this.opts.input === 'xml' ){
                $.get(this.opts.gallery, function(data){
                    if ( $(data).find('photos').length > 0 ) {
                        gallery = $(data).find('photos');
                        gallery = self.constructGalleryFromXML(gallery);
                    } else {
                        console.log("PhotoMosaic: ERROR: The XML either couldn't be found or was malformed.");
                        return;
                    }
                });

            } else if ( this.opts.input === 'json' ) {
                gallery = this.opts.gallery;
            }

            return gallery;
        },

        constructGalleryFromHTML: function(){
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

        constructGalleryFromXML: function(gallery){
            var response = [];
            
            gallery.find('photo').each(function(i){
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

        hasDims: function() {
            var some = false; // set to true if any dims are found
            var all = true; // set to false if any dims aren't found

            if (this.hasSpecifiedDims !== undefined) {
                return this.hasSpecifiedDims;
            }

            for (var i = 0; i < this.opts.gallery.length; i++) {
                // are w/h properties present?
                if ( this.opts.gallery[i].hasOwnProperty('width') && this.opts.gallery[i].hasOwnProperty('height') ) {
                    // is there valid data?
                    if ( isNaN(parseInt(this.opts.gallery[i].width)) || isNaN(parseInt(this.opts.gallery[i].height)) ) {
                        all = false;
                    } else {
                        some = true;
                    }
                } else {
                    all = false;
                }
            };

            if (some && !all) {
                console.log("PhotoMosaic: ERROR: Width / Height data not present for all images.");
            }

            this.hasSpecifiedDims = all;

            return this.hasSpecifiedDims;
        },

        getTransition: function() {
            var transition = 'none';

            if ( PhotoMosaic.Modernizr.csstransitions && PhotoMosaic.Modernizr.csstransforms ) {
                transition = this.opts.loading_transition
            }
            return 'transition-' + transition;
        },

        modalCallback: function() {
            var $node = this.obj.children().eq(0)[0];
            if($.isFunction(this.opts.modal_ready_callback)){
                this.opts.modal_ready_callback.apply(this, [$node]);
            }
        },

        logGalleryData: function() {
            var response = [];
            for (var i = 0; i < this.opts.gallery.length; i++) {
                response.push({
                    src: this.opts.gallery[i].src,
                    thumb: this.opts.gallery[i].thumb,
                    caption: this.opts.gallery[i].caption,
                    width: this.opts.gallery[i].width.original,
                    height: this.opts.gallery[i].height.original,
                });
            }
            console.log("PhotoMosaic: Generate Gallery Data...");
            console.log( JSON.stringify(response) );
        }

    });

    $.fn.photoMosaic = function(options) {
        this.each(function(i) {
            if (!this.photoMosaic) {
                this.photoMosaic = new photoMosaic();
                this.photoMosaic.init(this, options, i);

                // for debugging
                window['PhotoMosaic']['mosaics'].push({
                    'el' : this,
                    'opts' : options
                });
            }
        });
        return this;
    };

})(jQuery);
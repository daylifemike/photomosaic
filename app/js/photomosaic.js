/*
    jQuery photoMosaic v2.5.2
    requires: jQuery 1.7+, JSTween 1.1, Mustache, Modernizr, & ImagesLoaded
    optional: prettyPhoto
*/
(function ($) {
    // for debugging
    if (window.PhotoMosaic) {
        window.PhotoMosaic.$ = $;
        window.PhotoMosaic.mosaics = [];
    }

    var pluginName = 'photoMosaic';
    var self;

    var Plugin = function (el, options, i) {
        self = this;

        this.el = el;
        this.obj = $(el);
        this._options = options;

        this._id = this.makeID(true);

        this.init();
    };

    Plugin.prototype = {

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
                if (window.console !== 'undefined') {
                    window.console.log(msg);
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
            '<div id="photoMosaic_{{id}}" class="photoMosaic loading {{clazz}}" style="width:{{width}}px; height:{{height}}px; {{#center}}margin-left:auto; margin-right:auto;{{/center}}">' +
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

            this.images = [];
            this.columns = [];

            if (this.opts.width === 'auto') {
                this.opts.width = this.obj.width();
            }

            // Error Checks
            if (this.errorChecks.initial()) {
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
                this.obj.html(PhotoMosaic.Mustache.to_html(this.loading_template, {
                    id: this._id
                }));
            }

            this.opts.columns = this.autoCols();

            this.col_width = Math.floor((this.opts.width - (this.opts.padding * (this.opts.columns - 1))) / this.opts.columns);

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

            if ( self.opts.loading_transition !== 'none' && !PhotoMosaic.Modernizr.csstransitions ) {
                this.obj.find('img').css('opacity','0');
            }

            this.obj.imagesLoaded({
                progress: function (isBroken, $images, $proper, $broken) {
                    setTimeout(function () {
                        if ( self.opts.loading_transition === 'none' || PhotoMosaic.Modernizr.csstransitions ) {
                            $($proper[$proper.length - 1]).parents('span.loading, a.loading').removeClass('loading');

                            if ( ($proper.length + $broken.length) === $images.length ) {
                                self.obj.children('.photoMosaic').removeClass('loading');
                            }

                        } else {
                            $($proper[$proper.length - 1]).animate(
                                { 'opacity' : '1' },
                                self.opts.responsive_transition_settings.duration * 1000,
                                function(){
                                    $(this).parents('span.loading, a.loading').removeClass('loading');

                                    if ( ($proper.length + $broken.length) === $images.length ) {
                                        self.obj.children('.photoMosaic').removeClass('loading');
                                    }
                                }
                            );
                        }
                    }, 0);
                },
                always: function () {
                    // setTimeout(function () {
                    //     self.obj.children('.photoMosaic').removeClass('loading');
                    // }, 1000);
                },
                fail: function($images, $proper, $broken) {
                    var id = '';
                    var img = null;
                    var i = 0;
                    var j = 0;

                    for (i = 0; i < $broken.length; i++) {
                        $node = $($broken[i]);
                        id = $node.attr('id');
                        img = self.deepSearch(self.images, 'id', id);

                        for (j = 0; j < self.images.length; j++) {
                            if (self.images[j] === img) {
                                self.images.splice(j,1);
                            }
                        };

                        $node.parent().remove();
                    };

                    self.refresh();
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

            // ERROR CHECK: remove any images that didn't 404 but failed to load
            this.images = this.errorChecks.imageDimensions(this.images);
            if (this.images.length === 0) {
                return PhotoMosaic.Mustache.to_html('', {});
            }

            var json = this.makeMosaicView();

            // ERROR CHECK: don't load if the layout is broken
            if (this.errorChecks.layout(json)) {
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
                image = this.deepSearch(columns, 'id', this.images[i].id);
                images.push(image);
            };

            return images;
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
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if ( (prop == key) && (obj[prop] == value) ) {
                            return obj;
                        } else if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
                            response = this.deepSearch(obj[prop], key, value);
                            if (response) {
                                return response;
                            }
                        }
                    }
                }
            }

            return response;
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

        addPreloadData: function (gallery) {
            var $preload = $('#' + this.preload);

            $.each(gallery, function (i) {
                $img = $preload.find('.' + this.id);

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

            // construct the gallery
            if (this.opts.input === 'json') {
                return this.opts.gallery;

            } else if (this.opts.input === 'html') {
                return this.constructGalleryFromHTML();

            } else if (this.opts.input === 'xml' ) {
                return $.when(
                        $.get(this.opts.gallery)
                    ).then(
                        // success
                        function (data) {
                            var gallery;
                            if ($(data).find('photos').length > 0) {
                                gallery = $(data).find('photos');
                                return self.constructGalleryFromXML(gallery);
                            } else {
                                self.log.error("The XML doesn't contain any <photo> nodes.");
                                return;
                            }
                        },
                        // fail
                        function () {
                            self.log.error("The XML either couldn't be found or was malformed.");
                            return;
                        }
                    );
            }
        },

        setImageIDs: function (gallery) {
            for (var i = 0; i < gallery.length; i++) {
                gallery[i].id = this.makeID();
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

        constructGalleryFromHTML: function () {
            var gallery = [];
            var $images = this.obj.find('img');

            for (var i = 0; i < $images.length; i++) {
                var $image = $images.eq(i)
                var image = {
                    caption : $image.attr('title'),
                    alt : $image.attr('alt'),
                    width : parseInt( $image.attr('width') ),
                    height : parseInt( $image.attr('height') )
                };

                if ($image.parent('a').length > 0 && this.opts.links) {
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

        constructGalleryFromXML: function (gallery) {
            var response = [];

            gallery.find('photo').each(function (i) {
                var photo = {};
                var data = $(this);

                photo.caption = data.children('title').text();
                photo.alt = data.children('alt').text();
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

                if ( !this.shouldAnimate() || !PhotoMosaic.Modernizr.csstransitions ) {
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

        makeID: function (small) {
            var S4 = function () {
                return ( ( (1 + Math.random()) * 0x10000 ) | 0 ).toString(16).substring(1);
            };
            if (small) {
                return S4() + S4() + '' + S4() + S4();
            }
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

        errorChecks: {
            // "self" refers to the global "self", something I hate doing.
            // making this a closure doesn't really solve the problem because this gets called willy-nilly
            // var self = this; // :(
            initial: function () {
                if (self.opts.input === 'xml') {
                    if (typeof self.opts.gallery !== 'string' || self.opts.gallery === '') {
                        self.log.error("No XML file path specified.");
                        return true;
                    }
                }

                if (self.opts.input === 'json') {
                    if (typeof self.opts.gallery === 'string') {
                        if (self.opts.gallery === '') {
                            self.log.error("No JSON object defined.");
                            return true;
                        }

                        if (typeof window[self.opts.gallery] !== 'undefined') {
                            self.opts.gallery = window[self.opts.gallery];
                        } else {
                            self.log.error("No JSON object found when referencing '" + self.opts.gallery + "'.");
                            self.log.info("Make sure your variable is avaible to the global scope (window['" + self.opts.gallery + "']) or simply pass the object literal (gallery:" + self.opts.gallery + ") instead of a string (gallery:\"" + self.opts.gallery + "\").");
                            return true;
                        }
                    }

                    if (self.opts.gallery.length === 0) {
                        self.log.error("Specified gallery data is empty.");
                        return true;
                    }
                }

                if (self.opts.prevent_crop && self.opts.height !== 'auto') {
                    self.log.info("Height must be set to 'auto' to Prevent Cropping. The value for height (" + self.opts.height + ") is being ignored so as to prevent cropping.");
                    self.opts.height = "auto";
                }
                return false;
            },

            imageDimensions: function (images) {
                var to_delete = [];

                $.each(images, function (i) {
                    if (isNaN(this.height.adjusted)) {
                        to_delete.push(i);
                    }
                });

                for (var i = to_delete.length - 1; i >= 0; i--) {
                    self.log.error("The following image failed to load and was skipped.\n" + images[to_delete[i]].src);
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
                            self.log.error("Your gallery's height is too small for your current settings and won't render correctly.");
                            return true;
                        }
                    };
                };

                return false;
            }
        },

        _name : pluginName,

        version : '2.5.2'

    };


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

}(window.JQPM||jQuery));
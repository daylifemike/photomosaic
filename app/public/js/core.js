(function ($, window) {
    'use strict';

    var pluginName = 'photoMosaic';
    var self;

    var photoMosaic = function (el, options, i) {
        self = this;

        this.$ = $;
        this.el = el;
        this.obj = $(el);
        this._options = options;

        this._id = options.id || PhotoMosaic.Utils.makeID(true);

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

        // for onReady Callback / modal_ready_callback
        $.data(this.el, pluginName, this);

        // for debugging
        window.PhotoMosaic.Mosaics.push({
            'el' : this.el,
            '$el' : this.obj,
            'opts' : this._options,
            'instance' : this
        });

        this.init();
    };

    photoMosaic.prototype = {
        _defaults: {
            input : 'json', // json, html, xml
            gallery : 'PMalbum', // json object, xml file path
            padding : 2,
            width : 'auto', // auto (str) or (int)
            height : 'auto', // auto (str) or (int)
            links : true,
            external_links: false,
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
            lightbox_rendition : 'full',
            honor_device_pixel_ratio : true,

            layout : 'columns', // rows, columns, grid

            // columns opts
            columns : 'auto', // auto (str) or (int)
            order : 'rows', // rows, columns, masonry, random
            min_column_width : 300,

            // rows opts
            rows : 'auto', // auto (str) or (int)
            allow_orphans : false,
            max_row_height : 325,

            // grid opts
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

            if ( PhotoMosaic.ErrorChecks.nonModernBrowser() ) {
                if ( this.opts.fallback ) {
                    this.obj.html( this.opts.fallback );

                    setTimeout(function(){
                        self.modalCallback( self.obj.find('.gallery') );
                    }, 0);
                } else {
                    setTimeout(function(){
                        self.modalCallback( self.obj );
                    }, 0);
                }

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
                key : this._id,
                id : this._id,
                class_name : this.makeSpecialClasses(),
                center : this.opts.center
            };

            // bail if we don't have any images (e.g. they all failed to load)
            if ( PhotoMosaic.ErrorChecks.initial(this.opts) ) { return; }

            this.layout = new PhotoMosaic.Layouts[ this.opts.layout ]( this );
            layout_data = this.layout.getData( false );

            view_model = $.extend({}, mosaic_data, layout_data);

            this.react = React.render(
                React.createElement(
                    PhotoMosaic.Layouts.React.mosaic,
                    view_model
                ), // the component to render
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
            var $preload = (isPreload) ? $('#' + this.preload) : null;
            var $img = null;
            var image = null;
            var image_url = '';
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

                image.caption = PhotoMosaic.Utils.decodeHTML( image.caption );

                image = self.prepDataModal( image );

                image = self.prepDataLinks( image );

                images.push(image);
            });

            return images;
        },

        prepDataModal: function (image) {
            var modal_text = '';

            if (this.opts.modal_name) {
                if (this.opts.modal_group) {
                    if (this.opts.modal_hash) {
                        modal_text = this.opts.modal_name + '[' + this.opts.modal_hash + ']';
                    } else {
                        modal_text = this.opts.modal_name + '[' + this._id + ']';
                    }
                } else {
                    modal_text = this.opts.modal_name;
                }
                image.modal = modal_text;
            }

            return image;
        },

        prepDataLinks: function (image) {
            if (this.opts.links && image.url) {
                image.link = true;
                image.path = image.url;
                image.external = this.opts.external_links;
                // delete image.modal;
            } else if (this.opts.links) {
                image.link = true;
                image.external = this.opts.external_links;

                if (image.sizes && image.sizes.hasOwnProperty(this.opts.lightbox_rendition)) {
                    image.path = image.sizes[this.opts.lightbox_rendition];
                } else {
                    image.path = image.full;
                }
            } else {
                image.link = false;
            }

            return image;
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

            var layout_data = this.layout.getData( true );

            var view_model = $.extend({}, mosaic_data, layout_data);

            // transitionend fires for each proprty being transitioned, we only care about when the last one ends
            var checkLazyload = PhotoMosaic.Utils.debounce(function () {
                $.waypoints('refresh');
            }, 300);

            this.react = React.render(
                PhotoMosaic.Layouts.React.mosaic(view_model),
                this.obj.get(0),
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

            // make sure numbers are numbers
            var exclusions = ['width', 'height', 'shape', 'modal_hash'];
            for (var k in props) {
                if (($.inArray(k, exclusions) == -1) && !isNaN(parseFloat(props[k]))) {
                    props[k] = parseFloat(props[k]);
                }
            };

            this.opts = $.extend({}, this.opts, props);

            var self = this;
            var gallery = [];
            $.each(this.opts.gallery, function (idx, image) {
                gallery.push( self.prepDataModal(image) );
            });

            this.opts.gallery = gallery;

            this.layout = new PhotoMosaic.Layouts[ this.opts.layout ]( this );

            this.refresh();
        },

        modalCallback: function ($node) {
            var $ = $ || this.$;
            var $node = $node || this.obj.children().eq(0);
            var $items = $node.children();
            var lightbox_callback = PhotoMosaic.WP[ this.opts.id ].lightbox_callback;

            if ( $.isFunction(this.opts.modal_ready_callback) ) {
                this.opts.modal_ready_callback.apply(this, [$, $node, $items]);
            }

            if ( lightbox_callback && $.isFunction( lightbox_callback ) ) {
                lightbox_callback.apply(this, [$, $node, $items]);
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
                instance = new photoMosaic(this, options);
            }
        });
    };

    $(document).on('ready', function () {
        $.each(PhotoMosaic.WP, function (id, config) {
            var params = $.extend(true, {}, config.settings, {
                    gallery : config.gallery,
                    fallback : config.fallback
                });
            $('#' + config.target).photoMosaic( params );
        });
    });

}(window.JQPM, window));
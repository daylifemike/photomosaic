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
                    $(image.img).parents('span.loading, a.loading').removeClass('loading');
                } else {
                    // you want a transition but the browser doesn't support CSS Transitions... fade (old IEs)
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
}(window.JQPM));
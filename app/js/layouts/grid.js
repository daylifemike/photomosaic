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
}(window.JQPM));
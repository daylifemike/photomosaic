(function ($) {
    'use strict';

    PhotoMosaic.Layouts.columns = function (mosaic) {
        this.node = mosaic.obj;
        this.opts = mosaic.opts;
        this._options = mosaic._options;
        this._options.gallery = mosaic.opts.gallery.slice(); // we want to be able to refer to the original gallery order
        this.images = mosaic.opts.gallery;
        this.imagesById = PhotoMosaic.Utils.arrayToObj( this.images, 'id' );
        this.isRefreshing = false;
        return this;
    };

    PhotoMosaic.Layouts.columns.prototype = {
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

            // scale each image to the column width
            images = this.scaleToWidth( images, column_width );

            // sort the images (based on opts.order) and assign them to columns
            columns = PhotoMosaic.Layouts.Common.dealIntoColumns( images, columns, this.opts, this.isRefreshing );

            // determine the target height for the entire mosaic
            mosaic_height = this.getMosaicHeight( columns );

            //-- ??? mark last column -- is this still necessary?

            // adjust the images in each column to the new height (for a flat bottom edge)
            columns = this.adjustColumnsToHeight( columns, mosaic_height );

            // do everything possible to make sure we show SOMETHING
            if ( this.errorChecks.aspectRatio(images) ) {
                columns = this.balanceColumnsToHeight( columns, mosaic_height );
            }

            // bail if the user's settings creates a super-broken mosaic
            if ( this.errorChecks.height(images) ) {
                return false;
            }

            // create crop position info
            images = this.positionImagesInContainer( images );

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

        scaleToWidth : function (images, width) {
            for (var i = 0; i < images.length; i++) {
                images[i].width.container = images[i].width.adjusted = width;
                images[i].height.container = images[i].height.adjusted = Math.floor((images[i].height.original * width) / images[i].width.original);
            }

            return images;
        },

        getMosaicHeight : function (columns) {
            if (this.opts.height && this.opts.height !== 'auto') {
                return this.opts.height;
            }

            var column_heights = PhotoMosaic.Layouts.Common.getColumnHeights( this.imagesById, columns, this.opts );

            if (this.opts.prevent_crop) {
                return Math.max.apply( Math, column_heights );
            }

            /*
                function median (values) {
                    var half = Math.floor( values.length / 2 );
                    values.sort( function (a,b) {
                        return a - b;
                    } );
                    if (values.length % 2) {
                        return values[half];
                    } else {
                        return Math.ceil( (values[half-1] + values[half]) / 2 );
                    }
                }
            */

            function mean (values) {
                var sum = 0;
                var i = 0;

                for (i = 0; i < values.length; i++) {
                    sum += values[i];
                };

                return Math.ceil( sum / values.length );
            }

            return mean( column_heights );
        },

        adjustColumnsToHeight : function (columns, target_height) {
            if (this.opts.prevent_crop) {
                return columns;
            }
            for (var i = 0; i < columns.length; i++) {
                columns[i] = this.adjustColumnToHeight( columns[i], target_height );
            }
            return columns;
        },

        adjustColumnToHeight: function (ids, target_height) {
            var column_height = 0;
            var i = 0;

            // get the height of each column
            for (i = 0; i < ids.length; i++) {
                column_height += this.imagesById[ ids[i] ].height.container;
            }

            column_height += (ids.length - 1) * this.opts.padding;

            // ??? mark last image in column

            // how much do we need to grow or shrink the column
            var diff = target_height - column_height // (plus = grow, minus = shrink)
            var direction = (diff > 0) ? 'grow' : 'shrink';
            diff = Math.abs(diff);

            // spread the diff between the image
            i = 0;
            while (diff > 0) {
                i = (i >= ids.length) ? 0 : i;
                if (direction === 'grow') {
                    this.imagesById[ ids[i] ].height.container++;
                } else {
                    this.imagesById[ ids[i] ].height.container--;
                }
                i++;
                diff--;
            }

            return ids;
        },

        balanceColumnsToHeight : function (columns, target_height) {
            if (this.opts.prevent_crop) {
                return columns;
            }
            for (var i = 0; i < columns.length; i++) {
                columns[i] = this.balanceColumnToHeight( columns[i], target_height );
            }
            return columns;
        },

        balanceColumnToHeight : function (ids, target_height) {
            var column_height = target_height - ((ids.length - 1) * this.opts.padding);
            var divy = Math.floor(column_height / ids.length);
            var remainder = column_height % ids.length;

            for (var i = 0; i < ids.length; i++) {
                this.imagesById[ ids[i] ].height.container = divy;
            }

            for (var i = 0; i < remainder; i++) {
                this.imagesById[ ids[i] ].height.container++;
            }

            return ids;
        },

        positionImagesInContainer : function (images) {
            var image = null;

            for (var i = 0; i < images.length; i++) {
                image = images[i];

                image.adjustments = {};

                if (!this.opts.prevent_crop) {
                    // adjusted is still scaled to the column's width
                    if (image.height.adjusted > image.height.container) {
                        image.adjustments.top = Math.floor((image.height.adjusted - image.height.container) / 2);
                    } else {
                        image.width.adjusted = Math.floor((image.width.adjusted * image.height.container) / image.height.adjusted);
                        image.height.adjusted = image.height.container;

                        image.adjustments.left = Math.floor((image.width.adjusted - image.width.container) / 2);
                    }
                }

                image.adjustments = PhotoMosaic.Layouts.Common.normalizeAdjustments( image.adjustments );

                images[i] = image;
            };

            return images;
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
            aspectRatio: function (images) {
                for (var i = 0; i < images.length; i++) {
                    if (images[i].height.container <= 10) { // 10 is pretty arbitrary
                        PhotoMosaic.Utils.log.error("Your gallery's height doesn't allow your images to proportioned based on their aspect ratios.");
                        return true;
                    }
                }
                return false;
            },
            height: function (images) {
                for (var i = 0; i < images.length; i++) {
                    if (images[i].height.container <= 0) {
                        PhotoMosaic.Utils.log.error("Your gallery has been hidden because its height is too small for your current settings and won't render correctly.");
                        return true;
                    }
                }
                return false;
            }
        }
    };
}(window.JQPM));
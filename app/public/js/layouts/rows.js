(function ($) {
    PhotoMosaic.Layouts.rows = function (mosaic) {
        this.node = mosaic.obj;
        this.opts = mosaic.opts;
        this._options = mosaic._options;
        this._options.gallery = mosaic.opts.gallery.slice(); // we want to be able to refer to the original gallery order
        this.images = mosaic.opts.gallery;
        this.imagesById = PhotoMosaic.Utils.arrayToObj( this.images, 'id' );
        this.ordered_images = $.map( this.images, function (item, i) {
            return item.id;
        } );
        this.isRefreshing = false;
        return this;
    };
    PhotoMosaic.Layouts.rows.prototype = {
        getData : function () {
            var images = this.images;
            var rows = null;

            this.opts.width = PhotoMosaic.Layouts.Common.getRelativeWidth( this._options, this.opts, this.node );
            this.opts.height = PhotoMosaic.Layouts.Common.getRelativeDimenion( this._options, this.opts, this.node, 'height', this.node.height());

            // look for conflicting settings
            this.opts = this.errorChecks.initial( this._options, this.opts );

            // scale images to the tallest height
            images = this.scaleImagesToHeight( images, this.opts.max_row_height );

            // group into rows assuming auto-rows
            rows = this.groupIntoRows( images, this.opts.width );

            // adjust the groups to get the desired number of rows
            if (
                (this.opts.rows === 'auto' || this.opts.rows === 0)
                && (this._options.height !== 'auto' && this._options.height !== 0)
            ) {
                rows = this.adjustNumberOfRowsByHeight( images, rows, this.opts.height );
            } else {
                rows = this.adjustNumberOfRowsByRows( images, rows );
            }

            // scale the rows to the correct width
            rows = this.adjustRowsToWidth( rows, this.opts.width );

            if (!this.opts.prevent_crop) {
                rows = this.plumbRows( rows, this.opts.width );
            }

            if (this.opts.allow_orphans && this.hasOrphans(rows)) {
                // the orphan row tends to be much taller than the others
                rows = this.normalizeOrphanRowHeight( rows, this.opts.width );
            }

            if (this._options.height !== 'auto' && this._options.height !== 0) {
                rows = this.setMosaicHeight( images, rows, this.opts.height );
            }

            // create crop position info
            images = PhotoMosaic.Layouts.Common.positionImagesInContainer( images, this.opts.prevent_crop );

            // convert all this knowledge into position data
            this.positionImagesInMosaic( rows, this.opts.padding );

            images = PhotoMosaic.Utils.pickImageSize( images, this.opts.sizes );

            this.isRefreshing = false;

            return {
                width : this.opts.width,
                height : this.getMosaicHeight(rows),
                images : images
            };
        },

        groupIntoRows : function (images, container_width) {
            var rows = [];
            var row = [];
            var row_width = 0;

            for (var i = 0; i < images.length; i++) {
                if (row_width > container_width) {
                    rows.push( row );
                    row = [ images[i] ];
                    row_width = images[i].width.container;
                } else {
                    row.push( images[i] );
                    row_width = row_width + images[i].width.container;
                }
            };

            rows.push( row );

            return rows;
        },

        scaleImagesToHeight : function (images, height) {
            for (var i = 0; i < images.length; i++) {
                images[i] = this.scaleImageToHeight( images[i], height );
            };

            return images;
        },

        scaleImageToHeight : function (image, height) {
            image.height.container = image.height.adjusted = height;
            image.width.container = image.width.adjusted = Math.floor((image.width.original * height) / image.height.original);

            return image;
        },

        adjustNumberOfRowsByRows : function (images, rows, force) {
            var desired = null;

            if (force) {
                desired = force;
            } else if (
                (this.opts.rows === 'auto' || this.opts.rows === 0)
                && !this.opts.allow_orphans
                && this.hasOrphans
            ) {
                desired = rows.length - 1;
            } else if (this.opts.rows !== 'auto' && this.opts.rows !== 0) {
                desired = this.opts.rows;
            } else {
                // we have what we want
                return rows;
            }

            // binary search
            var lower = (rows.length < desired) ? this.opts.max_row_height : 0;
            var upper = (rows.length > desired) ? this.opts.max_row_height : 1000;
            var middle = 0;
            var i = 0;

            while((upper - lower) > 1) {
                middle = Math.floor((upper - lower) / 2) + lower;

                images = this.scaleImagesToHeight( images, middle );
                rows = this.groupIntoRows( images, this.opts.width );

                if (rows.length > desired) {
                    upper = middle;
                } else {
                    lower = middle;
                }
            }

            if (rows.length > desired) {
                images = this.scaleImagesToHeight( images, lower );
                rows = this.groupIntoRows( images, this.opts.width );
            }

            return rows;
        },

        adjustNumberOfRowsByHeight : function (images, rows, desired) {
            // binary search
            var current = this.getMosaicHeight(rows);
            var lower = (current < desired) ? this.opts.max_row_height : 0;
            var upper = (current > desired) ? this.opts.max_row_height : 1000;
            var middle = 0;
            var i = 0;

            while((upper - lower) > 1) {
                middle = Math.floor((upper - lower) / 2) + lower;

                images = this.scaleImagesToHeight( images, middle );
                rows = this.groupIntoRows( images, this.opts.width );

                current = this.getMosaicHeight(rows);

                if (current > desired) {
                    upper = middle;
                } else {
                    lower = middle;
                }
            }

            if (current > desired) {
                images = this.scaleImagesToHeight( images, upper );
                rows = this.groupIntoRows( images, this.opts.width );
            }

            return rows;
        },

        adjustRowsToWidth : function (rows, container_width) {
            for (var i = 0; i < rows.length; i++) {
                rows[i] = this.adjustRowToWidth( rows[i], container_width );
            }

            return rows;
        },

        adjustRowToWidth : function (row, container_width) {
            var row_width = this.getRowWidth(row);
            var row_height = row[0].height.container;
            var i = 0;

            if (row_width > container_width) {
                row = this.adjustRowToHeight( row, (row_height - 1) );
                return this.adjustRowToWidth( row, container_width );
            } else {
                if (!this.opts.prevent_crop) {
                    return this.adjustRowToHeight( row, (row_height + 1) );
                }
            }

            return row;
        },

        adjustRowToHeight : function (row, height) {
            for (var i = 0; i < row.length; i++) {
                row[i] = this.scaleImageToHeight( row[i], height );
            }

            return row;
        },

        plumbRows : function (rows, container_width) {
            for (var i = 0; i < rows.length; i++) {
                rows[i] = this.plumbRow( rows[i], container_width );
            }
            return rows;
        },

        plumbRow : function (row, container_width) {
            var row_width = this.getRowWidth(row);
            var diff = row_width - container_width;
            var i = 0;

            if (diff > 0) {
                // trim
                while(diff > 0) {
                    i = (i >= row.length) ? 0 : i;
                    row[i].width.container = row[i].width.container - 1;
                    i++;
                    diff--;
                }
            } else {
                if (Math.abs(diff) < (container_width / 10)) {
                    // scale up
                    while(diff < 0) {
                        i = (i >= row.length) ? 0 : i;
                        row[i].width.container = row[i].width.container + 1;
                        i++;
                        diff++;
                    }
                }
            }

            return row;
        },

        normalizeOrphanRowHeight : function (rows, container_width) {
            var last_row = rows[rows.length - 1];
            var row_width = this.getRowWidth(last_row);
            var average_height = 0;

            if (row_width >= container_width) {
                return rows;
            } else {
                average_height = this.getAverageRowHeight(rows);
                last_row = this.adjustRowToHeight(last_row, average_height);
            }

            rows[rows.length - 1] = last_row;
            return rows
        },

        hasOrphans : function (rows) {
            var row_width = this.getRowWidth( rows[rows.length - 1] );
            return (row_width < this.opts.width);
        },

        getRowWidth : function (row) {
            var row_width = 0;

            for (var i = 0; i < row.length; i++) {
                row_width += row[i].width.container;
            }

            row_width += (row.length - 1) * this.opts.padding;

            return row_width;
        },

        getAverageRowHeight : function (rows) {
            var total_height = 0;

            for (var i = 0; i < rows.length; i++) {
                total_height += rows[i][0].height.container;
            }

            return Math.floor(total_height / rows.length);
        },

        setMosaicHeight : function (images, rows, desired) {
            var current = this.getMosaicHeight(rows);
            var diff = current - desired;
            var row_heights = [];
            var padding = this.opts.padding * (rows.length - 1);

            // get each row's height as a percentage of the container_height
            for (var i = 0; i < rows.length; i++) {
                row_heights.push(
                    Math.round(
                        (((desired - padding) * rows[i][0].height.container) / (current - padding))
                    )
                );
            }

            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < rows[i].length; j++) {
                    rows[i][j].height.container = row_heights[i];
                }
            }

            return rows;
        },

        getMosaicHeight : function (rows) {
            var total_height = 0;

            for (var i = 0; i < rows.length; i++) {
                total_height += rows[i][0].height.container;
            }

            return Math.ceil(total_height + ((rows.length - 1) * this.opts.padding));
        },

        positionImagesInMosaic : function (rows, padding) {
            var from_left = 0;
            var from_top = 0;
            var image = null;

            for (var i = 0; i < rows.length; i++) {
                from_left = 0;

                for (var j = 0; j < rows[i].length; j++) {
                    image = rows[i][j];

                    image.position = {
                        top : from_top,
                        left : from_left
                    };

                    from_left = from_left + image.width.container + padding;
                };

                from_top = from_top + rows[i][0].height.container + padding;
            };
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
            initial : function (_options, opts) {
                if (this.heightRowMismatch(_options, opts)) {
                    PhotoMosaic.Utils.log.info("Rows must be set to 'auto' to set a fixed Height");
                    opts.rows = 'auto';
                }
                if (this.heightOrphanMismatch(_options, opts)) {
                    PhotoMosaic.Utils.log.info("Allow Orphans must be 'true' to set a fixed Height");
                    opts.allow_orphans = true;
                }
                if (this.heightCropMismatch(_options, opts)) {
                    PhotoMosaic.Utils.log.info("Prevent Cropping must be 'false' to set a fixed Height");
                    opts.prevent_crop = false;
                }
                return opts;
            },
            heightRowMismatch : function (_options, opts) {
                return (
                    (_options.height !== 'auto' && _options.height !== 0)
                    && (opts.rows !== 'auto' && opts.rows !== 0)
                );
            },
            heightOrphanMismatch : function (_options, opts) {
                return (
                    (_options.height !== 'auto' && _options.height !== 0)
                    && !opts.allow_orphans
                );
            },
            heightCropMismatch : function (_options, opts) {
                return (
                    (_options.height !== 'auto' && _options.height !== 0)
                    && opts.prevent_crop
                );
            },
        }
    };
}(window.JQPM));
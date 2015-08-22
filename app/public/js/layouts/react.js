(function ($) {
    'use strict';

    function prefixId (id) {
        return 'photoMosaic_' + id;
    }

    function vendorPrefix(str) {
        var prop = PhotoMosaic.Plugins.Modernizr.prefixed(str);
        return prop.replace(/([A-Z])/g, function(str,m1){
                return '-' + m1.toLowerCase();
            }).replace(/^ms-/,'-ms-');
    }

    PhotoMosaic.Layouts.React = {
        mosaic : React.createClass({
            componentDidMount : function () {
                $(React.findDOMNode(this)).addClass('photomosaic-loading');
            },
            render : function () {
                var id = prefixId(this.props.id);
                var class_name = 'photoMosaic ' + this.props.class_name;
                var style = {
                    width : this.props.width,
                    height : this.props.height
                };
                var images = this.props.images.map(function (image) {
                    return (
                        React.createElement(PhotoMosaic.Layouts.React.item, image)
                    );
                });

                if (this.props.center) {
                    style['marginRight'] = 'auto';
                    style['marginLeft'] = 'auto';
                }

                return (
                    React.createElement(
                        'div',
                        {
                            id : id,
                            className : class_name,
                            style : style,
                            children : images
                        }
                    )
                );
            }
        }),

        item : React.createClass({
            componentDidMount : function () {
                $(React.findDOMNode(this)).addClass('photomosaic-loading');
            },
            render : function () {
                var data = this.props;
                var node_type = (data.link) ? 'a' : 'span';
                var params = {
                    className : 'photomosaic-item',
                    key : data.id,
                    style : {
                        width : data.width.container,
                        height : data.height.container
                    },
                    children : [
                        React.createElement(
                            PhotoMosaic.Layouts.React.spinner,
                            $.extend({}, data, {key : data.id + '_spinner'})
                        ),
                        React.createElement(
                            PhotoMosaic.Layouts.React.animation_wrapper,
                            data
                        )
                    ]
                };

                params.style[vendorPrefix('transform')] = 'translate(' + data.position.left + 'px, ' + data.position.top + 'px)';

                if (data.link) {
                    if (data.external) { params.target = '_blank'; }
                    if (data.modal) { params.rel = data.modal; }
                    if (data.caption) { params.title = data.caption; }
                    params.href = data.path;
                }

                return (
                    React.createElement(node_type, params)
                );
            }
        }),

        animation_wrapper : React.createClass({
            render : function () {
                var data = this.props;
                var params = {
                    className : 'photomosaic-animation-wrap',
                    children : [
                        React.createElement(PhotoMosaic.Layouts.React.image, data)
                    ]
                };

                return (
                    React.createElement('div', params)
                );
            }
        }),

        image : React.createClass({
            componentDidUpdate : function (prev_props, prev_state) {
                var $image = $(React.findDOMNode(this));
                var next_src = $image.attr('data-src');

                if (prev_props.src && (prev_props.src != next_src)) {
                    $image.attr('src', next_src);
                }
            },
            render : function () {
                var data = this.props;
                var style = {
                    width : data.width.adjusted,
                    height : data.height.adjusted
                };

                style[vendorPrefix('transform')] = 'translate(' + (data.adjustments.left * -1) + 'px, ' + (data.adjustments.top * -1) + 'px)';

                return (
                    React.createElement(
                        'IMG', // uppercase because of a MooTools v1.4.5 conflict
                        {
                            id : data.id,
                            'data-src' : data.src,
                            title : data.caption,
                            alt : data.alt,
                            style : style
                        }
                    )
                );
            }
        }),

        spinner : React.createClass({
            render : function () {
                var data = this.props;
                var style = {
                    width : data.width.adjusted,
                    height : data.height.adjusted,
                };

                style[vendorPrefix('transform')] = 'translate(' + (data.adjustments.left * -1) + 'px, ' + (data.adjustments.top * -1) + 'px)';

                return (
                    React.createElement(
                        'div',
                        {
                            className : 'photomosaic-spinner-wrap',
                            children : [
                                React.createElement(
                                    'div',
                                    {
                                        className : 'photomosaic-spinner',
                                        style : style
                                    }
                                )
                            ]
                        }
                    )
                );
            }
        }),

        loading : React.createClass({
            render : function () {
                return (
                    React.createElement(
                        'div',
                        {
                            id : prefixId(this.props.id),
                            className : 'photoMosaic',
                            children : React.createElement(
                                'div',
                                {
                                    className : 'photoMosaicLoading',
                                    children : 'loading gallery...'
                                }
                            )
                        }
                    )
                );
            }
        })
    };

}(window.JQPM));
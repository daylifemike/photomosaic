(function ($) {
    'use strict';

    function prefixId (id) {
        return 'photoMosaic_' + id;
    }

    PhotoMosaic.Layouts.React = {
        mosaic : React.createClass({
            componentDidMount : function () {
                $(this.getDOMNode()).addClass('loading');
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
                        PhotoMosaic.Layouts.React.image_wrapper(image)
                    );
                });

                if (this.props.center) {
                    style['margin-right'] = 'auto';
                    style['margin-left'] = 'auto';
                }

                return (
                    React.DOM.div({
                        id : id,
                        className : class_name,
                        style : style,
                        children : images
                    })
                );
            }
        }),

        image_wrapper : React.createClass({
            componentDidMount : function () {
                $(this.getDOMNode()).addClass('loading');
            },
            render : function () {
                var data = this.props;
                var node_type = (data.link) ? 'a' : 'span';
                var params = {
                    className : 'photomosaic-item',
                    key : data.id,
                    style : {
                        position : 'absolute',
                        top : data.position.top,
                        left : data.position.left,
                        width : data.width.container,
                        height : data.height.container
                    },
                    children : [
                        PhotoMosaic.Layouts.React.spinner( $.extend({}, data, {key : data.id + '_spinner'}) ),
                        PhotoMosaic.Layouts.React.image(data)
                    ]
                };

                if (data.link) {
                    if (data.external) { params.target = '_blank'; }
                    if (data.modal) { params.rel = data.modal; }
                    if (data.caption) { params.title = data.caption; }
                    params.href = data.path;
                }

                return (
                    React.DOM[node_type](params)
                );
            }
        }),

        image : React.createClass({
            render : function () {
                var data = this.props;
                var style = {
                    width : data.width.adjusted,
                    height : data.height.adjusted,
                };

                for (var key in data.adjustments) {
                    style[key] = data.adjustments[key] * -1;
                }

                return (
                    React.DOM.img({
                        id : data.id,
                        'data-src' : data.src,
                        title : data.caption,
                        alt : data.alt,
                        style : style
                    })
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

                for (var key in data.adjustments) {
                    style[key] = data.adjustments[key] * -1;
                }

                return (
                    React.DOM.span({
                        className : 'photomosaic-spinner',
                        style : style
                    })
                );
            }
        }),

        loading : React.createClass({
            render : function () {
                return (
                    React.DOM.div({
                        id : prefixId(this.props.id),
                        className : 'photoMosaic',
                        children : React.DOM.div({
                            className : 'photoMosaicLoading',
                            children : 'loading gallery...'
                        })
                    })
                );
            }
        })
    };

}(window.JQPM));
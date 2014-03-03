PhotoMosaic.Inputs = (function ($){
    return {
        json : function (gallery) {
            return gallery;
        },
        html : function ($node, opts) {
            var gallery = [];
            var $images = $node.find('img');

            for (var i = 0; i < $images.length; i++) {
                var $image = $images.eq(i)
                var image = {
                    caption : $image.attr('title'),
                    alt : $image.attr('alt'),
                    width : parseInt( $image.attr('width') ),
                    height : parseInt( $image.attr('height') )
                };

                if ($image.parent('a').length > 0 && opts.links) {
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
        xml : function (gallery) {
            var response = [];

            gallery.find('photo').each(function (i) {
                var image = {};
                var data = $(this);

                image.caption = data.children('title').text();
                image.alt = data.children('alt').text();
                image.src = data.children('src').text();
                image.thumb = data.children('thumb').text();
                image.url = data.children('url').text();
                image.width = data.children('width').text();
                image.height = data.children('height').text();

                response.push(image);
            });

            return response;
        }
    };

}(window.JQPM));
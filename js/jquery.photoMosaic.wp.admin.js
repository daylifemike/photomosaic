(function($) {
    $(document).ready(function(){
        // ANCHOR SCROLL
        $(document).on('click', 'a', function (e) {
            var hash = this.hash;
            var name;
            var offset;

            if (hash.match('#')) {
                name = hash.split('#')[1];
                offset = $('a[name="' + name + '"]').offset().top - 40;
                $('html,body').stop().animate({ scrollTop: offset }, 300);
                return false;
            }
        });

        // JUMPLINKS
        var $jumplinks = $('.jumplinks ul');
        $('.question').each(function () {
            var $li = $('<li></li>');
            var $a = $('<a></a>');
            var $this = $(this);
            var $title = $this.find('h3.title');
            var $link = $title.prev();
            $a.prop('href', '#' + $link.prop('name'));
            $a.text($title.text());
            $li.append($a);
            $jumplinks.append($li);
        });

        // TABS
        var $tabContainers = $('.tab');
        var $tabs = $('.nav-tab');

        $tabs.click(function() {
            var hash = $(this).attr('href');
            $tabs.removeClass('nav-tab-active').filter(this).addClass('nav-tab-active');
            $tabContainers.hide().filter(hash).show();
            return false;
        }).eq(0).click();

        // WHAT'S NEW TOUR
        if (!window.PhotoMosaic.has_taken_tour) {
            var $container = $('#whatsnew-launch');
            var $launch = $container.find('#whatsnew-tour');
            var $dismiss = $container.find('#whatsnew-dismiss');

            $container.show();
            $dismiss.click(function () {
                dismissPointer();
                return false;
            });
            $launch.click(function () {
                cyclePointer(0);
                return false;
            });
        }

        function dismissPointer () {
            $('#whatsnew-launch').hide();
            $.post(ajaxurl, {
                action: 'photomosaic_whatsnew',
                dismissed: 'true'
            });
        }

        function cyclePointer (which) {
            var pointer_content = [
                {
                    selector: ".field:has(label:contains('Columns'))",
                    content: '\
                        <h3>Option Change</h3> \
                        <p>The "Column" and "Auto-Columns" options have merged.</p> \
                        <p>"Columns" now behaves like "Width" and "Height".</p> \
                        <p>If you have shortcodes that rely on turning off "Auto-Columns" to have the mosaic fallback to your \
                        "Columns" setting, you\'ll need to update them to explicitly set "Columns".</p> \
                    ',
                    position: {
                        edge: 'left',
                        my: 'left center',
                        at: 'right center'
                    }
                },
                {
                    selector: ".field:has(label:contains('Order'))",
                    content: '\
                        <h3>New Option</h3> \
                        <p>"Force Order" and "Randomize" have been replaced by the much more straight-forward "Order" option.</p> \
                    ',
                    position: {
                        edge: 'right',
                        my: 'right center',
                        at: 'left center',
                        offset: '-20 0'
                    }
                },
                {
                    selector: ".field:has(label:contains('Responsive Transition'))",
                    content: '\
                        <h3>New Feature & New Option</h3> \
                        <p>PhotoMosaic is now actively responsive (rerenders the mosaic as the user resizes their browser).</p> \
                        <p>This option sets whether layout changes should animate between states.</p> \
                    ',
                    position: {
                        edge: 'right',
                        my: 'right center',
                        at: 'left center',
                        offset: '-20 0'
                    }
                },
                {
                    selector: "label:contains('Columns')",
                    content: '\
                        <h3>Behavior Change</h3> \
                        <p>Auto-Columns has an entirely new logic.</p> \
                        <p>A lot of people were very vocal about their desire to have Auto-Columns \
                        generate mosaics with larger images - done.</p> \
                    ',
                    position: {
                        edge: 'left',
                        my: 'left center',
                        at: 'right center',
                        offset: '175 100'
                    }
                },
                {
                    selector: ".nav-tab:contains('FAQ')",
                    content: '\
                        <h3>New Section</h3> \
                        <p>These are the questions I get the most often.  They\'ll be updated regularly.</p> \
                    ',
                    position: {
                        edge: 'top',
                        my: 'top center',
                        at: 'bottom center',
                        offset: '0 80'
                    }
                },
                {
                    selector: ".nav-tab:contains('New')",
                    content: '\
                        <h3>New Section</h3> \
                        <p>Changes to PhotoMosaic (features, bug fixes, tweaks) will be listed here with each release.</p> \
                    ',
                    position: {
                        edge: 'top',
                        my: 'top center',
                        at: 'bottom center',
                        offset: '0 80'
                    }
                }
            ];
            var pointer_base = {
                close: function () {
                    cyclePointer(++which);
                }
            };

            if (!pointer_content[which]) {
                jQuery(pointer_content[(which - 1)].selector).pointer('close');
                dismissPointer();
            } else {

                jQuery(pointer_content[which].selector).pointer(
                    $.extend({}, pointer_base, pointer_content[which])
                ).pointer('open');

                setTimeout(function () {
                    $('body').removeClass('wp-pointer-' + (which - 1)).addClass('wp-pointer-' + which);

                    var $content = $(pointer_content[which].selector);
                    var $pointer = $('#wp-pointer-' + which);
                    var offset = Math.min(
                        $content.offset().top,
                        $pointer.offset().top
                    );

                    $('html,body').stop().animate({
                        scrollTop: offset - 50
                    }, 300);
                }, 0);
            }
        }

        // FORM
        var $lb = $('input[name="lightbox"]'),
            $custom_lb = $('input[name="custom_lightbox"]'),
            $custom_lb_name = $('input[name="custom_lightbox_name"]'),
            $custom_lb_params = $('textarea[name="custom_lightbox_params"]'),
            $auto_play = $('textarea[name="auto_play"]'),
            $auto_play_interval = $('textarea[name="auto_play_interval"]'),
            $links = $('input[name="links"]'),
            $link_to_url = $('input[name="link_to_url"]'),
            $external_links = $('input[name="external_links"]');
            
        $lb.click(function(){
            if($lb.is(':checked')){
                $custom_lb.removeAttr('checked');
            }
            if($lb.is(':checked') && $link_to_url.is(':checked')){
                $link_to_url.removeAttr('checked');
            }
            if($lb.is(':checked') && $external_links.is(':checked')){
                $external_links.removeAttr('checked');
            }
            if($lb.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
        });
        $custom_lb.click(function(){
            if($custom_lb.is(':checked')){
                $lb.removeAttr('checked');
            }
            if($custom_lb.is(':checked') && $link_to_url.is(':checked')){
                $link_to_url.removeAttr('checked');
            }
            if($custom_lb.is(':checked') && $external_links.is(':checked')){
                $external_links.removeAttr('checked');
            }
            if($custom_lb.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
        });
        $link_to_url.click(function(){
            if($lb.is(':checked')){
                $lb.removeAttr('checked');
            }
            if($custom_lb.is(':checked')){
                $custom_lb.removeAttr('checked');
            }
            if($link_to_url.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
        });
        $external_links.click(function(){
            if($lb.is(':checked')){
                $lb.removeAttr('checked');
            }
            if($custom_lb.is(':checked')){
                $custom_lb.removeAttr('checked');
            }
            if($external_links.is(':checked') && $links.is(':not(":checked")')){
                $links.attr('checked', true);
            }
            if($external_links.is(':checked') && $link_to_url.is(':not(":checked")')){
                $link_to_url.attr('checked', true);
            }
        });
        $links.click(function(){
            if($links.is(':not(":checked")')){
                $link_to_url.removeAttr('checked');
                $external_links.removeAttr('checked');
            }
        });
        
        $('#photomosaic-options').submit(function(){
            
            // TODO: make this less half-assed
            var returnState = true,
                $errorList = $('#photomosaic-error-list').empty().attr('style', '');
                
            if( $lb.is(':checked') && $custom_lb.is(':checked') ) {
                $errorList.append('<li style="list-style:disc; margin-left:20px;">"Use Default Lightbox" and "Use Custom Lightbox" can\'t both be selected.</li>');
                returnState = false;
            }

            if( $custom_lb.is(':checked') && $custom_lb_params.val().trim() == '' ) {            
                $custom_lb_params.val('{}');
            }
            
            if( $custom_lb.is(':checked') && $custom_lb_name.val().trim() == '' ) {            
                $errorList.append('<li style="list-style:disc; margin-left:20px;">"Custom Lightbox Name" can\'t be empty.</li>');
                returnState = false;
            }
            
            if( !$links.is(':checked') ) {
                if ($lb.is(':checked') || $custom_lb.is(':checked')) {
                    $errorList.append('<li style="list-style:disc; margin-left:20px;">"Image Links" must be selected to use a lightbox.</li>');
                    returnState = false;
                }
                if ($link_to_url.is(':checked')) {
                    $errorList.append('<li style="list-style:disc; margin-left:20px;">"Link to URL" requires "Image Links"</li>');
                    returnState = false;
                }
                if ($external_links.is(':checked')) {
                    $errorList.append('<li style="list-style:disc; margin-left:20px;">"Open Links in New Window" requires "Image Links"</li>');
                    returnState = false;
                }
            }
            
            if( !returnState ) {
                $errorList.prepend('<li style="font-size:16px; color:#cc0000;">Please fix the following errors</li>');
                $errorList.css({
                    'border':'1px solid #de7d7d',
                    'padding':'10px',
                    'background-color':'#f8dfdf'
                });
                scrollTo(0,0);
                return false;
            } else {
                return;
            }
        });
    });
})(JQPM);
(function($) {
    $(document).ready(function(){
        // CODEMIRROR
        $('.codemirror textarea').each(function(){
            var $this = $(this);
            var codemirror = CodeMirror.fromTextArea(this, {
                mode : ($this.parent().is('.css')) ? 'css' : 'javascript',
                lineNumbers : true,
                indentUnit : 4
            });
            $this.data('codemirror', codemirror);
        });

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


        // COMBO - #tab-faq?customlightbox
        var $combos = $('.combo-link');
        $combos.click(function() {
            var hash = $(this).attr('href');
            var hashless = hash.split('#')[1];
            var queryless = hash.split('?')[0];
            var tab = hashless.split('?')[0];
            var anchor = hashless.split('?')[1];
            var offset = 0;

            // taken from above
            $tabs.removeClass('nav-tab-active').filter('[href="'+hash+'"]').addClass('nav-tab-active');
            $tabContainers.hide().filter(queryless).show();

            // taken from above
            if (anchor !== undefined) {
                offset = $('a[name="' + anchor + '"]').offset().top - 40;
            }
            $('html,body').stop().animate({ scrollTop: offset }, 300);

            return false;
        });


        // WHAT'S NEW TOUR
        /*
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
        */

        // FORM
        var $form = $('#photomosaic-options'),
            $warnings = $form.find('#photomosaic-notes .updated');
            $lb = $form.find('input[name="lightbox"]'),
            $custom_lb = $form.find('input[name="custom_lightbox"]'),
            $custom_lb_name = $form.find('input[name="custom_lightbox_name"]'),
            $custom_lb_params = $form.find('textarea[name="custom_lightbox_params"]'),
            $auto_play = $form.find('textarea[name="auto_play"]'),
            $auto_play_interval = $form.find('textarea[name="auto_play_interval"]'),
            $link_behavior = $form.find('input[name="link_behavior"]:checked'),
            $external_links = $form.find('input[name="external_links"]');
            $height = $form.find('input[name="height"]');
            $prevent_crop = $form.find('input[name="prevent_crop"]');
            $onready_callback = $form.find('textarea[name="onready_callback"]');

        $form.find('input[name="link_behavior"]').change(function () {
            $link_behavior = $(this);
        });

        $form.find(':input').change(function(e) {
            var item = null;
            var target = $(e.target);

            // == ERROR CHECKS ==
            if ($lb[0] === target[0]) {
                if ($lb.is(':checked')) {
                    $custom_lb.removeAttr('checked');
                }
                if ($lb.is(':checked') && $external_links.is(':checked')) {
                    $external_links.removeAttr('checked');
                }
            }

            if ($custom_lb[0] === target[0]) {
                if ($custom_lb.is(':checked')) {
                    $lb.removeAttr('checked');
                }
                if ($custom_lb.is(':checked') && $external_links.is(':checked')) {
                    $external_links.removeAttr('checked');
                }
            }

            if ($external_links[0] === target[0]) {
                if ($external_links.is(':checked') && $lb.is(':checked')) {
                    $lb.removeAttr('checked');
                }
                if ($external_links.is(':checked') && $custom_lb.is(':checked')) {
                    $custom_lb.removeAttr('checked');
                }
            }

            // == WARNINGS ==
            var warnings = [
                {
                    id: 'lightbox-links',
                    test: function() {
                        var isLB = $lb.is(':checked');
                        var isAttachement = $link_behavior.val() === 'attachment';
                        var isCustom = $link_behavior.val() === 'custom';
                        return (isLB && (isAttachement || isCustom));
                    },
                    text: 'Enabling "<strong>Use Default Lightbox</strong>" and setting "<strong>Link To</strong>" to anything other than ' +
                            '"None" causes all links to open in the lightbox.  This includes images, videos, and links to other pages.'
                },
                {
                    id: 'customlightbox-links',
                    test: function() {
                        var isLB = $custom_lb.is(':checked');
                        var isAttachement = $link_behavior.val() === 'attachment';
                        var isCustom = $link_behavior.val() === 'custom';
                        return (isLB && (isAttachement || isCustom));
                    },
                    text: 'Enabling "<strong>Use Custom Lightbox</strong>" and setting "<strong>Link To</strong>" to anything other than ' +
                            '"None" causes all links to open in the lightbox.  This includes images, videos, and links to other pages.' +
                            'Please be sure that your lightbox supports these features.'
                },
                {
                    id: 'preventcrop-height',
                    test: function() {
                        return (
                            $prevent_crop.is(':checked') &&
                            ($height.val() !== "0" && $height.val() !== "auto")
                        );
                    },
                    text: 'Adjusting the <strong>Height</strong> of the mosaic is only possible if images can be cropped.  When ' +
                            '<strong>Prevent Image Cropping</strong> is enabled the <strong>Height</strong> setting is ignored' +
                            'and a value of "0" (auto) is used.'
                }
            ];

            for (var i = 0; i < warnings.length; i++) {
                if (warnings[i].test()) {
                    item = $warnings.find('#' + warnings[i].id);
                    if (item.length === 0) {
                        $warnings.append('<p id="' + warnings[i].id + '">' + warnings[i].text + '</p>');
                    }
                } else {
                    item = $warnings.find('#' + warnings[i].id);
                    if (item.length > 0) {
                        item.remove();
                    }
                }
            };

            // == WARNING DISPLAY ==
            if ($warnings.children().length > 1) {
                $warnings.parent().css('display', 'block');
            } else {
                $warnings.parent().css('display', 'none');
            }
        });

        $form.submit(function(){
            // TODO: make this less half-assed
            var returnState = true,
                $errorContainer = $('#photomosaic-error-list'),
                $errorList = $errorContainer.find('ul').empty().attr('style', '');
                
            if( $lb.is(':checked') && $custom_lb.is(':checked') ) {
                $errorList.append('<li>"Use Default Lightbox" and "Use Custom Lightbox" can\'t both be selected.</li>');
                returnState = false;
            }

            if( $custom_lb.is(':checked') && $custom_lb_params.val().trim() == '' ) {            
                $custom_lb_params.val('{}');
            }
            
            if( $custom_lb.is(':checked') && $custom_lb_name.val().trim() == '' ) {            
                $errorList.append('<li>"Custom Lightbox Name" can\'t be empty.</li>');
                returnState = false;
            }
            
            if( $link_behavior.val() === 'none' ) {
                if ($lb.is(':checked') || $custom_lb.is(':checked')) {
                    $errorList.append('<li>To use a lightbox, "Link To" cannot be set to "None".</li>');
                    returnState = false;
                }
                if ($external_links.is(':checked')) {
                    $errorList.append('<li>To "Open Links in New Window", "Link To" cannot be set to "None".</li>');
                    returnState = false;
                }
            }

            if ( $.trim($onready_callback.val()) == '' ) {
                $onready_callback.val('function($mosaic, $items){\n' +
                    '\t/* your code here */\n' +
                '}');
            }

            if( !returnState ) {
                $errorContainer.css('display', 'block');
                $errorList.prepend('<li class="header">Please fix the following errors</li>');
                scrollTo(0,0);
                return false;
            } else {
                return;
            }
        });
    });
})(jQuery);

<p>
    These settings will be applied to all of your PhotoMosaic galleries.
    You can override any of these settings on a per-instance basis (see the details for each type, shortcode, template tag, and sidebar widget).
    Any options not specified on a shortcode will default the settings chosen here.
</p>

<div id="photomosaic-error-list" class="error below-h2">
    <ul></ul>
</div>

<?php if (isset($_POST['message'])) { ?>
    <div class="updated below-h2">
        <p><?php echo($_POST['message']); ?></p>
    </div>
<?php } ?>

<form method="post" enctype="multipart/form-data" id="photomosaic-options">
    <h3>Layout</h3>
    <div class="set">
        <div class="field">
            <p><label>Width <i>(in pixels)</i></label></p>
            <p><input type="text" name="width" value="<?php echo($options['width']); ?>" /></p>
            <span class="info">set to <b>0</b> for auto-sizing</span>
        </div>
        <div class="field">
            <p><label>Height <i>(in pixels)</label></i></p>
            <p><input type="text" name="height" value="<?php echo($options['height']); ?>" /></p>
            <span class="info">set to <b>0</b> for auto-sizing</span>
        </div>
        <div class="field">
            <p><label>Padding <i>(in pixels)</i></label></p>
            <p><input type="text" name="padding" value="<?php echo($options['padding']); ?>" /></p>
        </div>
        <div class="field">
            <p>
                <label><input name="center" type="checkbox" value="1" <?php if($options['center']) echo "checked='checked'"; ?> /> Center Galleries</label>
            </p>
            <span class="info">causes the Mosaic to center itself to its container</span>
        </div>
    </div>
    <div class="set margin">
        <div class="field">
            <p><label>Columns</label></p>
            <p><input type="text" name="columns" value="<?php echo($options['columns']); ?>" /></p>
            <span class="info">set to <b>0</b> for auto-columns</span>
            <span class="info">auto-columns has PhotoMosaic calculate the optimal number of columns given the number of images in the gallery and the size of its container</span>
            <span class="info">auto-columns is fully responsive</span>
        </div>
    </div>


    <h3>Behavior</h3>
    <div class="set">

        <div class="field double-wide">
            <p>
                <label>Link To...</label>
            </p>
            <fieldset class="radio_group">
                <p>
                    <label>
                        <input type="radio" name="link_behavior" value="image" <?php if($options['link_behavior'] === 'image') echo "checked='checked'"; ?>>
                        Larger Version of Image
                    </label>
                    <span class="info">links point to the unresized version of the image</span>
                </p>
                <p>
                    <label>
                        <input type="radio" name="link_behavior" value="attachment" <?php if($options['link_behavior'] === 'attachment') echo "checked='checked'"; ?>>
                        Image Attachment Page
                    </label>
                    <span class="info"><strong>WP:</strong> links point to the Image Attachment page</span>
                    <span class="info"><strong>NextGen:</strong> not supported, fallsback to the larger version of the image</span>
                </p>
                <p>
                    <label>
                        <input type="radio" name="link_behavior" value="custom" <?php if($options['link_behavior'] === 'custom') echo "checked='checked'"; ?>>
                        Custom URL
                    </label>
                    <span class="info"><strong>WP:</strong> define the image's caption in the "Caption" field and the link URL in the "Description" field</span>
                    <span class="info"><strong>NextGen:</strong> it doesn't matter which of the image's fields ("Alt &amp; Title Text" or "Description") are used for which. PhotoMosaic checks both fields for the URL and, if it finds one, uses the other field for the caption</span>
                    <span class="info">falls back to unresized image if no URLs are found</span>
                </p>
                <p>
                    <label>
                        <input type="radio" name="link_behavior" value="none" <?php if($options['link_behavior'] === 'none') echo "checked='checked'"; ?>>
                        None
                    </label>
                    <span class="info">images will not be links</span>
                </p>
            </fieldset>
        </div>


        <div class="field">
            <p>
                <label><input name="external_links" type="checkbox" value="1" <?php if($options['external_links']) echo "checked='checked'"; ?> /> Open Links in New Window</label>
            </p>
            <span class="info">causes links to open in a new window/tab</span>
        </div>
        <div class="field">
            <p><label>Order</label></p>
            <p>
                <select name="order">
                  <option value="rows" <?php if($options['order'] == 'rows') echo "selected"; ?> >Rows</option>
                  <option value="columns" <?php if($options['order'] == 'columns') echo "selected"; ?> >Columns</option>
                  <option value="masonry" <?php if($options['order'] == 'masonry') echo "selected"; ?> >Masonry</option>
                  <option value="random" <?php if($options['order'] == 'random') echo "selected"; ?> >Random</option>
                </select>
            </p>
            <span class="info">only applies to image sequence direction, not layout (format will still be in columns)</span>
            <span class="info">Masonry places the 'next' image in the first empty position moving down the page</span>
            <span class="info">
<pre>
rows   |  columns |  masonry
1 2 3  |  1 4 7   |  1 2 3
4 5 6  |  2 5 8   |  6 4 5
7 8 9  |  3 6 9   |  7 9 8
</pre>
            </span>
        </div>
    </div>
    <div class="set margin">
        <div class="field">
            <p>
                <label><input name="show_loading" type="checkbox" value="1" <?php if($options['show_loading']) echo "checked='checked'"; ?> /> Show Loading Spinner</label>
            </p>
            <span class="info">displays a "loading gallery..." spinner until the mosaic is ready</span>
        </div>
        <div class="field">
            <p><label>Image Loading Transition</label></p>
            <p>
                <select name="loading_transition">
                    <option value="none" <?php if($options['loading_transition'] == 'none') echo "selected"; ?> >None</option>
                    <option value="fade" <?php if($options['loading_transition'] == 'fade') echo "selected"; ?> > Fade</option>
                    <option value="scale-up" <?php if($options['loading_transition'] == 'scale-up') echo "selected"; ?> >Scale Up</option>
                    <option value="scale-down" <?php if($options['loading_transition'] == 'scale-down') echo "selected"; ?> >Scale Down</option>
                    <option value="slide-up" <?php if($options['loading_transition'] == 'slide-up') echo "selected"; ?> >Slide Up</option>
                    <option value="slide-down" <?php if($options['loading_transition'] == 'slide-down') echo "selected"; ?> >Slide Down</option>
                    <option value="slide-left" <?php if($options['loading_transition'] == 'slide-left') echo "selected"; ?> >Slide Left</option>
                    <option value="slide-right" <?php if($options['loading_transition'] == 'slide-right') echo "selected"; ?> >Slide Right</option>
                    <option value="custom" <?php if($options['loading_transition'] == 'custom') echo "selected"; ?> >Custom</option>
                </select>
            </p>
            <span class="info">a subtle 'arrival' effect on an image after it has been loaded</span>
            <span class="info">uses CSS transforms/transitions (CSS3) - browsers that don't support CSS transitions will fall back to 'fade'</span>
            <span class="info">"custom" adds "transition-custom" class to use as a hook in your own CSS</span>
        </div>
        <div class="field">
            <p>
                <label><input name="responsive_transition" type="checkbox" value="1" <?php if($options['responsive_transition']) echo "checked='checked'"; ?> /> Show Responsive Transition</label>
            </p>
            <span class="info">animates image positions during browser resize</span>
            <span class="info">uses RequestAnimationFrame to prevent pop-in - browsers that don't support RequestAnimationFrame won't see the animation</span>
            </span>
        </div>
        <div class="field">
            <p>
                <label><input name="prevent_crop" type="checkbox" value="1" <?php if($options['prevent_crop']) echo "checked='checked'"; ?> /> Prevent Image Cropping</label>
            </p>
            <span class="info">prevents images from being cropped</span>
            <span class="info">causes the bottom of the mosaic to be uneven / jagged</span>
            <span class="info">causes the <b>height</b> setting to be ignored, uses "auto" instead</span>
        </div>
    </div>

    <h3>Lightbox</h3>
    <div class="set">
        <div class="field">
            <p>
                <label><input name="lightbox" type="checkbox" value="1" <?php if($options['lightbox']) echo "checked='checked'"; ?> /> Use Default Lightbox</label>
            </p>
            <span class="info">displays your photos in a prettyPhoto lightbox when clicked.</span>
            <span class="info">requires that <b>Link To...</b> be set to something other than "None"</span>
        </div>
        <div class="field">
            <p><label>Lightbox REL</label></p>
            <p><input type="text" name="lightbox_rel" value="<?php echo($options['lightbox_rel']); ?>" /></p>
            <span class="info">the string used in the image/link REL attribute (rel="pmlightbox")</span>
            <span class="info">alphanumerics only (a-z, A-Z, 0-9)</span>
            <span class="info">applies to <strong>Default</strong> and <strong>Custom</strong> lightboxes</span>
        </div>
        <div class="field">
            <p>
                <label><input name="lightbox_group" type="checkbox" value="1" <?php if($options['lightbox_group']) echo "checked='checked'"; ?> /> Group Images</label>
            </p>
            <span class="info">allows the lightbox to step through the images in the gallery without having to close between each image</span>
            <span class="info">appends a bracketed string to the <strong>Lightbox REL</strong> (rel="pmlightbox[group1]")</span>
            <span class="info">applies to <strong>Default</strong> and <strong>Custom</strong> lightboxes</span>
        </div>
    </div>

    <div class="set margin message-info">
        <p>Please read the <a class="combo-link" href="#tab-faq?customlightbox">FAQ > How do I use a Custom Lightbox</a> for help integrating PhotoMosaic with your existing lightbox plugin</p>
    </div>

    <div class="set margin">
        <div class="field">
            <p>
                <label><input name="custom_lightbox" type="checkbox" value="1" <?php if($options['custom_lightbox']) echo "checked='checked'"; ?> /> Use Custom Lightbox</label>
            </p>
            <span class="info">allows you to specify your own lightbox and params</span>
        </div>
        <div class="field">
            <p><label>Custom Lightbox Function Name</label></p>
            <p><input type="text" name="custom_lightbox_name" value="<?php echo($options['custom_lightbox_name']); ?>" /></p>
            <span class="info">this is the name of the JS function called to activate your lightbox <br><i>(ie: prettyPhoto, fancybox, fancyZoom, facebox)</i></span>
            <span class="info">capitalization matters</span>
            <span class="info">if you aren't familiar with JavaScript and jQuery, you may need to consult your lightbox plugin's documentation to find this function name</span>
        </div>
        <div class="field">
            <p><label>Custom Lightbox Params</label></p>
            <p><textarea name="custom_lightbox_params"><?php echo($options['custom_lightbox_params']); ?></textarea></p>
            <span class="info">this is a JS object that gets passed into your lightbox function call <br><i>(eg: {theme:'darkness'})</i></span>
            <span class="info">
                if you aren't familiar with JavaScript and jQuery but have the lightbox enabled elsewhere on your site,
                view your page's source and look for something similar to...
                    <br>
                <i>$().lightboxName({
                        <br>&nbsp;&nbsp;&nbsp;
                        option:value,
                        <br>&nbsp;&nbsp;&nbsp;
                        option2:value2
                        <br>
                    });
                </i>
            </span>
        </div>
    </div>

    <div id="photomosaic-notes">
        <div class="updated below-h2">
            <p class="header">FYI</p>
        </div>
    </div>

    <p>
        <input class="button-primary" type="submit" name="photomosaic_save" value="Save Changes" />
    </p>
</form>
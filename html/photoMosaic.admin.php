?>
<div class="wrap">
    <h1>PhotoMosaic</h1>
    <p>
        PhotoMosaic takes advantage of Wordpress' built-in gallery feature.  Simply add the <code>[photomosaic]</code> shortcode to your 
        post/page content and any images attached to that post/page will be displayed as a PhotoMosaic gallery.
    </p>
    <p>Thank you for purchasing PhotoMosaic for Wordpress</p>

    <h2 class="nav-tab-wrapper">
        <a class="nav-tab" href="#tab-form">Global Settings</a>
        <a class="nav-tab" href="#tab-shortcode">Shortcode</a>
        <a class="nav-tab" href="#tab-templatetag">Template Tag</a>
        <a class="nav-tab" href="#tab-widget">Sidebar Widget</a>
    </h2>

    <div class="tab" id="tab-form">
        <p>
            These settings will be applied to all of your <code>[photomosaic]</code> galleries.
            You can override any of these settings on a per-instance basis (see the details for each type, shortcode, template tag, and sidebar widget).
            Any options not specified in an gallery instance will default the settings chosen here.
        </p>
        <form method="post" action="#" enctype="multipart/form-data" id="photomosaic-options">
            <h3 style="clear:both; padding-bottom:5px; margin-bottom:0; border-bottom:solid 1px #e6e6e6">Layout</h3>
            <div style="overflow:hidden;">
                <div style="width:25%;float:left;">
                    <p><label>Width <i>(in pixels)</i></label></p>
                    <p><input type="text" name="width" value="<?php echo($options['width']); ?>" /></p>
                    <span style="font-size:11px; color:#666666;">set to <b>0</b> for auto-sizing</span>
                </div>
                <div style="width:25%;float:left;">
                    <p><label>Height <i>(in pixels)</label></i></p>
                    <p><input type="text" name="height" value="<?php echo($options['height']); ?>" /></p>
                    <span style="font-size:11px; color:#666666;">set to <b>0</b> for auto-sizing</span>
                </div>
                <div style="width:25%;float:left;">
                    <p>
                        <label><input name="center" type="checkbox" value="1" <?php if($options['center']) echo "checked='checked'"; ?> /> Center Galleries</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        causes the Mosaic to center itself to its container
                    </span>
                </div>
            </div>
            <div style="overflow:hidden; margin-top:20px;">
                <div style="width:25%;float:left;">
                    <p><label>Padding <i>(in pixels)</i></label></p>
                    <p><input type="text" name="padding" value="<?php echo($options['padding']); ?>" /></p>
                </div>
                <div style="width:25%;float:left;">
                    <p><label>Columns</label></p>
                    <p><input type="text" name="columns" value="<?php echo($options['columns']); ?>" /></p>
                </div>
                <div style="width:25%;float:left;">
                    <p>
                        <label><input name="auto_columns" type="checkbox" value="1" <?php if($options['auto_columns']) echo "checked='checked'"; ?> /> Auto-Columns</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        causes PhotoMosaic to calculate the optimal number of columns given the number of images in the gallery and the size of its container
                            <br/><br/>
                        ignores the <b>columns</b> setting
                            <br/><br/>
                        the <b>width</b> setting is used as max-width
                    </span>
                </div>
            </div>


            <h3 style="clear:both; padding-bottom:5px; margin-bottom:0; border-bottom:solid 1px #e6e6e6">Behavior</h3>
            <div style="overflow:hidden;">
                <div style="width:20%;float:left;">
                    <p>
                        <label><input name="links" type="checkbox" value="1" <?php if($options['links']) echo "checked='checked'"; ?> /> Image Links</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">wraps images in links that point to the unresized version</span>
                </div>
                <div style="width:20%;float:left;">
                    <p>
                        <label><input name="link_to_url" type="checkbox" value="1" <?php if($options['link_to_url']) echo "checked='checked'"; ?> /> Link to URL</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        causes image links to point to a URL instead of the unresized image
                            <br/><br/>
                        define the link URL in the image description
                            <br/><br/>
                        requires that <b>image links</b> be checked
                    </span>
                </div>
                <div style="width:20%;float:left;">
                    <p>
                        <label><input name="external_links" type="checkbox" value="1" <?php if($options['external_links']) echo "checked='checked'"; ?> /> Open Links in New Window</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        caues image links that point to a URL to open in a new window/tab
                            <br/><br/>
                        requires that <b>image links</b> and <b>link to url</b> be checked
                    </span>
                </div>
                <div style="width:20%;float:left;">
                    <p>
                        <label><input name="random" type="checkbox" value="1" <?php if($options['random']) echo "checked='checked'"; ?> /> Randomize</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">shuffles the image order everytime the page loads</span>
                </div>
                <div style="width:20%;float:left;">
                    <p>
                        <label><input name="force_order" type="checkbox" value="1" <?php if($options['force_order']) echo "checked='checked'"; ?> /> Force Image Order</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">prevents PhotoMosaic from reordering the images</span>
                </div>
            </div>
            <div style="overflow:hidden; margin-top:20px;">
                <div style="width:25%;float:left;">
                    <p>
                        <label><input name="show_loading" type="checkbox" value="1" <?php if($options['show_loading']) echo "checked='checked'"; ?> /> Show Loading Spinner</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">displays a "loading gallery..." spinner until the mosaic is ready</span>
                </div>
                <div style="width:25%;float:left;">
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
                        <a href="#" id="PMtrans">Transition Builder</a>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        a subtle 'arrival' effect on an image after it has been loaded
                            <br/><br/>
                        uses CSS transforms/transitions (CSS3) - non-modern browser behave normally but don't see the effect
                            <br/><br/>
                        "custom" adds "transition-custom" class to use as a hook in your own CSS
                    </span>
                </div>
            </div>

            <h3 style="clear:both; padding-bottom:5px; margin-bottom:0; border-bottom:solid 1px #e6e6e6">Lightbox</h3>
            <div style="overflow:hidden;">
                <div style="width:25%;float:left;">
                    <p>
                        <label><input name="lightbox" type="checkbox" value="1" <?php if($options['lightbox']) echo "checked='checked'"; ?> /> Use Default Lightbox</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        displays your photos in a prettyPhoto lightbox when clicked.
                            <br/><br/>
                        requires that <b>image links</b> be checked
                    </span>
                </div>
                <div style="width:25%;float:left;">
                    <p>
                        <label><input name="custom_lightbox" type="checkbox" value="1" <?php if($options['custom_lightbox']) echo "checked='checked'"; ?> /> Use Custom Lightbox</label>
                    </p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">allows you to specify your own lightbox and params</span>
                </div>
                <div style="width:25%;float:left;">
                    <p><label>Custom Lightbox Name</label></p>
                    <p><input type="text" name="custom_lightbox_name" value="<?php echo($options['custom_lightbox_name']); ?>" /></p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        this is the name of the JS function called to activate your lightbox <br><i>(ie: prettyPhoto, fancybox, fancyZoom, facebox)</i>
                            <br><br>
                        capitalization matters
                            <br><br>
                        if you aren't familiar with JavaScript and jQuery, you may need to consult your lightbox 
                        plugin's documentation to find this function name
                    </span>
                </div>
                <div style="width:25%;float:left;">
                    <p><label>Custom Lightbox Params</label></p>
                    <p><textarea name="custom_lightbox_params"><?php echo($options['custom_lightbox_params']); ?></textarea></p>
                    <span style="font-size:11px; color:#666666; padding:0 30px 0 3px; display:block;">
                        this is a JS object that gets passed into your lightbox function call <br><i>(eg: {theme:'darkness'})</i>
                            <br><br>
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

            <p style="margin-top:30px;"><input class="button-primary" type="submit" name="pm_save" value="Save Changes" /></p>
            <ul id="photomosaic-error-list"></ul>
        </form>
    </div>
    
    <div class="tab" id="tab-shortcode">
        <h3 style="clear:both; padding-bottom:5px; margin:0; border-bottom:solid 1px #e6e6e6">Shortcode : Inline Settings</h3>
        <p>
            The PhotoMosaic shortcode has full support for inline attributes (eg. <code>[photomosaic width="600" height="400" random="1"]</code>). 
            Any inline setting will override the default values set on the "Global Settings" page.  Available settings:
        </p>
        <ul style="list-style:disc; margin:0 0 0 20px;">
            <li><b>id</b> : the post/page id for the desired gallery</li>
            <li><b>nggid</b> : the ID for the desired NextGen gallery</li>
            <li><b>padding</b> : any number <i>(in pixels)</i></li>
            <li><b>columns</b> : any number</li>
            <li><b>width</b> : any number <i>(in pixels)</i></li>
            <li><b>height</b> : any number <i>(in pixels)</i></li>
            <li><b>center</b> : 1 = yes, 0 = no</li>
            <li><b>links</b> : 1 = yes, 0 = no</li>
            <li><b>random</b> : 1 = yes, 0 = no</li>
            <li><b>force_order</b> : 1 = yes, 0 = no</li>
            <li><b>link_to_url</b> : 1 = yes, 0 = no</li>
            <li><b>external_links</b> : 1 = yes, 0 = no</li>
            <li><b>auto_columns</b> : 1 = yes, 0 = no</li>
            <li><b>show_loading</b> : 1 = yes, 0 = no</li>
            <li><b>loading_transition</b> : none, fade, scale-up|down, slide-up|down|left|right, custom</li>
            <li><b>lightbox</b> : 1 = yes, 0 = no</li>
            <li><b>custom_lightbox</b> : 1 = yes, 0 = no</li>
            <li><b>custom_lightbox_name</b> : js function name <i>(eg: prettyPhoto)</i></li>
            <li><b>custom_lightbox_params</b> : js object passed to the above function <i>(eg: {theme:'darkness'})</i></li>
        </ul>
        <p>The PhotoMosaic shortcode also supports the standard WordPress shortcode <b>include</b> and <b>exclude</b> settings.</p>
    </div>
    
    <div class="tab" id="tab-templatetag">
        <h3 style="clear:both; padding-bottom:5px; margin:0; border-bottom:solid 1px #e6e6e6">Template Tag</h3>
        <p>
            PhotoMosaic also supports Wordpress Template Tags (<code>wp_photomosaic()</code>).  This can be added to your theme's
            template files to automatically add a gallery to every page.
        </p>
        <p>The PhotoMosaic template tag accepts an array of the attributes listed above.  For Example:</p>
<pre><code style="display:block">   $atts = array(
'id' => 1,
'columns' => 3
);
wp_photomosaic($atts);</code></pre>
    </div>

    <div class="tab" id="tab-widget">
        <h3 style="clear:both; padding-bottom:5px; margin:0; border-bottom:solid 1px #e6e6e6">Sidebar Widget</h3>
        <p>
            To use PhotoMosaic in your Widget-enabled sidebar simply add a standard text widget and 
            add a <code>[photomosaic]</code> shortcode to the widget's text (exactly as you would in a page or post).
        </p>
    </div>
</div>

    <div id="transformer">
        <div class="cover">
            <img src="images/04.jpg" />
        </div>
        <span class="final"></span>
        <div class="onionskin">
            <img src="images/04.jpg" />
        </div>
        <div class="test">
            <img src="images/04.jpg" />
        </div>
    </div>
<?php
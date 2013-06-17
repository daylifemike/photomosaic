<div class="jumplinks">
    <h3>Contents</h3>
    <ul></ul>
</div>

<h2>FAQ</h2>

<?php
    $questions = array(
        array( 'makepm',          'how-do-i-make-a-pm.md' ),
        array( 'createedit',      'where-do-i-make-a-pm.md' ),
        array( 'whichshortcode',  'different-shortcodes.md' ),
        array( 'globalshortcode', 'global-vs-shortcode.md' ),
        array( 'multiplemosaics', 'multiple-mosaics.md' ),
        array( 'nextgen',         'nextgen-galleries.md' ),
        array( 'stepbystep',      'step-by-step-creation.md' ),
        array( 'customlightbox',  'custom-lightbox.md')
    );
?>
<?php foreach ( $questions as $question ) : ?>
    <div class="question">
        <a name="<?php echo $question[0]; ?>"></a>
        <?php
            // include ( 'faqs/' . $question );
            $text = file_get_contents(  plugins_url('faqs/' . $question[1], __FILE__) );
            echo Markdown($text);
        ?>
    </div>
<?php endforeach; ?>

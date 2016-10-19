<div class="jumplinks">
    <h3>Contents</h3>
    <ul></ul>
</div>

<h2>FAQ</h2>

<?php
    $questions = array(
        array( 'makepm',          'how-do-i-make-a-pm.txt' ),
        array( 'createedit',      'where-do-i-make-a-pm.txt' ),
        array( 'whichshortcode',  'different-shortcodes.txt' ),
        array( 'globalshortcode', 'global-vs-shortcode.txt' ),
        array( 'multiplemosaics', 'multiple-mosaics.txt' ),
        array( 'nextgen',         'nextgen-galleries.txt' ),
        array( 'stepbystep',      'step-by-step-creation.txt' ),
        array( 'categoryposts',   'category-posts.txt' ),
        array( 'recentposts',     'recent-posts.txt' ),
        array( 'customlightbox',  'custom-lightbox.txt'),
        array( 'stretchedimages', 'stretched-images.txt')
    );
?>
<?php foreach ( $questions as $question ) : ?>
    <div class="question">
        <a name="<?php echo $question[0]; ?>"></a>
        <?php
            $text = file_get_contents( dirname(__file__) . '/faqs/' . $question[1] );
            echo Markdown($text);
        ?>
    </div>
<?php endforeach; ?>

<div class="question">
    <a name="phpversion"></a>
    <h3 class="title">Which version of PHP am I running?</h3>
    <p><?php echo PHP_VERSION; ?></p>
</div>

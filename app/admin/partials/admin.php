<?php /**/ ?>
<script>
    if (!window.PhotoMosaic) {
        window.PhotoMosaic = {};
    }
</script>
<div class="wrap photomosaic">
    <h1>PhotoMosaic v<?php echo $this->version; ?></h1>
    <?php
        $tabs = array(
            // display name, id, file
            array('Global Settings',   'form',        'global-settings.php'),
            array('How To Use',        'usage',       'usage.txt'),
            array('Inline Attributes', 'inlineattrs', 'inline-attributes.txt'),
            array('FAQ',               'faq',         'faq.php'),
            array("What's New",        'whatsnew',    'whatsnew.txt')
        );
    ?>
    <h2 class="nav-tab-wrapper">
        <?php foreach ($tabs as $tab) : ?>
            <a class="nav-tab" href="#tab-<?php echo $tab[1]; ?>">
                <?php echo $tab[0]; ?>
            </a>
        <?php endforeach; ?>
    </h2>

    <?php foreach ($tabs as $tab) : ?>
        <div class="tab" id="tab-<?php echo $tab[1]; ?>">
            <?php
                if ( strpos($tab[2], '.txt') === false) {
                    include( $tab[2] );
                } else {
                    $text = file_get_contents( dirname(__file__) . '/' . $tab[2] );
                    echo Markdown($text);
                }
            ?>
        </div>
    <?php endforeach; ?>

</div>

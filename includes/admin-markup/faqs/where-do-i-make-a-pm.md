### Where do I create/edit my galleries? {.title}

In Wordpress, "galleries" don't exist in a strict sense.  They don't need to be configured in a seperate workflow and then added to your post (a la the NextGen Galleries plugin).  Instead, any images uploaded to a post (via the "Add Media" button) are automatically attached to that post.  If an image has been uploaded via the Media Library, it can also manually attached to a post in the Media Library.  A "gallery" is all of the images attached to a post.

Before WPv3.5, you could access a "gallery" in one of three ways:

1. the images attached to a post :
	- `[gallery]` = the current post
	- `[gallery id="1"]` = the post with ID=1
2. only the images listed on the shortcode : `[gallery includes="1,2,3,4,5"]`
3. the images attached to a post with exceptions : `[gallery exclude="1,2,3"]` (assumes we are excluding from images attached to the current post)

In WPv3.5, the Wordpress Team changed the workflow for creating a "gallery".  While the `[gallery]` shortcode will still honor all of the pre-3.5 methods, using the new "Create Gallery" tool will generate a shortcode with a list of images to be used (`[gallery ids="1,2,3,4,5"]`).  This method is similar to the old "include" method in that it ignores any images attached to the post.

Any `[gallery]` shortcodes generated using the "Create Gallery" tool are managed by editing the shortcode itself.

You can read more about the `[gallery]` shortcode at the [Wordpress Codex :: Gallery Shortcode](http://codex.wordpress.org/Gallery_Shortcode).

See [Where can I get step-by-step instructions for making a gallery](#stepbystep) if you need explicit help.
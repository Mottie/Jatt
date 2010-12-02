**Features**

* Dynamic tooltip modifications can be done using metadata (see this [demo][1]).
* Choose the tooltip direction (8 directions: n, ne, e, se, s, sw, w & nw).
* Tooltip content obtained from selected object attribute, a different object on the same page, or via ajax.
* Ajax calls can include jquery selectors to target specific page content.
* Screenshots of webpages can be obtained through Websnapr.com or from your own image.
* Preview & Screenshot images are preloaded.

**Usage & Options (defaults)**

[See more detailed documentation][2].

Script:

    $.jatt({
     // options that can be modified by metadata
     direction   : 'n',     // direction of tooltip
     followMouse : true,    // tooltip follows mouse movement
     content     : 'title', // attribute containing tooltip text
     speed       : 300,     // tooltip fadein speed
     local       : false,   // if true, the script attachs the tooltip locally; if false, the tooltip is added to the body
     xOffset     : 20,      // x distance from mouse (no negative values)
     yOffset     : 20,      // y distance from mouse (no negative values)
     zIndex      : 1000,    // z-index of tooltip

     // options not supported by metadata
     live        : false,                 // use live event support?
     metadata    : 'class',               // attribute that contains the metadata, use "false" (no quotes) to disable the metadata.
     activate    : 'mouseenter focusin',  // how tooltip is activated
     deactivate  : 'mouseleave focusout', // how tooltip is deactivated
     cacheData   : true,                  // Cache data obtained from external pages, set to false if the data is dynamic.

     // Messages
     loading        : 'Loading...',       // Message shown while content is loading
     notFound       : 'No tooltip found', // Message shown when no tooltip content is found
     imagePreview   : 'Image preview',    // image alt message for the image shown in the preview tooltip
     siteScreenshot : 'URL preview: ',    // image alt message for site screenshots, this message is followed by the URL

     // change tooltip, screenshot and preview class
     tooltip        : '.tooltip',         // tooltip class (include period ".")
     screenshot     : 'a.screenshot',     // screenshot class (include period ".")
     preview        : 'a.preview',        // preview class (include period ".")
     preloadContent : '.preload',          // Add this class to preload tooltip content (not preview or screenshot; also include the "." in front).

     // tooltip & preview ID (div that contains the tooltip)
     tooltipId   : 'tooltip',             // ID of actual tooltip (do not include the "#" in front)
     previewId   : 'preview'              // ID of screenshot/preview tooltip (do not include the "#" in front)
    });

HTML examples (see more in the provided [demo pages][3]):

    <a class="tooltip {direction:n; width:100px;}" href="http://www.url.com" title="Tooltip Content">Displayed text</a>
    <a class="preview {direction:e; text-align:center;}" href="google2.jpg" title="Google's Logo"><img src="google1.jpg" /></a>
    <a class="screenshot {direction:e;}" href="http://www.google.com/" rel="#" title="<center>Google</center>">Google</a>

**Changelog**

Version 2.7 (12/2/2010)

* Added a `preloadContent` option which contains the class to trigger tooltip content to preload from an external page.
    * This change was necessary for tooltips with direction set to 'n' (north) because when the content is added, it stretches the tooltip down and under the mouse causing the tooltip link to trigger a `mouseleave` event closing the tooltip. Then the user must move the mouse to trigger the `mouseover` event to open the tooltip again. And we all know how none of use like things that flicker. Whew.
    * Also note that the tooltip element itself must have the preload class. So using '.tooltips a' would not trigger the preloads.
    * If you want to preload all the tooltip content, then just set the `preloadContent` to the same class as `tooltip`.
* Fixed preloading image script, so now the Websnapr image does preload.

Version 2.6 (11/19/2010)

* Added content preload (for external pages) for tooltips.
* Added more options to allow modification of messages - in case you want to use a different language ;)
* Separated image preview and screenshot scripts to work properly if the `screenshot` or `preview` class is made to target tags without the class (e.g. '.previews a')

Version 2.5 (11/19/2010)

* Added image preload for preview and screenshot tooltips to fix tooltip positioning issues, but this doesn't seem to work for Websnapr images.

Version 2.4 (11/7/2010)

* Fixed a problem that was only occuring in IE - undefined variable error.
* Cleaned up the code a bit and tried to fix other potential problems.

Version 2.3 (10/12/2010)

* Added github pages
* Changed object cloning method - now using jQuery method

Version 2.2 (10/3/2010)

* Added support for old tooltip script (css contained in rel attribute)

Version 2.1 (8/24/2010)

* Convert script into a plugin.
* Added Metadata - can modify tooltip css and script options.
* Added tooltip positioning - tooltips will display in a specific direction.
* Added additional contents sources - can be obtained from external pages (domains if you use James Padolsey's included script).
* Removed dhtmltooltip support, but the commented code was left in, in case someone still needs it.

Version 2.0.1 (8/29/2009)

* Added Websnapr.com support to the screenshot script.

Version 2.0 (6/10/2009)

* Combined the three original scripts by Alen Grakalic.
* Added support for dhtmltooltip.

Version 1.0 (5/8/2008)

* Original tooltip script by Alen Grakalic.

  [1]: http://mottie.github.com/Jatt/demo-metadata.htm
  [2]: http://mottie.github.com/Jatt/index.html
  [3]: http://mottie.github.com/Jatt/demo-more-examples.htm

**Features**

* Dynamic tooltip modifications can be done using metadata (see this [demo][1]).
* Choose the tooltip direction (8 directions: n, ne, e, se, s, sw, w & nw).
* Tooltip content obtained from selected object attribute, a different object on the same page, or via ajax.
* Ajax calls can include jquery selectors to target specific page content.
* Screenshots of webpages can be obtained through Websnapr.com or from your own image.

**Usage & Options (defaults)**

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

     // change tooltip, screenshot and preview class
     tooltip     : '.tooltip',            // tooltip class 
     screenshot  : 'a.screenshot',        // screenshot class
     preview     : 'a.preview',           // preview class

     // tooltip & preview ID (div that contains the tooltip)
     tooltipId   : 'tooltip',             // ID of actual tooltip
     previewId   : 'preview'              // ID of screenshot/preview tooltip 
    });

HTML examples (see more in the provided demo pages):

    <a class="tooltip {direction:n; width:100px;}" href="http://www.url.com" title="Tooltip Content">Displayed text</a>
    <a class="preview {direction:e; text-align:center;}" href="google2.jpg" title="Google's Logo"><img src="google1.jpg" /></a>
    <a class="screenshot {direction:e;}" href="http://www.google.com/" rel="#" title="<center>Google</center>">Google</a>

**Changelog**

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

  [1]: https://dl.dropbox.com/u/1510510/jquery-jatt/demo-metadata.htm
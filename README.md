# Features

* Dynamic tooltip modifications can be done using metadata (see this [demo](http://mottie.github.com/Jatt/meta.html)).
* Choose the tooltip direction (8 directions: n, ne, e, se, s, sw, w & nw).
* Tooltip content obtained from selected object attribute, a different object on the same page, or via ajax.
* Ajax calls can include jQuery selectors to target specific page content.
* Screenshots of webpages can be obtained through thumbalizr.com or from your own image.
* Preview & Screenshot images are preloaded.
* Check out the various demos: [main](http://mottie.github.com/Jatt/index.html), [meta data](http://mottie.github.com/Jatt/meta.html)
 and [more examples](http://mottie.github.com/Jatt/examples.html).

## Dependencies

* jQuery v1.7+

## Usage & Options (defaults)

[See more detailed documentation](http://mottie.github.com/Jatt/index.html).

### Script:

```javascript
$.jatt({
  // options that can be modified by metadata
  direction   : 'n',     // direction of tooltip
  followMouse : true,    // tooltip follows mouse movement
  content     : 'title', // attribute containing tooltip text
  speed       : 300,     // tooltip fadein speed
  local       : false,   // if true, the script attaches the tooltip locally; if false, the tooltip is added to the body
  xOffset     : 20,      // x distance from mouse (no negative values)
  yOffset     : 20,      // y distance from mouse (no negative values)
  zIndex      : 1000,    // z-index of tooltip

  // options not supported by metadata
  metadata       : 'class',               // attribute that contains the metadata, use "false" (no quotes) to disable the metadata.
  activate       : 'mouseenter focusin',  // how tooltip is activated
  deactivate     : 'mouseleave focusout', // how tooltip is deactivated
  cacheData      : true,                  // Cache data obtained from external pages, set to false if the data is dynamic.
  websitePreview : 'http://api1.thumbalizr.com/?width=250&url=', // use your own custom thumbnail service (api string - http://www.thumbalizr.com/apitools.php)

  // Callbacks
  initialized    : null,               // occurs when the tooltip is called - when hovering over an object
  beforeReveal   : null,               // occurs when the tooltip is fully formed, but still hidden
  revealed       : null,               // occurs when the tooltip is revealed
  hidden         : null,               // occurs when the tooltip is hidden (removed)

  // Messages
  loading        : 'Loading...',       // Message shown while content is loading
  notFound       : 'No tooltip found', // Message shown when no tooltip content is found
  imagePreview   : 'Image preview',    // image alt message for the image shown in the preview tooltip
  siteScreenshot : 'URL preview: ',    // image alt message for site screenshots, this message is followed by the URL

  // change tooltip, screenshot and preview class - note that all classes have a "." in front
  tooltip        : '.tooltip',         // tooltip class (include period ".")
  screenshot     : 'a.screenshot',     // screenshot class (include period ".")
  preview        : 'a.preview',        // preview class (include period ".")
  preloadContent : '.preload',         // Add this class to preload tooltip content (not preview or screenshot).
  sticky         : '.sticky',          // Add this class to make a tooltip sticky. Only one tooltip on the screen at a time though.

  // tooltip & preview ID (div that contains the tooltip)
  tooltipId      : 'tooltip',          // ID of actual tooltip (do not include the "#" in front)
  previewId      : 'preview'           // ID of screenshot/preview tooltip (do not include the "#" in front)
});
```

### HTML examples (see more in the provided [demo pages](http://mottie.github.com/Jatt/examples.html)):

```html
<a class="tooltip {direction:n; width:100px;}" href="http://www.url.com" title="Tooltip Content">Displayed text</a>
<a class="preview {direction:e; text-align:center;}" href="google2.jpg" title="Google's Logo"><img src="google1.jpg" /></a>
<a class="screenshot {direction:e;}" href="http://www.google.com/" rel="#" title="<center>Google</center>">Google</a>
```

## Recent Changes

Only the latest changes will be shown below, see the [full change log](https://github.com/Mottie/Jatt/wiki) to view older versions.

### Version 2.8.6 (9/16/2012)

* Fixed an issue with preloading a non-existent image. Also from [issue #1](https://github.com/Mottie/Jatt/issues/1).

### Version 2.8.5 (4/18/2012)

* Fixed an error that occurrs when no preload images are found. Fix for [issue #1](https://github.com/Mottie/Jatt/issues/1).

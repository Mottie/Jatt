/*
 * Jatt - just another tooltip v2.7
 * http://github.com/Mottie/Jatt
 * by Rob Garrison (aka Mottie)
 *
 * based on tooltip by Alen Grakalic (http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery)
 * tooltip modification by Rob G, aka Mottie (http://wowmotty.blogspot.com/)
 *
 */

(function($){
 $.jatt = function(options){

  // options
  var opt, process, cache = [],
   pageBody = $('body'),
   o = $.extend({},$.jatt.defaultOptions, options),

  init = function(){
   // event type
   var evt = (o.live) ? 'live' : 'bind',
    preloads = [];

   // *** Tooltips ***
   $(o.tooltip)
    [evt](o.activate,function(e){
     var tmp, tt, rel,
      url, ttloader, ttl,
      $obj = $(this),
      meta = (o.metadata.toString() == 'false') ? [o, ''] : $.jatt.getMeta($obj);
     opt = meta[0]; // meta options
     tt = ($obj.attr(opt.content) === '') ? $obj.data('tooltip') || '' : $obj.attr(opt.content) || '';
     rel = $obj.attr('rel') || '';
     url = $obj.attr('href') || '';
     $obj.data('tooltip', tt);
     $obj.attr('title', ''); // clear title to stop default tooltip

     // build tooltip & styling from metadata
     tmp = '<div id="' + o.tooltipId + '" style="position:absolute;z-index:' + opt.zIndex + ';' + meta[1] + '"></div>';
     if (opt.local){
      $obj.before(tmp);
     } else {
      pageBody.append(tmp);
     }

     // Load tooltip content from an object on the page
     if (tt === ''){
      if (rel !== '') {
       tt = $(rel).html() || o.notFound;
      } else if (url !== '') {
       tt = o.loading;
       // Load tooltip from external page
       ttloader = $('<div />');
       ttloader.load(url, function(){
        ttl = ttloader.html();
        cache = (o.cacheData) ? ttl : '';
        $('#' + o.tooltipId)
         .hide() // hiding to prevent contents popping up under the mouse and triggering a close event, or it should o.O
         .html( ttl );
        $obj.data('tooltip', cache ); // save data for next load
        $.jatt.ttrelocate(e, o.tooltipId);
        $('#' + o.tooltipId).show();
       });
      }
     }

     $('#' + o.tooltipId).html(tt).data('options', opt);
     $.jatt.ttrelocate(e, o.tooltipId);
     $('#' + o.tooltipId).fadeIn(opt.speed);
    })
    [evt](o.deactivate,function(e) {
     $.jatt.removeTooltips();
    })
    [evt]('mousemove',function(e) {
     if ($('#' + o.tooltipId).length && opt.followMouse) { $.jatt.ttrelocate(e, o.tooltipId); }
    });

   // *** Process image & URL screenshot previews ***
   process = function(e, $obj, content){
    var tt, tmp, meta = (o.metadata.toString() == 'false') ? [o, ''] : $.jatt.getMeta($obj);
    opt = meta[0];
    tt = ($obj.attr(opt.content) === '') ? $obj.data('tooltip') || '' : $obj.attr(opt.content) || '';
    $obj.data('tooltip', tt);
    if (opt.content == 'title') { $obj.attr(opt.content, ''); } // leave title attr empty
    tmp = '<div id="' + o.previewId + '" style="position:absolute;z-index:' + opt.zIndex + ';' + meta[1] + '"><img src="' + content;
    tmp += (tt !== '') ? '<br/>' + tt + '</div>' : '</div>';
    if (opt.local){
     $obj.before(tmp);
    } else {
     pageBody.append(tmp);
    }
    $('#' + o.previewId)
     .hide()
     .data('options', opt)
     .fadeIn(opt.speed);
    $.jatt.ttrelocate(e, o.previewId);
   };

   // *** Image preview ***
   $(o.preview)
    [evt](o.activate,function(e){
     process( e, $(this), $(this).attr('href') + '" alt="' + o.imagePreview +'" />');
    })
    // preload images/screenshots
    .each(function(){
     preloads.push( $(this).attr('href') );
    });
    
   // *** Screenshot preview ***
   $(o.screenshot)
    [evt](o.activate,function(e){
     var $obj = $(this),
      /* use websnapr.com to get website thumbnail preview if rel="#" */
      ss = ($obj.attr('rel') == '#') ? 'http://images.websnapr.com/?url=' + $obj.attr('href') : $obj.attr('rel');
     ss += '" alt="' + o.siteScreenshot + $obj.attr('href') + '" />';
     process( e, $obj, ss );
    })
    // preload screenshots
    .each(function(){
     var $obj = $(this);
     preloads.push( ($obj.attr('rel') == '#') ? 'http://images.websnapr.com/?url=' + $obj.attr('href') : $obj.attr('rel') );
    });

    // *** combined preview & screenshot ***
    $(o.preview + ',' + o.screenshot)
    [evt](o.deactivate,function(e){
     $.jatt.removeTooltips();
    })
    [evt]('mousemove',function(e){
     if ($('#' + o.previewId).length && opt.followMouse) { $.jatt.ttrelocate(e, o.previewId); }
    });

    $.jatt.preloadContent(preloads);

  }; // end init

  $.jatt.ttrelocate = function(e, ttid){
   var win = $(window),
    tt = $('#' + ttid),
    ttw = tt.outerWidth(),
    tth = tt.outerHeight(),
    opt = tt.data('options') || o,
    // [ top left x, top left y, bottom right x, bottom right y ]
    tip = {
     e  : [ opt.xOffset, -tth/2, ttw+opt.xOffset, tth/2 ],
     se : [ opt.xOffset, opt.yOffset, ttw+opt.xOffset, tth+opt.yOffset ],
     s  : [ -ttw/2, opt.yOffset, ttw/2, tth+opt.yOffset ],
     sw : [ -ttw-opt.xOffset, opt.yOffset, -opt.xOffset, tth+opt.yOffset ],
     w  : [ -ttw-opt.xOffset, -tth/2, -opt.xOffset, tth/2 ],
     nw : [ -ttw-opt.xOffset, -tth-opt.yOffset, -opt.xOffset, -opt.yOffset ],
     n  : [ -ttw/2, -tth-opt.yOffset, ttw/2, -opt.yOffset ],
     ne : [ opt.xOffset, -tth-opt.yOffset, ttw+opt.xOffset, -opt.yOffset ]
    },
    dir = tip[opt.direction],
    wscrY = win.scrollTop(),
    wscrX = win.scrollLeft(),
    // use $(e.target).position() if the link gets focus.
    tar = $(e.target),
    curX = e.pageX || tar.position().left + tar.width()/2,
    curY = e.pageY || tar.position().top + tar.height()/2;

   // if not following mouse, then find sides of the object
   if (!opt.followMouse) {
    var objw = tar.outerWidth(),
     objh = tar.outerHeight(),
     obj = {
      e  : [ objw, objh/2 ],
      se : [ objw, objh ],
      s  : [ objw/2, objh ],
      sw : [ 0, objh ],
      w  : [ 0, objh/2 ],
      nw : [ 0, 0 ],
      n  : [ objw/2, 0 ],
      ne : [ objw, 0 ]
     };
    curX = tar.offset().left + obj[opt.direction][0];
    curY = tar.offset().top + obj[opt.direction][1];
   }
   var ttleft = curX + dir[0],
       tttop = curY + dir[1];

   // some basic repositioning if the tooltip is out of the viewport
   if ( curX + dir[2] > wscrX + win.width() - opt.xOffset ) { ttleft = win.width() - ttw - opt.xOffset; }
   if ( curY + dir[3] > wscrY + win.height() - opt.yOffset ) { tttop = curY - tth - opt.yOffset; }
   if ( ttleft < wscrX + opt.xOffset ) { ttleft = wscrX + opt.xOffset; }
   if ( tttop < wscrY + opt.yOffset ) {  tttop = curY + opt.yOffset; }

   // prevent mouse from being inside tooltip & cause a flicker on mouse move
   if ( curX > ttleft && curX < ttleft + ttw && curY > tttop && curY < tttop + tth ) {
    tttop += ( (tttop - tth/2 - opt.yOffset) < wscrY + opt.yOffset ) ? tth/2 + opt.yOffset : -tth/2 - opt.yOffset;
   }

   tt.css({ left : ttleft + 'px', top : tttop + 'px' });
  };

  $.jatt.getMeta = function(el){
   opt = $.extend({}, o);
   var t, m = [], meta = el.attr(o.metadata).match(/(\{.*\})/g) || '';
   if (meta !== '') {
    var opts = 'direction|followMouse|content|speed|local|xOffset|yOffset|zIndex';
    meta = meta[0].replace(/(\{|\'|\"|\})/g,''); // remove curly brackets, spaces, apostrophes and quotes
    if (meta.match(opts)) {
     // split out tooltip options, assume everything else is css
     $.each( meta.split(';'), function(i,val){
      t = val.split(':');
      if (t[0].match(opts)) {
       var k = $.trim(t[0]), v = $.trim(t[1]);
       if (v == 'true' || v == 'false') {
        opt[k] = (v == 'true') ? true : false;
       } else {
        opt[k] = (isNaN(v)) ? v : parseFloat(v);
       }
      } else {
       m.push(val);
      }
     });
     meta = m.join(';');
    }
   }
   // ***** remove once transition is complete *****
   // Check & add retro tooltip settings (contained in the "rel" attribute)
   // rel="100,#222;color:#ddd;" => "width,background:#222,color:#ddd;etc"
   // Not going to bother with the tooltip external object flag "###"
   t = el.attr('rel') || '';
   // ignore rel contents if it starts with a "#" or "." (external content), or contains a "/" (screenshot tooltips)
   if (t !== '' && !/^[#|\.]|[\/]/.test(t)) {
    t = t.split(',');
    meta += ';width:' + t[0] + 'px;';
    if (typeof(t[1]) != 'undefined') { meta += 'background:' + t[1]; }
    // ***** end retro tooltip code *****
   }
   return [opt, meta];
  };

  // Remove all tooltips, and any extras that might appear
  // (focusout doesn't seem to work)
  $.jatt.removeTooltips = function(){
   $('#' + o.previewId + ', #' + o.tooltipId).remove();
   while ($('#' + o.previewId + ', #' + o.tooltipId).length > 0) {
    $('#' + o.previewId + ', #' + o.tooltipId).remove();
   }
  };

  // Preload Content
  $.jatt.preloadContent = function(preloads) {
    var cacheImage, $this, $div, url,
     divs = [],
     $tt = $(o.tooltip),
     len = preloads.length;
    // preload images code modified from http://engineeredweb.com/blog/09/12/preloading-images-jquery-and-javascript
    for (var i = len; i--;) {
//     console.debug('preloading image: ' + preloads[i]);
     cacheImage = document.createElement('img');
     cacheImage.src = preloads[i];
     cache.push(cacheImage);
    }
    // preload external content
    $tt.each(function(i){
     $this = $(this);
     // look for preload content class
     if ( this.tagName == 'A' && $this.is(o.preloadContent) ) {
      url = $(this).attr('href') || '';
      if ( url !== '' && !url.match(/^#/) ) {
       // Load tooltip from external page
//       console.debug('preloading content: ' + url);
       $div = $('<div rel="' + i + '" />');
       divs.push($div);
       $div.load(url, function(){
        $tt.eq( $div.attr('rel') ).data('tooltip', $div.html() );
       });
      }
     }
    });
  };

  // Run initializer
  init();
 };

 $.jatt.defaultOptions = {
  // options that can be modified by metadata
  direction      : 'n',     // direction of tooltip
  followMouse    : true,    // tooltip follows mouse movement
  content        : 'title', // attribute containing tooltip text
  speed          : 300,     // tooltip fadein speed
  local          : false,   // if true, the script attachs the tooltip locally; if false, the tooltip is added to the body
  xOffset        : 20,      // x distance from mouse (no negative values)
  yOffset        : 20,      // y distance from mouse (no negative values)
  zIndex         : 1000,    // z-index of tooltip

  // options not supported by metadata
  live           : false,                 // use live event support?
  metadata       : 'class',               // attribute that contains the metadata, use "false" (no quotes) to disable the metadata.
  activate       : 'mouseenter focusin',  // how tooltip is activated
  deactivate     : 'mouseleave focusout', // how tooltip is deactivated
  cacheData      : true,                  // Cache data obtained from external pages, set to false if the data is dynamic.

  // Messages
  loading        : 'Loading...',          // Message shown while content is loading
  notFound       : 'No tooltip found',    // Message shown when no tooltip content is found
  imagePreview   : 'Image preview',       // image alt message for the image shown in the preview tooltip
  siteScreenshot : 'URL preview: ',       // image alt message for site screenshots, this message is followed by the URL

  // change tooltip, screenshot and preview class
  tooltip        : '.tooltip',            // tooltip class
  screenshot     : 'a.screenshot',        // screenshot class
  preview        : 'a.preview',           // preview class
  preloadContent : '.preload',            // Add this class to preload tooltip content (not preview or screenshot).

  // tooltip & preview ID (div that contains the tooltip)
  tooltipId      : 'tooltip',             // ID of actual tooltip
  previewId      : 'preview'              // ID of screenshot/preview tooltip 
 };

})(jQuery);

 // Convert ddrivetip functions (http://www.dynamicdrive.com/dynamicindex5/dhtmltooltip.htm)
 // to work with this tooltip, if it exists - commented out, but left in place just in case someone still needs it

 /*
 ddrivetip = function(ttt,ttc,ttw){
  // if only a color is defined, add background-color in front, otherwise just add it to the css
  ttc = (ttc === '') ? '' : (ttc.match(':')) ? ttc : 'background-color:' + ttc;
  jQuery('body').append("<div id='tooltip2' style='position:absolute;z-index:1000;width:" + ttw + "px;" + ttc + "'>" + ttt + "</div>");
  jQuery('#tooltip2').fadeIn();
 }
 function hideddrivetip(){
  jQuery('#tooltip2').remove();
 }
 function positiontip(e){
  if (document.getElementById('tooltip2') !== null) { jQuery.jatt.ttrelocate(e,'tooltip2'); }
 }
 document.onmousemove = positiontip;
 */

/*
 * Jatt - just another tooltip v2.3 (10/10/2010)
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
  var opt, o = $.extend({},$.jatt.defaultOptions, options);

  var init = function(){
   // event type
   var evt = (o.live) ? 'live' : 'bind';

   // Tooltips
   $(o.tooltip)
    [evt](o.activate,function(e){
     var $obj = $(this),
         meta = (o.metadata.toString() == 'false') ? [o, ''] : $.jatt.getMeta($obj);
     opt = meta[0]; // meta options
     var tt = ($obj.attr(opt.content) === '') ? $obj.data('tooltip') || '' : $obj.attr(opt.content) || '',
         rel = $obj.attr('rel') || '',
         url = $obj.attr('href') || '';
     $obj.data('tooltip', tt);
     $obj.attr('title', ''); // clear title to stop default tooltip

     // build tooltip & styling from metadata
     var tmp = '<div id="' + o.tooltipId + '" style="position:absolute;z-index:' + opt.zIndex + ';' + meta[1] + '"></div>';
     if (opt.local){
      $obj.before(tmp);
     } else {
      $('body').append(tmp);
     }

     // Load tooltip content from an object on the page
     if (tt === ''){
      if (rel !== '') {
       tt = $(rel).html() || 'No tooltip found';
      } else if (url !== '') {
       tt = 'Loading...';
       // Load tooltip from external page
       var ttloader = $('<div />');
       ttloader.load(url, function(){
        $('#' + o.tooltipId).html( ttloader.html() );
       });
      }
     }

     $('#' + o.tooltipId).html(tt).data('options', opt);
     $.jatt.ttrelocate(e, o.tooltipId);
     $('#' + o.tooltipId).fadeIn(opt.speed);
    })
    [evt](o.deactivate,function(e) {
     $('#' + o.tooltipId).remove();
    })
    [evt]('mousemove',function(e) {
     if ($('#' + o.tooltipId).length && opt.followMouse) { $.jatt.ttrelocate(e, o.tooltipId); }
    });

   // Image & URL screenshot preview
   $(o.preview + ',' + o.screenshot)
    [evt](o.activate,function(e){
     var $obj = $(this),
      meta = (o.metadata.toString() == 'false') ? [o, ''] : $.jatt.getMeta($obj);
     opt = meta[0];
     var tt = ($obj.attr(opt.content) === '') ? $obj.data('tooltip') || '' : $obj.attr(opt.content) || '';
     $obj.data('tooltip', tt);
     if (opt.content == 'title') { $obj.attr(opt.content, ''); } // leave title attr empty
     var tmp = '<div id="' + o.previewId + '" style="position:absolute;z-index:' + opt.zIndex + ';' + meta[1] + '"><img src="',
      c = (tt !== '') ? '<br/>' + tt : '',
      /* use websnapr.com to get website thumbnail preview if rel="#" */
      ss = ($obj.is(o.screenshot) && $obj.attr('rel') == '#') ? 'http://images.websnapr.com/?url=' + $obj.attr('href') : $obj.attr('rel');
     tmp += ($obj.is(o.preview)) ? $obj.attr('href') + '" alt="Image preview" />' : ss + '" alt="URL preview: ' + $obj.attr('href') + '" />';
     tmp += c + '</div>';
     if (opt.local){
      $obj.before(tmp);
     } else {
      $('body').append(tmp);
     }
     $('#' + o.previewId).data('options', opt);
     $.jatt.ttrelocate(e, o.previewId);
     $('#' + o.previewId).fadeIn(opt.speed);
    })
    [evt](o.deactivate,function(e){
     $('#' + o.previewId).remove();
    })
    [evt]('mousemove',function(e){
     if ($('#' + o.previewId).length && opt.followMouse) { $.jatt.ttrelocate(e, o.previewId); }
    });

  }; // end init

  $.jatt.ttrelocate = function(e, ttid){
   var win = $(window),
    tt = $('#' + ttid),
    ttw = tt.outerWidth(),
    tth = tt.outerHeight(),
    opt = tt.data('options'),
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
    curX = e.pageX,
    curY = e.pageY;

   // if not following mouse, then find sides of the object
   if (!opt.followMouse) {
    var tar = $(e.target),
     objw = tar.outerWidth(),
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

  // Run initializer
  init();
 };

 $.jatt.defaultOptions = {
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

  // change tooltip, screenshot and preview class
  tooltip        : '.tooltip',            // tooltip class 
  screenshot     : 'a.screenshot',        // screenshot class
  preview        : 'a.preview',           // preview class
  
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

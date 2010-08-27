/*
 * Jatt - just another tooltip
 * by Rob Garrison (aka Mottie)
 *
 * based on tooltip by Alen Grakalic (http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery)
 * tooltip modification by Rob G, aka Mottie (http://wowmotty.blogspot.com/)
 *
 * v2.1  8/22/2010 Converted to a plugin, added enhancements & commented out dhtmltooltip script
 * v2.01 8/29/2009 Added Websnapr.com site screenshot option
 * v2.0  6/10/2009 Combined scripts, added support for dhtmltooltip
 * v1.0  5/8/2008  Original tooltip script by Alen Grakalic
 */

// clone object:  http://stackoverflow.com/questions/728360/copying-an-object-in-javascript/728694#728694
function objClone(obj) {
 if (null === obj || "object" != typeof obj) { return obj; }
 var copy = obj.constructor();
 for (var attr in obj) {
  if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
 }
 return copy;
}

(function($){

 $.jatt = function(options){

  // options
  var opt, o = $.extend({},$.jatt.defaultOptions, options);

  var init = function(){

   // event type
   var evt = (o.live) ? 'live' : 'bind';

   // Tooltips
   $('.' + o.tooltip)
    [evt](o.activate,function(e){
     var obj = $(this),
         meta = (o.metadata.toString() == 'false') ? [o, ''] : $.jatt.getMeta(obj);
     opt = meta[0]; // meta options
     var tt = (obj.attr(opt.content) === '') ? obj.data('tooltip') || '' : obj.attr(opt.content) || '',
         rel = obj.attr('rel') || '',
         url = obj.attr('href') || '';
     obj.data('tooltip', tt);
     obj.attr('title', ''); // clear title to stop default tooltip

     // Load tooltip content from an object on the page
     if (tt === ''){
      if (rel !== '') {
       tt = $(rel).html() || 'No tooltip found';
      } else if (url !== '') {
       tt = 'Loading...';
       // Load tooltip from external page
       var ttloader = $('<div />');
       ttloader.load(url, function(){
        $('#' + o.tooltip).html( ttloader.html() );
       });
      }
     }
     // build tooltip & styling from metadata
     var tmp = '<div id="' + o.tooltip + '" style="position:absolute;z-index:' + opt.zIndex + ';' + meta[1] + '">' + tt + '</div>';
     if (opt.local){
      obj.before(tmp);
     } else {
      $('body').append(tmp);
     }
     $.jatt.ttrelocate(e, '#' + o.tooltip);
     $('#' + o.tooltip).fadeIn(opt.speed);
    })
    [evt](o.deactivate,function(e) {
     $('#' + o.tooltip).remove();
    })
    [evt]('mousemove',function(e) {
     if (opt.followMouse) { $.jatt.ttrelocate(e, '#' + o.tooltip); }
    });

   // Image & URL screenshot preview
   $('a.' + o.preview + ', a.' + o.screenshot)
    [evt](o.activate,function(e){
     var obj = $(this),
         meta = (o.metadata.toString() == 'false') ? [o, ''] : $.jatt.getMeta(obj);
     opt = meta[0];
     var tt = (obj.attr(opt.content) === '') ? obj.data('tooltip') || '' : obj.attr(opt.content) || '';
     obj.data('tooltip', tt);
     if (opt.content == 'title') { obj.attr(opt.content, ''); } // leave title attr empty
     var tmp = '<div id="' + o.preview + '" style="position:absolute;z-index:' + opt.zIndex + ';' + meta[1] + '"><img src="';
     var c = (tt !== '') ? '<br/>' + tt : '';
     /* use websnapr.com to get website thumbnail preview if rel="#" */
     var ss = (obj.is('.' + o.screenshot) && this.rel == '#') ? 'http://images.websnapr.com/?url=' + this.href : this.rel;
     tmp += (obj.is('.' + o.preview)) ? this.href + '" alt="Image preview" />' : ss + '" alt="URL preview: ' + this.href + '" />';
     tmp += c + '</div>';
     if (opt.local){
      obj.before(tmp);
     } else {
      $('body').append(tmp);
     }
     $('#' + o.preview).data('options',opt);
     $.jatt.ttrelocate(e, '#' + o.preview);
     $('#' + o.preview).fadeIn(opt.speed);
    })
    [evt](o.deactivate,function(e){
     $('#' + o.preview).remove();
    })
    [evt]('mousemove',function(e){
     if (opt.followMouse) { $.jatt.ttrelocate(e, '#' + o.preview); }
    });

  }; // end init

  $.jatt.ttrelocate = function(e, ttid){
   var ttw = $(ttid).outerWidth(),
    tth = $(ttid).outerHeight(),
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
    wscrY = $(window).scrollTop(),
    wscrX = $(window).scrollLeft(),
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
   if ( curX + dir[2] > wscrX + $(window).width() - opt.xOffset ) { ttleft = $(window).width() - ttw - opt.xOffset; }
   if ( curY + dir[3] > wscrY + $(window).height() - opt.yOffset ) { tttop = curY - tth - opt.yOffset; }
   if ( ttleft < wscrX + opt.xOffset ) { ttleft = wscrX + opt.xOffset; }
   if ( tttop < wscrY + opt.yOffset ) {  tttop = curY + opt.yOffset; }

   // prevent mouse from being inside tooltip & causes a flicker on mouse move
   if ( curX > ttleft && curX < ttleft + ttw && curY > tttop && curY < tttop + tth ) {
    tttop += ( (tttop - tth/2 - opt.yOffset) < wscrY + opt.yOffset ) ? tth/2 + opt.yOffset : -tth/2 - opt.yOffset;
   }

   $(ttid).css({ left : ttleft + 'px', top : tttop + 'px' });
  };

  $.jatt.getMeta = function(el){
   opt = objClone(o);
   var meta = el.attr(o.metadata).match(/(\{.*\})/g) || '';
   if (meta !== '') {
    var t, m = '', opts = 'direction|followMouse|content|speed|local|xOffset|yOffset|zIndex';
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
       m += val + ';';
      }
     });
     meta = m;
    }
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

  // change tooltip, screenshot and preview
  tooltip        : 'tooltip',             // class & id used for tooltip
  screenshot     : 'screenshot',          // class & id used for screenshot and preview
  preview        : 'preview'              // class used for preview
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
  if (document.getElementById('tooltip2') !== null) { jQuery.jatt.ttrelocate(e,'#tooltip2'); }
 }
 document.onmousemove = positiontip;
 */

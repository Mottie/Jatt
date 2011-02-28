$(document).ready(function(){

 // variables
 var t,
  // default data-attribute to look in for metadata. To change it, initialize the
  // tooltip with a metadata option - $.jatt({ metadata: 'data-someotherattribute' })
  dataAttr = 'data-jatt',
  img = $('#test');

 // initialize tooltip
 $.jatt();
 
 // example of adding a callback
 /*
 $.jatt({
  'jatt-revealed' : function(){ alert('AHHHHHHHHHHHHHHHHH'); }
 });
 */

 // initialize code box
 $('#code').val( img.parent().html() );

 // add metadata
 $('input, select').change(function(){
  // build metadata
  t = 'background: ' + $('#bk').val() + '; color: ' + $('#tc').val() + '; width: ' + $('#wi').val() + 
  'px; border: ' + $('#bo').val() + '; direction: ' + $('input:radio[name=dir]:checked').val() + '; followMouse: ' +
  $('#fm').is(':checked') + '; content: ' + $('#co').val() + '; speed: ' + $('#sp').val() + '; local: ' + 
  $('#lo').is(':checked') + '; xOffset: ' + $('#xo').val() + '; yOffset: ' + $('#yo').val() + '; zIndex: ' +
  $('#zi').val();

  // update metadata and other attributes
  if ($('#ic').is(':checked')) {
   // add metadata to class (you can change this by using the metadata option)
   img
    .attr({
     'class' : 'tooltip { ' + t + ' }',
     'title' : $('#ti').val(),
     'alt'   : $('#al').val()
    })
    .removeAttr(dataAttr);
  } else {
   // add metadata to the data-attribute (the fallback for the script is "data-jatt", but you can make
   // it look in "data-whatever" first, by initializing the code with that in the metadata option)
   img
    .attr({
     'class' : 'tooltip',
     'title' : $('#ti').val(),
     'alt'   : $('#al').val()
    })
    .attr(dataAttr,t);
  }

  // update code box
  $('#code').val( img.parent().html() );
 });

 // show event triggers in console
 $(document).bind('jatt-initialized jatt-beforeReveal jatt-revealed jatt-hidden', function(e, obj){
  // added window.console.firebug to make this work in Opera
  if (window.console && window.console.firebug){ console.debug(e.type + ' event triggered! Object id #' + obj.id ); }
 });

});
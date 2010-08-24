$(document).ready(function(){

 // initialize tooltip
 $.jatt();

 // initialize code box
 $('#code').val( $('#test').parent().html() );

 // add metadata
 $('input, select').change(function(){
  // build metadata
  var t = '{ background: ' + $('#bk').val() + '; color: ' + $('#tc').val() + '; width: ' + $('#wi').val() + 
  'px; border: ' + $('#bo').val() + '; direction: ' + $('input:radio[name=dir]:checked').val() + '; followMouse: ' +
  $('#fm').is(':checked') + '; content: ' + $('#co').val() + '; speed: ' + $('#sp').val() + '; local: ' + 
  $('#lo').is(':checked') + '; xOffset: ' + $('#xo').val() + '; yOffset: ' + $('#yo').val() + '; zIndex: ' +
  $('#zi').val() + ' }';

  // update metadata and other attributes
  $('#test').attr({
   'class' : 'tooltip ' + t,
   'title' : $('#ti').val(),
   'alt'   : $('#al').val()
  });

  // update code box
  $('#code').val( $('#test').parent().html() );
 });

});
/* This script is only loaded by the meta.html demo */
$(function(){

	// variables
	var t,
		// default data-attribute to look in for metadata. To change it, initialize the
		// tooltip with a metadata option - $.jatt({ metadata: 'data-someotherattribute' })
		dataAttr = 'data-jatt',
		img = $('#test'),
		dList = $('#display'),
		display = function(txt){
			dList.append('<li>' + txt + '</li>');
			var li = dList.find('li');
			if (li.length > 6) { li.filter(':first').remove(); }
		};

	// initialize tooltip (already done on each page)
	// $.jatt();

	// example of adding a callback
	/*
	$.jatt({
		revealed : function(){ alert('AHHHHHHHHHHHHHHHHH'); }
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

		// in class - update metadata and other attributes
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

		// set sticky?
		img[ ($('#ms').is(':checked')) ? 'addClass' : 'removeClass' ]('sticky');

		// update code box
		$('#code').val( $('#star-image-wrapper').html() );
	});

	// show event triggers
	$(document).bind('jatt-initialized jatt-beforeReveal jatt-reveal jatt-hidden', function(e, obj){
		if (obj.id !== 'test') { return; } // ignore all other tooltips
		// make it purdy
		var t = 'tooltip "<span style="color:#',
		name = e.type.replace('jatt-', '');
		switch(name) {
			case 'initialized' : t += '888'; break;
			case 'beforeReveal': t += 'aaa'; break;
			case 'revealed'    : t += 'fff'; break;
			case 'hidden'      : t += 'c00'; break;
		}
		display(t + '">' + e.type + '</span>"');
	});

});
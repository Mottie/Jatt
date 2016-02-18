/*!
 * Jatt - just another tooltip v2.8.6
 * http://github.com/Mottie/Jatt
 * by Rob Garrison (aka Mottie)
 *
 * based on tooltip by Alen Grakalic (http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery)
 * tooltip modification by Rob G, aka Mottie (http://wowmotty.blogspot.com/)
 *
 */
/*jshint browser:true, jquery:true, unused:false */
;(function($, window, document) {
	'use strict';
	$.jatt = function(options) {

	// options & globals
	var opt, process,
		cache = [],
		pageBody = $('body'),
		$doc = $(document),
		$win = $(window),
		namespace = '.jatt',
		events = {
			init     : 'jatt-init',
			b4Reveal : 'jatt-beforeReveal',
			reveal   : 'jatt-reveal',
			hidden   : 'jatt-hidden'
		},
		o = $.extend({}, $.jatt.defaultOptions, options),

	init = function() {
		var preloads = [];
		// callbacks
		$.each(events, function(i, event) {
			var callback = event.replace('jatt-', '');
			if ($.isFunction(o[callback])) {
				$doc.on(event, o[callback] );
			}
		});
		$.data($doc, 'jatt', '');

		// *** Tooltips ***
		$doc.on((o.activate + ' ').split(' ').join(namespace + ' '), o.tooltip, function(event) {
			var tmp, tooltip, $tooltip, rel,
				url, $tooltipLoader, tooltipContent,
				$this = $(this),
				// metadata is usually a class name. It is set to false to disable it,
				// so we need to see if we get false or "false"
				meta = (o.metadata.toString() === 'false') ?
					[o, ''] : $.jatt.getMeta($this);

			if (this !== $.data($doc, 'jatt')[0]) {
				$.jatt.removeTooltips();
			}

			$doc.trigger(events.init, $this);
			opt = meta[0]; // meta options
			tooltip = ($this.attr(opt.content) === '') ?
				$this.data('tooltip') || '' : $this.attr(opt.content) || '';
			rel = $this.attr(o.extradata) || '';
			url = $this.attr('href') || '';
			$this.data('tooltip', tooltip);
			$this.attr('title', ''); // clear title to stop default tooltip

			// build tooltip & styling from metadata - styling added here as a
			// fallback, in case css isn't loaded
			tmp = '<div id="' + o.tooltipId + '" style="position:absolute;z-index:' +
				opt.zIndex + ';' + meta[1] + '"><span class="body"></span>' +
				'<span class="close" style="display:none;">x</span></div>';
			if (opt.local) {
				$this.before(tmp);
			} else {
				pageBody.append(tmp);
			}
			$tooltip = $('#' + o.tooltipId);
			// Load tooltip content from an object on the page
			if (tooltip === '') {
				if (rel !== '') {
					tooltip = $(rel).html() || o.notFound;
				} else if (url !== '' && url !== '#') {
					tooltip = o.loading;
					// Load tooltip from external page
					$tooltipLoader = $('<div />');
					$tooltipLoader.load(url, function() {
						tooltipContent = $tooltipLoader.html();
						cache = (o.cacheData) ? tooltipContent : '';
						$tooltip
							// hiding to prevent contents popping up under the mouse and
							// triggering a close event, or it should o.O
							.hide()
							.find('.body')
							.html(tooltipContent);
						$this.data('tooltip', cache); // save data for next load
						$.jatt.ttrelocate(event, o.tooltipId);
						$tooltip.fadeIn(opt.speed);
					});
				}
			}
			$tooltip
				.data('options', opt)
				.find('.body')
				.html(tooltip);
			$.jatt.ttrelocate(event, o.tooltipId);
			$tooltip
				.find('.close')
				.toggle($this.is(o.sticky))
				.click(function() {
					$.jatt.removeTooltips();
				});

			$.data($doc, 'jatt', $this);
			$doc.trigger(events.b4Reveal, $this);
			$tooltip.fadeIn(opt.speed);
			$doc.trigger(events.reveal, $this);
		})
		.on((o.deactivate + ' ').split(' ').join(namespace + ' '), o.tooltip, function() {
			if (!$(this).is(o.sticky)) {
				$.jatt.removeTooltips();
			}
		})
		.on('mousemove' + namespace, o.tooltip, function(event) {
			if ($('#' + o.tooltipId).length && opt.followMouse) {
				$.jatt.ttrelocate(event, o.tooltipId);
			}
		});

		// *** Process image & URL screenshot previews ***
		process = function(event, $obj, content) {
			$doc.trigger(events.init, $obj);
			var $tooltip, tooltip, tmp,
				meta = (o.metadata.toString() == 'false') ?
					[o, ''] : $.jatt.getMeta($obj);
				opt = meta[0];
			tooltip = ($obj.attr(opt.content) === '') ?
				$obj.data('tooltip') || '' : $obj.attr(opt.content) || '';
			$obj.data('tooltip', tooltip);
			if (opt.content === 'title') {
				// leave title attr empty
				$obj.attr(opt.content, '');
			}
			// make sure position and zindex (in case it's not in the meta data)
			// are always added
			tmp = '<div id="' + o.previewId + '" style="position:absolute;z-index:' +
				opt.zIndex + ';' + meta[1] + '"><span class="body"><img src="' +
				content + (tooltip !== '' ? '<br/>' + tooltip : '') + '</span>' +
				'<span class="close" style="display:none;">x</span></div>';
			if (opt.local) {
				$obj.before(tmp);
			} else {
				pageBody.append(tmp);
			}
			$tooltip = $('#' + o.previewId);
			$.data($doc, 'jatt', $obj);
			$doc.trigger(events.b4Reveal, $obj);
			$tooltip
				.hide()
				.data('options', opt)
				.fadeIn(opt.speed);
			$.jatt.ttrelocate(event, o.previewId);
			$tooltip
				.find('.close')
				.toggle($obj.is(o.sticky))
				.click(function() {
					$.jatt.removeTooltips();
				});
			$doc.trigger(events.reveal, $obj);
		};

		// *** Image preview ***
		$doc.on((o.activate + ' ').split(' ').join(namespace + ' '), o.preview, function(event) {
			var $this = $(this);
			$.jatt.removeTooltips();
			process( event, $this, $this.attr('href') + '" alt="' + o.imagePreview +'" />');
		});
		// preload images/screenshots
		.each(function() {
			preloads.push( $(this).attr('href') );
		});

		// *** Screenshot preview ***
		$doc.on((o.activate + ' ').split(' ').join(namespace + ' '), o.screenshot, function(event) {
			var $this = $(this),
			/* use external site to get website thumbnail preview if rel="#" */
			ss = ($this.attr(o.extradata) === '#' ?
				o.websitePreview + $this.attr('href') : $this.attr(o.extradata)) +
				'" alt="' + o.siteScreenshot + $this.attr('href') + '" />';
			$.jatt.removeTooltips();
			process( event, $this, ss );
		})
		// preload screenshots
		.each(function() {
			var $this = $(this);
			preloads.push( ($this.attr(o.extradata) === '#') ?
				o.websitePreview + $this.attr('href') : $this.attr(o.extradata) );
		});

		// *** combined preview & screenshot ***
		.on((o.deactivate + ' ').split(' ').join(namespace + ' '), o.preview + ',' + o.screenshot, function() {
			if (!$(this).is(o.sticky)) {
				$.jatt.removeTooltips();
			}
		})
		.on('mousemove' + namespace, o.preview + ',' + o.screenshot, function(event) {
			if ($('#' + o.previewId).length && opt.followMouse) {
				$.jatt.ttrelocate(event, o.previewId);
			}
		});

		$.jatt.preloadContent(preloads);

	}; // end init

		$.jatt.ttrelocate = function(event, tooltipId) {
			var $tooltip = $('#' + tooltipId),
				ttw = $tooltip.outerWidth(),
				tth = $tooltip.outerHeight(),
				opt = $tooltip.data('options') || o,
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
				wscrY = $win.scrollTop(),
				wscrX = $win.scrollLeft(),
				// use $(event.target).position() if the link gets focus.
				tar = $(event.target),
				curX = event.pageX || tar.position().left + tar.width()/2,
				curY = event.pageY || tar.position().top + tar.height()/2;

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
			if ( curX + dir[2] > wscrX + $win.width() - opt.xOffset ) {
				ttleft = $win.width() - ttw - opt.xOffset;
			}
			if ( curY + dir[3] > wscrY + $win.height() - opt.yOffset ) {
				tttop = curY - tth - opt.yOffset;
			}
			if ( ttleft < wscrX + opt.xOffset ) {
				ttleft = wscrX + opt.xOffset;
			}
			if ( tttop < wscrY + opt.yOffset ) {
				tttop = curY + opt.yOffset;
			}

			// prevent mouse from being inside tooltip & cause a flicker on mouse move
			if ( curX > ttleft && curX < ttleft + ttw && curY > tttop && curY < tttop + tth ) {
				tttop += ( (tttop - tth/2 - opt.yOffset) < wscrY + opt.yOffset ) ?
					tth/2 + opt.yOffset : -tth/2 - opt.yOffset;
			}

			$tooltip.css({ left : ttleft + 'px', top : tttop + 'px' });
		};

		$.jatt.getMeta = function(el) {
			opt = $.extend({}, o);
			var t,
				m = [],
				// options that aren't added to the tooltip style (except zIndex)
				opts = 'direction|followMouse|content|speed|local|xOffset|yOffset|zIndex',
				meta = el.attr(o.metadata) || '';
			// if the metadata doesn't have curly brackets then look in the attrib
			meta = (meta.match(/(\{.*\})/g)) ?
				meta.match(/(\{.*\})/g)[0] : el.attr(o.metadata) || '';
			// if the current meta data doesn't have any of the metadata variables, look in data-jatt
			// the data object (el.data('jatt')) could have been used, but then the code would be longer.
			meta = (meta.match('width|background|color|border|' + opts)) ?
				meta : el.attr('data-jatt') || '';
			if (meta !== '') {
				// remove curly brackets, spaces, apostrophes and quotes
				meta = meta.replace(/(\{|\'|\"|\})/g, '');
				if (meta.match(opts)) {
					// split out tooltip options, assume everything else is css
					$.each(meta.split(';'), function(i, val) {
						t = val.split(':');
						if (t[0].match(opts)) {
							var k = $.trim(t[0]),
								v = $.trim(t[1]);
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
			return [opt, meta];
		};

		// Remove all tooltips, and any extras that might appear
		// (focusout doesn't seem to work)
		$.jatt.removeTooltips = function() {
			var $tooltip = $('#' + o.previewId + ', #' + o.tooltipId);
			if ($tooltip.length) {
				$tooltip.remove();
				$doc.trigger(events.hidden, $.data($doc, 'jatt') );
			}
			while ($('#' + o.previewId + ', #' + o.tooltipId).length > 0) {
				$('#' + o.previewId + ', #' + o.tooltipId).remove();
			}
		};

		// Preload Content
		$.jatt.preloadContent = function(preloads) {
			if (preloads.length === 0) { return; }
			var cacheImage, $this, $div, url, i,
				divs = [],
				$tooltip = $(o.tooltip),
				len = preloads.length;
			// preload images code modified from http://engineeredweb.com/blog/09/12/preloading-images-jquery-and-javascript
			for (i = 0; i < len; i++) {
				// console.debug('preloading image: ' + preloads[i]);
				cacheImage = document.createElement('img');
				cacheImage.src = preloads[i];
				cache.push(cacheImage);
			}
			// preload external content
			$tooltip.each(function(i) {
				$this = $(this);
				// look for preload content class
				if ( this.tagName === 'A' && $this.is(o.preloadContent) ) {
					url = $(this).attr('href') || '';
					if ( url !== '' && !url.match(/^#/) ) {
						// Load tooltip from external page - console.debug('preloading content: ' + url);
						$div = $('<div rel="' + i + '" />');
						divs.push($div);
						$div.load(url, function() {
							$tooltip.eq( $div.attr(o.extradata) ).data('tooltip', $div.html() );
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
		extradata      : 'rel',                 // Change using the rel attribute; stores object id on the page (basic tooltip) or image URL (screenshot)
		activate       : 'mouseenter focusin',  // how tooltip is activated, focusin for input areas.
		deactivate     : 'mouseleave focusout', // how tooltip is deactivated
		cacheData      : true,                  // Cache tooltip data, set to false if the data is dynamic.
		websitePreview : 'http://api1.thumbalizr.com/?width=250&url=', // use your own custom thumbnail service (api string - http://www.thumbalizr.com/apitools.php)

		// Messages
		loading        : 'Loading...',          // Message shown while content is loading. Replace with loading <img> if desired.
		notFound       : 'No tooltip found',    // Message shown when no tooltip content is found
		imagePreview   : 'Image preview',       // image alt message for the image shown in the preview tooltip - only seen if the image doesn't exist
		siteScreenshot : 'URL preview: ',       // image alt message for site screenshots, this message is followed by the URL - only seen if the image doesn't exist

		// change tooltip, screenshot and preview class - note that all classes have a "." in front
		tooltip        : '.tooltip',            // tooltip class
		screenshot     : 'a.screenshot',        // screenshot class
		preview        : 'a.preview',           // preview class
		preloadContent : '.preload',            // Add this class to preload tooltip content (not preview or screenshot).
		sticky         : '.sticky',             // Add this class to make a tooltip sticky. Only one tooltip on the screen at a time though.

		// tooltip & preview ID (div that contains the tooltip)
		tooltipId      : 'tooltip',             // ID of actual tooltip
		previewId      : 'preview'              // ID of screenshot/preview tooltip
	};

})(jQuery, this, document);

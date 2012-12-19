module = { _orig: window.module, _define: window.define };
module['jquery'] = jQuery;
module['can/util'] = can;
define = function(id, deps, value) {
	module[id] = value();
};
define.amd = { jQuery: true };
// ## jquery/dom/styles/styles.js

module['jquery/dom/styles/styles.js'] = (function( $ ) {
	var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
		// The following variables are used to convert camelcased attribute names
		// into dashed names, e.g. borderWidth to border-width
		rupper = /([A-Z])/g,
		rdashAlpha = /-([a-z])/ig,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		// Returns the computed style for an elementn
		getStyle = function( elem ) {
			if ( getComputedStyle ) {
				return getComputedStyle(elem, null);
			}
			else if ( elem.currentStyle ) {
				return elem.currentStyle;
			}
		},
		// Checks for float px and numeric values
		rfloat = /float/i,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/;

	// Returns a list of styles for a given element
	$.styles = function( el, styles ) {
		if (!el ) {
			return null;
		}
		var  currentS = getStyle(el),
			oldName, val, style = el.style,
			results = {},
			i = 0,
			left, rsLeft, camelCase, name;

		// Go through each style
		for (; i < styles.length; i++ ) {
			name = styles[i];
			oldName = name.replace(rdashAlpha, fcamelCase);

			if ( rfloat.test(name) ) {
				name = jQuery.support.cssFloat ? "float" : "styleFloat";
				oldName = "cssFloat";
			}

			// If we have getComputedStyle available
			if ( getComputedStyle ) {
				// convert camelcased property names to dashed name
				name = name.replace(rupper, "-$1").toLowerCase();
				// use getPropertyValue of the current style object
				val = currentS.getPropertyValue(name);
				// default opacity is 1
				if ( name === "opacity" && val === "" ) {
					val = "1";
				}
				results[oldName] = val;
			} else {
				// Without getComputedStyles
				camelCase = name.replace(rdashAlpha, fcamelCase);
				results[oldName] = currentS[name] || currentS[camelCase];

				// convert to px
				if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) {
					// Remember the original values
					left = style.left;
					rsLeft = el.runtimeStyle.left;

					// Put in the new values to get a computed value out
					el.runtimeStyle.left = el.currentStyle.left;
					style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
					results[oldName] = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					el.runtimeStyle.left = rsLeft;
				}

			}
		}

		return results;
	};

	/**
	 * @function jQuery.fn.styles
	 * @parent jQuery.styles
	 * @plugin jQuery.styles
	 *
	 * Returns a set of computed styles. Pass the names of the styles you want to
	 * retrieve as arguments:
	 *
	 *      $("div").styles('float','display')
	 *      // -> { cssFloat: "left", display: "block" }
	 *
	 * @param {String} style pass the names of the styles to retrieve as the argument list
	 * @return {Object} an object of `style` : `value` pairs
	 */
	$.fn.styles = function() {
		// Pass the arguments as an array to $.styles
		return $.styles(this[0], $.makeArray(arguments));
	};

	return $;
})(module["jquery"]);// ## jquery/dom/dimensions/dimensions.js

module['jquery/dom/dimensions/dimensions.js'] = (function($) {

var
	//margin is inside border
	weird = /button|select/i,
	getBoxes = {},
    checks = {
        width: ["Left", "Right"],
        height: ['Top', 'Bottom'],
        oldOuterHeight: $.fn.outerHeight,
        oldOuterWidth: $.fn.outerWidth,
        oldInnerWidth: $.fn.innerWidth,
        oldInnerHeight: $.fn.innerHeight
    },
	supportsSetter = $.fn.jquery >= '1.8.0';

$.each({ 

/**
 * @function jQuery.fn.outerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerWidth([value], [includeMargins])` lets you set
 * the outer width of an object where:
 *
 *      outerWidth = width + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerWidth(100); //sets outer width
 *      $("#foo").outerWidth(100, true); // uses margins
 *      $("#foo").outerWidth(); //returns outer width
 *      $("#foo").outerWidth(true); //returns outer width + margins
 *
 * When setting the outerWidth, it adjusts the width of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer width:
 * 
 *      $('#foo').animate({ outerWidth: 200 });
 *
 * @param {Number} [width] The width to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerWidth adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer width or the jQuery wrapped elements
 * if you are setting the outer width.
 */
width: 
/**
 * @function jQuery.fn.innerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerWidth([value])` lets you set the inner width of an element where
 * 
 *      innerWidth = width + padding
 *      
 * Use it like:
 *
 *      $("#foo").innerWidth(100); //sets inner width
 *      $("#foo").outerWidth(); // returns inner width
 *      
 * Or in an animation like:
 * 
 *      $('#foo').animate({ innerWidth : 200 });
 *
 * Setting inner width adjusts the width of the element.
 *
 * @param {Number} [width] The inner width to set
 * @return {jQuery|Number} Returns the inner width or the jQuery wrapped elements
 * if you are setting the inner width.
 */
"Width", 
/**
 * @function jQuery.fn.outerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerHeight([value], [includeMargins])` lets
 * you set the outer height of an object where:
 *
 *      outerHeight = height + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerHeight(100); //sets outer height
 *      $("#foo").outerHeight(100, true); // uses margins
 *      $("#foo").outerHeight(); //returns outer height
 *      $("#foo").outerHeight(true); //returns outer height + margins
 *
 * When setting the outerHeight, it adjusts the height of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer heihgt:
 *
 *      $('#foo').animate({ outerHeight : 200 });
 *
 * @param {Number} [height] The height to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerHeight adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer height or the jQuery wrapped elements
 * if you are setting the outer height.
 */
height: 
/**
 * @function jQuery.fn.innerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerHeight([value])` lets you set the inner height of an element where
 *
 *      innerHeight = height + padding
 *
 * Use it like:
 *
 *      $("#foo").innerHeight(100); //sets inner height
 *      $("#foo").outerHeight(); // returns inner height
 *
 * Or in an animation like:
 *
 *      $('#foo').animate({ innerHeight : 200 });
 *
 * Setting inner height adjusts the height of the element.
 *
 * @param {Number} [height] The inner height to set
 * @return {jQuery|Number} Returns the inner height or the jQuery wrapped elements
 * if you are setting the inner height.
 */
// for each 'height' and 'width'
"Height" }, function(lower, Upper) {

    //used to get the padding and border for an element in a given direction
    getBoxes[lower] = function(el, boxes) {
        var val = 0;
        if (!weird.test(el.nodeName)) {
            //make what to check for ....
            var myChecks = [];
            $.each(checks[lower], function() {
                var direction = this;
                $.each(boxes, function(name, val) {
                    if (val)
                        myChecks.push(name + direction+ (name == 'border' ? "Width" : "") );
                })
            })
            $.each($.styles(el, myChecks), function(name, value) {
                val += (parseFloat(value) || 0);
            })
        }
        return val;
    }

    //getter / setter
	if(!supportsSetter) {
	    $.fn["outer" + Upper] = function(v, margin) {
	        var first = this[0];
			if (typeof v == 'number') {
				// Setting the value
	            first && this[lower](v - getBoxes[lower](first, {padding: true, border: true, margin: margin}))
	            return this;
	        } else {
				// Return the old value
	            return first ? checks["oldOuter" + Upper].apply(this, arguments) : null;
	        }
	    }
	    $.fn["inner" + Upper] = function(v) {
	        var first = this[0];
			if (typeof v == 'number') {
				// Setting the value
	            first&& this[lower](v - getBoxes[lower](first, { padding: true }))
	            return this;
	        } else {
				// Return the old value
	            return first ? checks["oldInner" + Upper].apply(this, arguments) : null;
	        }
	    }
	}

    //provides animations
	var animate = function(boxes){
		// Return the animation function
		return function(fx){
			if (fx[supportsSetter ? 'pos' : 'state'] == 0) {
	            fx.start = $(fx.elem)[lower]();
	            fx.end = fx.end - getBoxes[lower](fx.elem,boxes);
	        }
	        fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
		}
	}
    $.fx.step["outer" + Upper] = animate({padding: true, border: true})
	$.fx.step["outer" + Upper+"Margin"] =  animate({padding: true, border: true, margin: true})
	$.fx.step["inner" + Upper] = animate({padding: true})

})

return $;
})(module["jquery"], module["jquery/dom/styles/styles.js"]);// ## jquery/event/reverse/reverse.js

module['jquery/event/reverse/reverse.js'] = (function($) {
	$.event.reverse = function(name, attributes) {
		var bound = $(),
			count = 0;

		$.event.special[name] = {
			setup: function() {
				// add and sort the resizers array
				// don't add window because it can't be compared easily
				if ( this !== window ) {
					bound.push(this);
					$.unique(bound);
				}
				// returns false if the window
				return this !== window;
			},
			teardown: function() {
				// we shouldn't have to sort
				bound = bound.not(this);
				// returns false if the window
				return this !== window;
			},
			add: function( handleObj ) {
				var origHandler = handleObj.handler;
				handleObj.origHandler = origHandler;

				handleObj.handler = function( ev, data ) {
					var isWindow = this === window;
					if(attributes && attributes.handler) {
						var result = attributes.handler.apply(this, arguments);
						if(result === true) {
							return;
						}
					}

					// if this is the first handler for this event ...
					if ( count === 0 ) {
						// prevent others from doing what we are about to do
						count++;
						var where = data === false ? ev.target : this

						// trigger all this element's handlers
						$.event.handle.call(where, ev, data);
						if ( ev.isPropagationStopped() ) {
							count--;
							return;
						}

						// get all other elements within this element that listen to move
						// and trigger their resize events
						var index = bound.index(this),
							length = bound.length,
							child, sub;

						// if index == -1 it's the window
						while (++index < length && (child = bound[index]) && (isWindow || $.contains(where, child)) ) {

							// call the event
							$.event.handle.call(child, ev, data);

							if ( ev.isPropagationStopped() ) {
								// move index until the item is not in the current child
								while (++index < length && (sub = bound[index]) ) {
									if (!$.contains(child, sub) ) {
										// set index back one
										index--;
										break
									}
								}
							}
						}

						// prevent others from responding
						ev.stopImmediatePropagation();
						count--;
					} else {
						handleObj.origHandler.call(this, ev, data);
					}
				}
			}
		};

		// automatically bind on these
		$([document, window]).bind(name, function() {});

		return $.event.special[name];
	}

	return $;
})(module["jquery"]);// ## jquery/event/resize/resize.js

module['jquery/event/resize/resize.js'] = (function($) {
	var
		// bind on the window window resizes to happen
		win = $(window),
		windowWidth = 0,
		windowHeight = 0,
		timer;

	$(function() {
		windowWidth = win.width();
		windowHeight = win.height();
	});

	$.event.reverse('resize', {
		handler : function(ev, data) {
			var isWindow = this === window;

			// if we are the window and a real resize has happened
			// then we check if the dimensions actually changed
			// if they did, we will wait a brief timeout and
			// trigger resize on the window
			// this is for IE, to prevent window resize 'infinate' loop issues
			if ( isWindow && ev.originalEvent ) {
				var width = win.width(),
					height = win.height();


				if ((width != windowWidth || height != windowHeight)) {
					//update the new dimensions
					windowWidth = width;
					windowHeight = height;
					clearTimeout(timer)
					timer = setTimeout(function() {
						win.trigger("resize");
					}, 1);

				}
				return true;
			}
		}
	});

	return $;
})(module["jquery/event/reverse/reverse.js"]);// ## canui/fills/fills.js

module['canui/fills/fills.js'] = (function( $ ) {
// evil things we should ignore
var matches = /script|td/,
	// jquery.outerHeight is SLOW
	outerHeight = function(elm){
		var styles = $.styles(elm[0], ['paddingTop', 
									   'paddingBottom', 
									   'borderTopWidth', 
									   'borderBottomWidth', 
									   'marginTop', 
									   'marginBottom']);
		
		return elm.height() + 
				parseInt(styles.paddingTop || 0) + 
				parseInt(styles.paddingBottom || 0) + 
				parseInt(styles.borderTopWidth || 0) + 
				parseInt(styles.borderBottomWidth || 0) + 
				parseInt(styles.marginTop || 0) + 
				parseInt(styles.marginBottom || 0);
	},

/**
 *
 * # Parents
 *
 * // Default -> this.parent()
 * $('.dom').fill();
 *
 * // jQuery Selectors
 * $('.dom').fill('.myParent');
 * 
 * // DOM nodes
 * $('.dom').fill(getElementById('dom'))
 *
 * // jQuery objs
 * $('.dom').fill($('moo:eq(1)'))
 * 
 */
filler = $.fn.fill = function( parent ) {
	if(!parent){
		// default to parent
		var p = this.parent();
		parent = p[0] === document.body ? $(window) : p;
	} else if(typeof parent == 'string'){
		// find via selector
		parent = this.closest(parent)
	} else if(parent.nodeName ) {
		// wrap everything
		parent = $(parent);
	}

	this.each(function(){
		// Attach to the `resize` event
		parent.on('resize', $(this), filler.parentResize);

		// unbind on destroy
		filler.bind('destroyed', $(this), function( ev ) {
			parent.undelegate('resize', filler.parentResize)
		});
	});

	// resize to get things going
	$(parent.resize());

	return this;
};

$.extend(filler, {
	parentResize : function( ev ) {
		var fille = ev.data;

		// if the window is hidden, return and
		// stop the propagation of anymore
		//if (fille.is(':hidden')) {
		//	ev.stopPropagation();
		//	return;
		//}

		var parent = $(this),
			height = parent.height();

		// check yo cache, since we are going down if the
		// parent was resize but we get to a elm that wasn't
		// then we can stop because its not going to get the 
		// resize event.
		if(fille.data('prev') == height){
			//ev.stopPropagation();
			return;
		}

		// cache the current
		fille.data('prev', height);

		var isWindow = this == window,
			container = (isWindow ? $(document.body) : parent),
			children = container.children().filter(function() {
				if ( matches.test(this.nodeName.toLowerCase()) ) {
					return false;
				}

				// Use jquery/dom/styles for faster CSS aquistion
				// http://jsfiddle.net/donejs/6CcaG/light/
				var styles = $.styles(this, ['position', 'display']);
				return styles.position !== "absolute" && styles.position !== "fixed"
					&& styles.display !== "none" && !jQuery.expr.filters.hidden(this)
			}),
			last = children.eq(-1), cur;

		if (last.length) {
			var offsetParent = last.offsetParent()[0],
				lastOffsetTop = last[0].offsetTop,
				lastOuter = outerHeight(last);

			if(offsetParent === container[0]){
				cur = lastOffsetTop + lastOuter;
			} else if(offsetParent === container.offsetParent()[0]){
				var div = '<div style="height:0;line-height:0px;overflow:hidden;"/>',
					first = $(div).prependTo(container);	

				cur = (lastOffsetTop + lastOuter) - first[0].offsetTop;
				first.remove();
			}
		}

		// what the difference between the parent height and what we are going to take up is
		// the current height of the object
		var delta = height - cur,
			fillerHeight = fille.height();

		fille.height(fillerHeight + delta + "px")
	}
});
})(module["jquery"], module["jquery/dom/dimensions/dimensions.js"], module["jquery/event/resize/resize.js"]);

window.define = module._define;

window.module = module._orig;

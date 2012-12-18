module = { _orig: window.module, _define: window.define };
module['jquery'] = jQuery;
module['can/util'] = can;
define = function(id, deps, value) {
	module[id] = value();
};
define.amd = { jQuery: true };
// ## jquery/lang/vector/vector.js

module['jquery/lang/vector/vector.js'] = (function($){
	var getSetZero = function(v){ return v !== undefined ? (this.array[0] = v) : this.array[0] },
		getSetOne = function(v){ return v !== undefined ? (this.array[1] = v) : this.array[1]};

/**
 * @class jQuery.Vector
 * @parent jquerypp
 *
 * `jQuery.Vector` represents a multi dimensional vector with shorthand methods for
 * working with two dimensions.
 *
 * It is mainly used in [jQuery.event.drag drag] & [jQuery.event.drop drop] events.
 *
 * @constructor creates a new vector instance from the arguments.  Example:
 *
 *      new jQuery.Vector(1,2)
 */
	$.Vector = function(arr) {
		var array = $.isArray(arr) ? arr : $.makeArray(arguments);
		this.update(array);
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector and returns a new vector.
		 *
		 * @param {Function} f The function to apply
		 * @return {jQuery.Vector} A new $.Vector instance
		 */
		app: function( f ) {
			var i, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i], i));
			}
			return new $.Vector(newArr);
		},
		/**
		 * Adds two vectors together and returns a new instance. Example:
		 *
		 *      new $.Vector(1,2).plus(2,3) //-> (3, 5)
		 *      new $.Vector(3,5).plus(new Vector(4,5)) //-> (7, 10)
		 *
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Subtract one vector from another and returns a new instance. Example:
		 *
		 *      new $.Vector(4, 5).minus(2, 1) //-> (2, 4)
		 *
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.
		 *
		 * `null` if otherwise.
		 *
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
		/**
		 * Returns the first value of the vector.
		 * You can also access the same value through the following aliases the
		 * [jQuery.Vector.prototype.left vector.left()] and [jQuery.Vector.prototype.left vector.width()]
		 * aliases.
		 *
		 * For example:
		 *
		 *      var v = new $.Vector(2, 5);
		 *      v.x() //-> 2
		 *      v.left() //-> 2
		 *      v.width() //-> 2
		 *
		 * @return {Number} The first value of the vector
		 */
		x: getSetZero,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.x].
		 *
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.x].
		 *
		 * @return {Number}
		 */
		width: getSetZero,
		/**
		 * Returns the second value of the vector.
		 * You can also access the same value through the [jQuery.Vector.prototype.top vector.top()]
		 * and [jQuery.Vector.prototype.height vector.height()] aliases.
		 *
		 * For example:
		 *
		 *      var v = new $.Vector(2, 5);
		 *      v.y() //-> 5
		 *      v.top() //-> 5
		 *      v.height() //-> 5
		 *
		 * @return {Number} The first value of the vector
		 */
		y: getSetOne,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.y].
		 *
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.y].
		 *
		 * @return {Number}
		 */
		height: getSetOne,
		/**
		 * Returns a string representation of the vector in the form of (x,y,...)
		 *
		 *      var v = new $.Vector(4, 6, 1, 3);
		 *      v.toString() //-> (4, 6, 1, 3)
		 *
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array.join(', ') + ")";
		},
		/**
		 * Replaces the vectors contents
		 *
		 *      var v = new $.Vector(2, 3);
		 *
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		// Get the first touch element for touch events
		var touches = "ontouchend" in document && this.originalEvent.touches && this.originalEvent.touches.length
				? this.originalEvent.changedTouches[0] : this;
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(touches.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0),
				touches.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(touches.pageX, touches.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};

	return $;
})(module["jquery"]);// ## jquery/event/livehack/livehack.js

module['jquery/event/livehack/livehack.js'] = (function($) {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		// events - the events object
		// types - an array of event types to look for
		// callback(type, handlerFunc, selector) - a callback
		// selector - an optional selector to filter with, if there, matches by selector
		//     if null, matches anything, otherwise, matches with no selector
		findHelper = function( events, types, callback, selector ) {
			var t, type, typeHandlers, all, h, handle,
				namespaces, namespace,
				match;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];

					match = (all || namespace.test(handle.namespace));

					if(match){
						if(selector){
							if (handle.selector === selector  ) {
								callback(type, handle.origHandler || handle.handler);
							}
						} else if (selector === null){
							callback(type, handle.origHandler || handle.handler, handle.selector);
						}
						else if (!handle.selector ) {
							callback(type, handle.origHandler || handle.handler);

						}
					}


				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = ( $._data(el) || {} ).events,
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}
		findHelper(events, types, function( type, handler ) {
			handlers.push(handler);
		}, selector);
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $._data(el).events,
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		/*$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});*/
		//then check straight binds
		findHelper(events, types, function( type, handler, selector ) {
			add(selector || "", type, handler);
		}, null);

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;

	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {
			var bySelector,
                            selector = handleObj.selector || "",
                            namespace  = handleObj.namespace ? '.'+handleObj.namespace : '';

			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent + namespace, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent + namespace, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};

	return $;
})(module["jquery"]);// ## jquery/event/reverse/reverse.js

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
})(module["jquery"]);// ## jquery/event/drag/drag.js

module['jquery/event/drag/drag.js'] = (function( $ ) {

	if(!$.event.special.move) {
		$.event.reverse('move');
	}

	//modify live
	//steal the live handler ....
	var bind = function( object, method ) {
			var args = Array.prototype.slice.call(arguments, 2);
			return function() {
				var args2 = [this].concat(args, $.makeArray(arguments));
				return method.apply(object, args2);
			};
		},
		event = $.event,
		// function to clear the window selection if there is one
		clearSelection = window.getSelection ? function(){
			window.getSelection().removeAllRanges()
		} : function(){},

		supportTouch = "ontouchend" in document,
		// Use touch events or map it to mouse events
		startEvent = supportTouch ? "touchstart" : "mousedown",
		stopEvent = supportTouch ? "touchend" : "mouseup",
		moveEvent = supportTouch ? "touchmove" : "mousemove",
		// On touchmove events the default (scrolling) event has to be prevented
		preventTouchScroll = function(ev) {
			ev.preventDefault();
		};

	/**
	 * @class jQuery.Drag
	 * @parent jQuery.event.drag
	 * @plugin jquery/event/drag
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/drag.js
	 * @test jquery/event/drag/qunit.html
	 *
	 * The `$.Drag` constructor is never called directly but an instance of `$.Drag` is passed as the second argument
	 * to the `dragdown`, `draginit`, `dragmove`, `dragend`, `dragover` and `dragout` event handlers:
	 *
	 *      $('#dragger').on('draginit', function(el, drag) {
	 *          // drag -> $.Drag
	 *      });
	 */
	$.Drag = function() {};

	/**
	 * @Static
	 */
	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		distance: 0,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown: function( ev, element ) {
			var isLeftButton = ev.button === 0 || ev.button == 1,
				doEvent = isLeftButton || supportTouch;

			if (!doEvent || this.current ) {
				return;
			}

			//create Drag
			var drag = new $.Drag(),
				delegate = ev.delegateTarget || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.delegateTarget || element,
				selector: ev.handleObj.selector,
				moved: false,
				_distance: this.distance,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector),
					dragcleanup: event.find(delegate, ["dragcleanup"], selector)
				},
				destroyed: function() {
					self.current = null;
				}
			}, ev);
		}
	});

	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype, {
		setup: function( options, ev ) {
			$.extend(this, options);

			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			this._distance = options.distance ? options.distance : 0;

			//where the mouse is located
			this.mouseStartPosition = ev.vector();

			$(document).bind(moveEvent, mousemove);
			$(document).bind(stopEvent, mouseup);
			if(supportTouch) {
				// On touch devices we want to disable scrolling
				$(document).bind(moveEvent, preventTouchScroll);
			}

			if (!this.callEvents('down', this.element, ev) ) {
			    this.noSelection(this.delegate);
				//this is for firefox
				clearSelection();
			}
		},
		/**
		 * @attribute element
		 * A reference to the element that is being dragged. For example:
		 *
		 *      $('.draggable').on('draginit', function(ev, drag) {
		 *          drag.element.html('I am the drag element');
		 *      });
		 */

		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy: function() {
			// Unbind the mouse handlers attached for dragging
			$(document).unbind(moveEvent, this._mousemove);
			$(document).unbind(stopEvent, this._mouseup);
			if(supportTouch) {
				// Enable scrolling again for touch devices when the drag is done
				$(document).unbind(moveEvent, preventTouchScroll);
			}

			if (!this.moved ) {
				this.event = this.element = null;
			}

			if(!supportTouch) {
                this.selection(this.delegate);
			}
			this.destroyed();
		},
		mousemove: function( docEl, ev ) {
			if (!this.moved ) {
				var dist = Math.sqrt( Math.pow( ev.pageX - this.event.pageX, 2 ) + Math.pow( ev.pageY - this.event.pageY, 2 ));
				// Don't initialize the drag if it hasn't been moved the minimum distance
				if(dist < this._distance){
					return false;
				}
				// Otherwise call init and indicate that the drag has moved
				this.init(this.element, ev);
				this.moved = true;
			}

			this.element.trigger('move', this);
			var pointer = ev.vector();
			if ( this._start_position && this._start_position.equals(pointer) ) {
				return;
			}
			this.draw(pointer, ev);
		},

		mouseup: function( docEl, event ) {
			//if there is a current, we should call its dragstop
			if ( this.moved ) {
				this.end(event);
			}
			this.destroy();
		},

        /**
         * The `drag.noSelection(element)` method turns off text selection during a drag event.
         * This method is called by default unless a event is listening to the 'dragdown' event.
         *
         * ## Example
         *
         *      $('div.drag').bind('dragdown', function(elm,event,drag){
         *          drag.noSelection();
         *      });
         *
         * @param [elm] an element to prevent selection on.  Defaults to the dragable element.
         */
		noSelection: function(elm) {
            elm = elm || this.delegate
			document.documentElement.onselectstart = function() {
                // Disables selection
				return false;
			};
			document.documentElement.unselectable = "on";
			this.selectionDisabled = (this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm));
			this.selectionDisabled.css('-moz-user-select', '-moz-none');
		},

        /**
         * @hide
         * `drag.selection()` method turns on text selection that was previously turned off during the drag event.
         * This method is always called.
         *
         * ## Example
         *
         *     $('div.drag').bind('dragdown', function(elm,event,drag){
         *       drag.selection();
         *     });
         */
		selection: function() {
            if(this.selectionDisabled) {
                document.documentElement.onselectstart = function() {};
                document.documentElement.unselectable = "off";
                this.selectionDisabled.css('-moz-user-select', '');
            }
		},

		init: function( element, event ) {
			element = $(element);
			//the element that has been clicked on
			var startElement = (this.movingElement = (this.element = $(element)));
			//if a mousemove has come after the click
			//if the drag has been cancelled
			this._cancelled = false;
			this.event = event;

			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			this.callEvents('init', element, event);

			// Check what they have set and respond accordingly if they canceled
			if ( this._cancelled === true ) {
				return;
			}
			// if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			// Adjust the drag elements z-index to a high value
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder ) {
				// calls $.Drop.prototype.compile if there is a drop element
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function( that ) {
			var style, pos = that.css('position');

			// Position properly, set top and left to 0px for Opera
			if (!pos || pos == 'static' ) {
				style = {
					position: 'relative'
				};

				if ( window.opera ) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function( type, element, event, drop ) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for ( i = 0; i < cbs.length; i++ ) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {$.Vector}
		 */
		currentDelta: function() {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function( pointer, event ) {
			// only drag if we haven't been cancelled;
			if ( this._cancelled ) {
				return;
			}
			clearSelection();
			/**
			 * @attribute location
			 * `drag.location` is a [jQuery.Vector] specifying where the element should be in the page.  This
			 * takes into account the start position of the cursor on the element.
			 *
			 * If the drag is going to be moved to an unacceptable location, you can call preventDefault in
			 * dragmove to prevent it from being moved there.
			 *
			 *     $('.mover').bind("dragmove", function(ev, drag){
			 *       if(drag.location.top() < 100){
			 *         ev.preventDefault()
			 *       }
			 *     });
			 *
			 * You can also set the location to where it should be on the page.
			 *
			 */
				// the offset between the mouse pointer and the representative that the user asked for
			this.location = pointer.minus(this.mouseElementPosition);

			// call move events
			this.move(event);
			if ( this._cancelled ) {
				return;
			}
			if (!event.isDefaultPrevented() ) {
				this.position(this.location);
			}

			// fill in
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.show(pointer, this, event);
			}
		},
		/**
		 * `drag.position( newOffsetVector )` sets the position of the movingElement.  This is overwritten by
		 * the [$.Drag::scrolls], [$.Drag::limit] and [$.Drag::step] plugins
		 * to make sure the moving element scrolls some element
		 * or stays within some boundary.  This function is exposed and documented so you could do the same.
		 *
		 * The following approximates how step does it:
		 *
		 *     var oldPosition = $.Drag.prototype.position;
		 *     $.Drag.prototype.position = function( offsetPositionv ) {
		 *       if(this._step){
		 *         // change offsetPositionv to be on the step value
		 *       }
		 *
		 *       oldPosition.call(this, offsetPosition)
		 *     }
		 *
		 * @param {jQuery.Vector} newOffsetv the new [$.Drag::location] of the element.
		 */
		position: function( newOffsetv ) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
				//  the drag element's current left + top css attributes
				// the vector between the movingElement's page and css positions
				// this can be thought of as the original offset
				dragged_element_position_vector =   this.movingElement.offsetv().minus(dragged_element_css_offset);
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal ) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical ) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function( event ) {
			this.callEvents('move', this.element, event);
		},
		over: function( event, drop ) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function( event, drop ) {
			this.callEvents('out', this.element, event, drop);
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end: function( event ) {
			// If canceled do nothing
			if ( this._cancelled ) {
				return;
			}
			// notify the responder - usually a $.Drop instance
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if ( this._revert ) {
				var self = this;
				// animate moving back to original position
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function() {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup(event);
			}
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup: function(event) {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if ( this.movingElement[0] !== this.element[0] &&
				!this.movingElement.has(this.element[0]).length &&
				!this.element.has(this.movingElement[0]).length ) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if ( this._removeMovingElement ) {
				// Remove the element when using drag.ghost()
				this.movingElement.remove();
			}

			if(event) {
				this.callEvents('cleanup', this.element, event);
			}

			this.movingElement = this.element = this.event = null;
		},
		/**
		 * `drag.cancel()` stops a drag motion from from running.  This also stops any other events from firing, meaning
		 * that "dragend" will not be called.
		 *
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       if(drag.movingElement.hasClass("evil")){
		 *         drag.cancel();
		 *       }
		 *     })
		 *
		 */
		cancel: function() {
			this._cancelled = true;
			if (!this._only && this.constructor.responder ) {
				// clear the drops
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},
		/**
		 * `drag.ghost( [parent] )` clones the element and uses it as the
		 * moving element, leaving the original dragged element in place.  The `parent` option can
		 * be used to specify where the ghost element should be temporarily added into the
		 * DOM.  This method should be called in "draginit".
		 *
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       drag.ghost();
		 *     })
		 *
		 * @param {HTMLElement} [parent] the parent element of the newly created ghost element. If not provided the
		 * ghost element is added after the moving element.
		 * @return {jQuery.fn} the ghost element to do whatever you want with it.
		 */
		ghost: function( parent ) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			if( parent ) {
				$(parent).append(ghost);
			} else {
				$(this.movingElement).after(ghost)
			}
			ghost.width(this.movingElement.width()).height(this.movingElement.height());
			// put the ghost in the right location ...
			ghost.offset(this.movingElement.offset())

			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this.noSelection(ghost)
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * `drag.representative( element, [offsetX], [offsetY])` tells the drag motion to use
		 * a different element than the one that began the drag motion.
		 *
		 * For example, instead of
		 * dragging an drag-icon of a todo element, you want to move some other representation of
		 * the todo element (or elements).  To do this you might:
		 *
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       // create what we'll drag
		 *       var rep = $('<div/>').text("todos")
		 *         .appendTo(document.body)
		 *       // indicate we want our mouse on the top-right of it
		 *       drag.representative(rep, rep.width(), 0);
		 *     })
		 *
		 * @param {HTMLElement} element the element you want to actually drag.  This should be
		 * already in the DOM.
		 * @param {Number} offsetX the x position where you want your mouse on the representative element (defaults to 0)
		 * @param {Number} offsetY the y position where you want your mouse on the representative element (defaults to 0)
		 * @return {drag} returns the drag object for chaining.
		 */
		representative: function( element, offsetX, offsetY ) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;
			// Just set the representative as the drag element
			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
			this.noSelection(this.movingElement)
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
			return this;
		},
		/**
		 * `drag.revert([val])` makes the [$.Drag::representative representative] element revert back to it
		 * original position after the drag motion has completed.  The revert is done with an animation.
		 *
		 *     $("#todos").on(".handle","dragend",function( ev, drag ) {
		 *       drag.revert();
		 *     })
		 *
		 * @param {Boolean} [val] optional, set to false if you don't want to revert.
		 * @return {drag} the drag object for chaining
		 */
		revert: function( val ) {
			this._revert = val === undefined ? true : val;
			return this;
		},
		/**
		 * `drag.vertical()` isolates the drag to vertical movement.  For example:
		 *
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.vertical();
		 *     });
		 *
		 * Call `vertical()` in "draginit" or "dragdown".
		 *
		 * @return {drag} the drag object for chaining.
		 */
		vertical: function() {
			this._vertical = true;
			return this;
		},
		/**
		 * `drag.horizontal()` isolates the drag to horizontal movement.  For example:
		 *
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.horizontal();
		 *     });
		 *
		 * Call `horizontal()` in "draginit" or "dragdown".
		 *
		 * @return {drag} the drag object for chaining.
		 */
		horizontal: function() {
			this._horizontal = true;
			return this;
		},
		/**
		 * `drag.only([only])` indicates if you __only__ want a drag motion and the drag should
		 * not notify drops.  The default value is `false`.  Call it with no arguments or pass it true
		 * to prevent drop events.
		 *
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 * 	     drag.only();
		 *     });
		 *
		 * @param {Boolean} [only] true if you want to prevent drops, false if otherwise.
		 * @return {Boolean} the current value of only.
		 */
		only: function( only ) {
			return (this._only = (only === undefined ? true : only));
		},

		/**
		 * `distance([val])` sets or reads the distance the mouse must move before a drag motion is started.  This should be set in
		 * "dragdown" and delays "draginit" being called until the distance is covered.  The distance
		 * is measured in pixels.  The default distance is 0 pixels meaning the drag motion starts on the first
		 * mousemove after a mousedown.
		 *
		 * Set this to make drag motion a little "stickier" to start.
		 *
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 *       drag.distance(10);
		 *     });
		 *
		 * @param {Number} [val] The number of pixels the mouse must move before "draginit" is called.
		 * @return {drag|Number} returns the drag instance for chaining if the drag value is being set or the
		 * distance value if the distance is being read.
		 */
		distance: function(val){
			if(val !== undefined){
				this._distance = val;
				return this;
			}else{
				return this._distance
			}
		}
	});
	/**
	 * @add jQuery.event.special
	 */
	event.setupHelper([
	/**
	 * @attribute dragdown
	 * @parent jQuery.event.drag
	 *
	 * `dragdown` is called when a drag movement has started on a mousedown.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.  Listening to `dragdown` allows you to customize
	 * the behavior of a drag motion, especially when `draginit` should be called.
	 *
	 *     $(".handles").delegate("dragdown", function(ev, drag){
	 *       // call draginit only when the mouse has moved 20 px
	 *       drag.distance(20);
	 *     })
	 *
	 * Typically, when a drag motion is started, `event.preventDefault` is automatically
	 * called, preventing text selection.  However, if you listen to
	 * `dragdown`, this default behavior is not called. You are responsible for calling it
	 * if you want it (you probably do).
	 *
	 * ### Why might you not want to call `preventDefault`?
	 *
	 * You might want it if you want to allow text selection on element
	 * within the drag element.  Typically these are input elements.
	 *
	 *     $(".handles").delegate("dragdown", function(ev, drag){
	 *       if(ev.target.nodeName === "input"){
	 *         drag.cancel();
	 *       } else {
	 *         ev.preventDefault();
	 *       }
	 *     })
	 */
	'dragdown',
	/**
	 * @attribute draginit
	 * @parent jQuery.event.drag
	 *
	 * `draginit` is triggered when the drag motion starts. Use it to customize the drag behavior
	 * using the [jQuery.Drag] instance passed as the second parameter:
	 *
	 *     $(".draggable").on('draginit', function(ev, drag) {
	 *       // Only allow vertical drags
	 *       drag.vertical();
	 *       // Create a draggable copy of the element
	 *       drag.ghost();
	 *     });
	 */
	'draginit',
	/**
	 * @attribute dragover
	 * @parent jQuery.event.drag
	 *
	 * `dragover` is triggered when a drag is over a [jQuery.event.drop drop element].
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter and an instance of [jQuery.Drop] passed as the third argument:
	 *
	 *      $('.draggable').on('dragover', function(ev, drag, drop) {
	 *          // Add the drop-here class indicating that the drag
	 *          // can be dropped here
	 *          drag.element.addClass('drop-here');
	 *      });
	 */
	'dragover',
	/**
	 * @attribute dragmove
	 * @parent jQuery.event.drag
	 *
	 * `dragmove` is triggered when the drag element moves (similar to a mousemove).
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 * Use [jQuery.Drag::location] to determine the current position
	 * as a [jQuery.Vector vector].
	 *
	 * For example, `dragmove` can be used to create a draggable element to resize
	 * a container:
	 *
	 *      $('.resizer').on('dragmove', function(ev, drag) {
	 *          $('#container').width(drag.location.x())
	 *              .height(drag.location.y());
	 *      });
	 */
	'dragmove',
	/**
	 * @attribute dragout
	 * @parent jQuery.event.drag
	 *
	 * `dragout` is called when the drag leaves a drop point.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *      $('.draggable').on('dragout', function(ev, drag) {
	 *      	 // Remove the drop-here class
	 *      	 // (e.g. crossing the drag element out indicating that it
	 *      	 // can't be dropped here
	 *          drag.element.removeClass('drop-here');
	 *      });
	 */
	'dragout',
	/**
	 * @attribute dragend
	 * @parent jQuery.event.drag
	 *
	 * `dragend` is called when the drag operation is completed.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *     $('.draggable').on('dragend', function(ev, drag)
	 *       // Calculation on whether revert should be invoked, alterations based on position of the end event
	 *     });
	 */
	'dragend',
        /**
	 * @attribute dragcleanup
	 * @parent jQuery.event.drag
	 *
	 * `dragcleanup` is called after dragend and revert (if applied)
         * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *     $('.draggable').on('dragcleanup', function(ev, drag)
	 *         // cleanup
	 *     });
	 */
	'dragcleanup'], startEvent, function( e ) {
		$.Drag.mousedown.call($.Drag, e, this);
	});

	return $;
})(module["jquery"], module["jquery/lang/vector/vector.js"], module["jquery/event/livehack/livehack.js"], module["jquery/event/reverse/reverse.js"]);// ## jquery/dom/styles/styles.js

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
})(module["jquery"]);// ## jquery/event/drag/limit/limit.js

module['jquery/event/drag/limit/limit.js'] = (function( $ ) {


	$.Drag.prototype
	/**
	 * @function limit
	 * @plugin jquery/event/drag/limit
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/event/drag/limit/limit.js
	 * `drag.limit(container, [center])` limits a drag to a containing element.
	 *
	 *     $("#todos").on(".todo","draginit", function( ev, drag ) {
	 *       drag.limit($("#todos").parent())
	 *     })
	 *
	 * @param {jQuery} container the jQuery-wrapped container element you do not want the drag element to escape.
	 * @param {String} [center] can set the limit to the center of the object.  Can be
	 *   'x', 'y' or 'both'.  By default it will keep the outer edges of the moving element within the
	 * container element.  If you provide x, it will keep the horizontal center of the moving element
	 * within the container element.  If you provide y, it will keep the vertical center of the moving
	 * element within the container element.  If you provide both, it will keep the center of the
	 * moving element within the containing element.
	 * @return {drag} returns the drag for chaining.
	 */
	.limit = function( container, center ) {
		//on draws ... make sure this happens
		var styles = container.styles('borderTopWidth', 'paddingTop', 'borderLeftWidth', 'paddingLeft'),
			paddingBorder = new $.Vector(
			parseInt(styles.borderLeftWidth, 10) + parseInt(styles.paddingLeft, 10) || 0, parseInt(styles.borderTopWidth, 10) + parseInt(styles.paddingTop, 10) || 0);

		this._limit = {
			offset: container.offsetv().plus(paddingBorder),
			size: container.dimensionsv(),
			center : center === true ? 'both' : center
		};
		return this;
	};

	var oldPosition = $.Drag.prototype.position;
	$.Drag.prototype.position = function( offsetPositionv ) {
		//adjust required_css_position accordingly
		if ( this._limit ) {
			var limit = this._limit,
				center = limit.center && limit.center.toLowerCase(),
				movingSize = this.movingElement.dimensionsv('outer'),
				halfHeight = center && center != 'x' ? movingSize.height() / 2 : 0,
				halfWidth = center && center != 'y' ? movingSize.width() / 2 : 0,
				lot = limit.offset.top(),
				lof = limit.offset.left(),
				height = limit.size.height(),
				width = limit.size.width();

			//check if we are out of bounds ...
			//above
			if ( offsetPositionv.top()+halfHeight < lot ) {
				offsetPositionv.top(lot - halfHeight);
			}
			//below
			if ( offsetPositionv.top() + movingSize.height() - halfHeight > lot + height ) {
				offsetPositionv.top(lot + height - movingSize.height() + halfHeight);
			}
			//left
			if ( offsetPositionv.left()+halfWidth < lof ) {
				offsetPositionv.left(lof - halfWidth);
			}
			//right
			if ( offsetPositionv.left() + movingSize.width() -halfWidth > lof + width ) {
				offsetPositionv.left(lof + width - movingSize.left()+halfWidth);
			}
		}

		oldPosition.call(this, offsetPositionv);
	};

	return $;
})(module["jquery"], module["jquery/event/drag/drag.js"], module["jquery/dom/styles/styles.js"]);// ## jquery/event/drag/step/step.js

module['jquery/event/drag/step/step.js'] = (function( $ ) {
	var round = function( x, m ) {
		return Math.round(x / m) * m;
	}

	$.Drag.prototype.
	/**
	 * @function step
	 * @plugin jquery/event/drag/step
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/step/step.js
	 * makes the drag move in steps of amount pixels.
	 *
	 *     drag.step({x: 5}, $('foo'), "xy")
	 *
	 * ## Demo
	 *
	 * @demo jquery/event/drag/step/step.html
	 *
	 * @param {number|Object} amount make the drag move the amount in pixels from the top-left of container.
	 *
	 * If the amount is a `number`, the drag will move step-wise that number pixels in both
	 * dimensions.  If it's an object like `{x: 20, y: 10}` the drag will move in steps 20px from
	 * left to right and 10px up and down.
	 *
	 * @param {jQuery} [container] the container to move in reference to.  If not provided, the document is used.
	 * @param {String} [center] Indicates how to position the drag element in relationship to the container.
	 *
	 *   -  If nothing is provided, places the top left corner of the drag element at
	 *      'amount' intervals from the top left corner of the container.
	 *   -  If 'x' is provided, it centers the element horizontally on the top-left corner.
	 *   -  If 'y' is provided, it centers the element vertically on the top-left corner of the container.
	 *   -  If 'xy' is provided, it centers the element on the top-left corner of the container.
	 *
	 * @return {jQuery.Drag} the drag object for chaining.
	 */
	step = function( amount, container, center ) {
		//on draws ... make sure this happens
		if ( typeof amount == 'number' ) {
			amount = {
				x: amount,
				y: amount
			}
		}
		container = container || $(document.body);
		this._step = amount;

		var styles = container.styles("borderTopWidth", "paddingTop", "borderLeftWidth", "paddingLeft");
		var top = parseInt(styles.borderTopWidth) + parseInt(styles.paddingTop),
			left = parseInt(styles.borderLeftWidth) + parseInt(styles.paddingLeft);

		this._step.offset = container.offsetv().plus(left, top);
		this._step.center = center;
		return this;
	};

	(function() {
		var oldPosition = $.Drag.prototype.position;
		$.Drag.prototype.position = function( offsetPositionv ) {
			//adjust required_css_position accordingly
			if ( this._step ) {
				var step = this._step,
					center = step.center && step.center.toLowerCase(),
					movingSize = this.movingElement.dimensionsv('outer'),
					lot = step.offset.top()- (center && center != 'x' ? movingSize.height() / 2 : 0),
					lof = step.offset.left() - (center && center != 'y' ? movingSize.width() / 2 : 0);

				if ( this._step.x ) {
					offsetPositionv.left(Math.round(lof + round(offsetPositionv.left() - lof, this._step.x)))
				}
				if ( this._step.y ) {
					offsetPositionv.top(Math.round(lot + round(offsetPositionv.top() - lot, this._step.y)))
				}
			}

			oldPosition.call(this, offsetPositionv)
		}
	})();

	return $;
})(module["jquery"], module["jquery/event/drag/drag.js"], module["jquery/dom/styles/styles.js"]);// ## canui/incubator/slider/slider.js

module['canui/incubator/slider/slider.js'] = (function() {

	/**
	 * @class can.ui.Slider
	 * @test canui/slider/slider_test.js
	 * @parent canui
	 *
	 * @description Creates a slider with `min`, `max` and `interval` options.
	 * Creates a slider with `min`, `max` and `interval` options.
	 *
	 * Given the following markup:
	 *
	 *		<div class="container">
	 *			<div id="slider"></div>
	 *		</div>
	 *
	 * You can create a slider with the following code:
	 *
	 *      var slider = new can.ui.Slider($('#slider'), {
	 *			interval: 1,
	 *			min: 1,
	 *			max: 10,
	 *			val: 4
	 *		});
	 *
	 *	The targeted element then becomes a draggable box within the bounding
	 *	box of it's parent element. You can then call the val method to
	 *	retrieve it's current value:
	 *
	 *	    slider.val() // 4
	 *
	 *	You can also use the `val` method as a setter:
	 *
	 *		slider.val(6)
	 *
	 *	Alternatively, you can subscribe to the `change` event on the slider,
	 *	which will pass the value as the second argument to the event handler.
	 *
	 *		$("#slider").change(function( e, value ) {
	 *			value; // 6
	 *		});
	 *
	 * ## Demo
	 * @demo canui/slider/slider.html
	 *
	 * @param {Object} options - An object literal describing the range,
	 * interval and starting value of the slider
	 *
	 *	- `min` {Number} - The minimum value the slider can go down to.
	 *	- `max` {Number} - The maximum value the slider can go up to.
	 *	- `interval` {Number} - The step size that the slider should increment
	 *	by when being moved.
	 *	- `val` {Number} - The initial starting value of the slider.
	 * - `dim` {String} - The orientation of the slider.  Possible options are:
	 *	'h' for horiztonal or 'v' for vertical.
	 * - `range` {String,Boolean} - A 'min' range goes from the slider min to one handle.
	 *	A 'max' range goes from one handle to the slider max.  Defaults to 'false'.
	 * `contained` {Boolean} - If the slider is contained in the parent.
	 */
	can.Control("ui.Slider",
	/**
	 * @hide
	 * @static
	 */
	{
		defaults: {
			min: 0,
			max: 10,
			step : 1,
			contained : true,
			val : undefined,
			orientation: "h",
			range: false,
			animate: true
		},
		dimMap:{
			h: {
				outer: "outerWidth",
				offset: "left",
				border: "borderLeft",
				padding: "paddingLeft",
				dim: "width",
				pos: "clientX"
			},
			v: {
				outer: "outerHeight",
				offset: "top",
				border: "borderTop",
				padding: "paddingTop",
				dim: "height",
				pos: "clientY"
			}
		}
	},
	/**
	 * @prototype
	 */
	{
		init: function() {
			this.element.css("position", 'relative');
			this.dimMap = this.constructor.dimMap[this.options.orientation];

			for(var optionName in this.options){
				this.options[optionName] = can.compute(this.options[optionName])
			}

			if(this.options.contained){
				this.options.parent = this.element.parent();
			}

			if(this.options.range()){
				this.element[this.options.range() === "min"
					? 'before' : 'after']("<div class='slider-fill bar' />");
			}

			this.on();
			if ( this.options.val() ) {
				this.updatePosition()
			}

			this.element.text((this.options.val() || 0) + '%')
		},
		resize: function() {
			this.updatePosition();
		},
		getDimensions: function() {
			var spots = this.options.max() - this.options.min() + 1,
				parent = this.element.parent(),
				outer = this.element[this.dimMap.outer](),
				styles, space;

			this.dimToMove = parent[this.dimMap.dim]() - outer;
			this.dimOfSpot = this.dimToMove / (spots - 1);

			styles = parent.styles(this.dimMap.border, this.dimMap.padding);
			space = parseInt(styles[this.dimMap.border]) + parseInt(styles[this.dimMap.padding]) || 0;

			this.start = parent.offset()[this.dimMap.offset] + space - (this.options.contained() ? 0 : Math.round(outer / 2));
		},
		"draginit": function( el, ev, drag ) {
			this.getDimensions();
			drag.limit(this.element.parent(), this.options.contained ? undefined : this.dimMap.offset)
				.step(this.dimOfSpot, this.element.parent());
			this.element.addClass('dragging');
		},
		"dragmove": function( el, ev, drag ) {
			var current = this.determineValue();
			if(this.lastMove !== current){
				this.element.trigger( "changing", current );
				this.lastMove = current;
				this.updateRange(Math.round((current - this.options.min()) * this.dimOfSpot));
			}
		},
		"dragend": function( el, ev, drag ) {
			this.options.val( this.determineValue() )
			this.element.removeClass('dragging');
		},
		determineValue : function(offset) {
			var offset = (offset || this.element.offset()[this.dimMap.offset]) - this.start,
				spot = Math.round(offset / this.dimOfSpot);
			return spot + this.options.min();
		},
		updatePosition: function() {
			this.getDimensions();
			var dim = Math.round((this.options.val() - this.options.min()) * this.dimOfSpot);

			var offset = {};
			offset[this.dimMap.offset] = dim;

			if(this.options.animate()){
				this.element.animate(offset, 'fast');
			} else {
				offset[this.dimMap.offset] = this.start + dim
				this.element.offset(offset);
			}

			this.updateRange(dim);
		},
		updateRange:function(dim){
			if(this.options.range()){
				this.element[this.options.range() === "min" ?
					"prev" : "next"]()[this.dimMap.dim](dim);
			}
		},
		/**
		 * @param {Number} value - Optional. The new value for the slider. If
		 * omitted, the current value is returned.
		 * @return {Number}
		 */
		val: function( value ) {
			if(value != undefined){
				if(value < this.options.min()){
					value = this.options.min();
				} else if(value > this.options.max()){
					value = this.options.max();
				}
			}

			return this.options.val(value)
		},
		"{val} change" : function(){
			this.lastMove = this.options.val();
			this.updatePosition();

			this.element.text(this.lastMove + "%")

			this.element.trigger("changing", this.lastMove)
						.trigger("change", this.lastMove);
		},
		"{parent} click":function(elm,ev){
			if(ev.srcElement != this.element[0]){
				this.getDimensions();
				this.options.val(this.determineValue(ev[this.dimMap.pos]));
			}
		}
	})

})(module["can/construct/proxy/proxy.js"], module["can/control/control.js"], module["can/observe/compute/compute.js"], module["jquery/event/drag/limit/limit.js"], module["jquery/event/drag/step/step.js"], module["jquery/dom/styles/styles.js"]);

window.define = module._define;

window.module = module._orig;

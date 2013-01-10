steal('can/util/function',
	  'can/construct/super',
	  'can/control',
	  'can/control/plugin', 
	  'can/control/modifier',
	  'ui/position',
	  './tip.less',
function() {

can.Control("ui.Tip",{
	defaults:{
		placement: 'top',
		title: undefined,
		showDelay: 100,
		hideDelay: 100,
		showEvent: 'mouseenter',
		hideEvent: 'mouseleave',
		offset: undefined,
		collision: 'flip',
		template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		elm: undefined
	},
	positions: {
		top : {
			my: "bottom",
			at: "top"
		},
		left : {
			my: "right",
			at: "left"
		},
		right : {
			my: "left",
			at: "right"
		},
		bottom : {
			my: "top",
			at: "bottom"
		}
	}
},{

	init:function(){
		// if a 'elm' to listen on was not defined
		// assume we are on the element we were called on
		if(!this.options.elm){
			this.options.elm = this.element;
			this.on();
		}

		var offsetParent = this.element.offsetParent();
		this.tooltip = $(this.options.template).appendTo(offsetParent);
	},

	update:function(options){
		if(options.title){
			this.tooltip.find('.tooltip-inner').html(options.title);
		}

		this._super.apply(this, arguments);
	},

	attr:function (elm, attr) {
		return this.options[attr] || elm.attr('data-' + attr);
	},

	// =============================== Visibility ===============================

	show:function(elm,event){
		clearTimeout(this.hideTimeout);
		this.showTimeout = setTimeout(this.proxy(function(){	
			this.tooltip.find('.tooltip-inner').html(this.attr(elm, 'title'));

			// move item
			this.tooltip.fadeIn('fast');
			this.tooltip.css({ left:0, top:0 });
			var pos = this.constructor.positions[this.options.placement];
			this.tooltip.position({
				my: pos.my,
				at: pos.at,
				of: elm || event
			});

			// detect if we flipped it and adjust css classes
			// we have to run this everytime to make sure we
			// get reset after a movement.
			var flipped = this.tooltip.attr('class').match(/\bui-flipped-\S+/g),
				position = flipped ? flipped[0].replace('ui-flipped-', '') : this.attr(elm, 'placement');

			this.tooltip.removeClass(function (index, css) {
	    		return (css.match(/\bpos-\S+/g) || []).join(' ');
			}).addClass("pos-" + position);

			// trigger events
			(elm || this.options.elm).trigger('shown');
		}), this.options.showDelay);
	},

	hide:function(elm,event){	
		clearTimeout(this.showTimeout);
		this.hideTimeout = setTimeout(this.proxy(function(){
			this.tooltip.fadeOut('fast');
			(elm || this.options.elm).trigger('hidden');
		}), this.options.hideDelay);
	},

	move:function(elm,ev){
		this.tooltip.css({ left:0, top:0 })
		this.tooltip.position({
			my: pos.my,
			at: pos.at,
			of: elm
		});
	},

	// =============================== Events ===============================

	"{elm} {showEvent}": "show",

	"{elm} {hideEvent}": "hide",

	"{elm} move": "move",

	"{window} resize:debounce(100)": "move"

});

});
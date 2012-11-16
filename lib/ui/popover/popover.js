steal('can/util/function',
	  'can/construct/super',
	  'can/control',
	  'can/control/plugin',
	  'can/control/modifier',
	  'can/view/ejs',
	  'can/view/modifiers')
.then('ui/position',
      './popover.less',
      './views/init.ejs',
function() {

	can.Control("ui.Popover",{
		defaults:{
			placement: 'top',
			offset: {},
			hideDelay: false,
			mouseLeaveDelay: 500,
			template: '//ui/popover/views/init.ejs'
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

		setup:function(el,options){
			options = $.extend( this.constructor.defaults, options || {} );
			var view = $(can.view.render(options.template, {})).appendTo(el);
			this._super(view, options);
		},

		init:function(){
			//this.positionable = new can.ui.Positionable(this.element,
			//	can.extend(this.constructor.positions[this.options.placement],
			//		{ offset: this.options.offset }));
		},

		update:function(options){
			if(options.offset){
				this.positionable.update({ offset: options.offset })
			}

			if(options.placement){
				this.positionable.update(this.constructor.positions[options.placement])
			}

			this._super(options);
		},

		// =============================== Visibility ===============================

		show:function(header, content, target){
			// Set header/content
			if(header){
				this.element.find('.popover-title').html(header).show();
			} else {
				this.element.find('.popover-title').hide();
			}
			this.element.find('.popover-content').html(content);

			// move item
			this.element.fadeIn('fast').trigger('move', target);

			// detect if we flipped it and adjust css classes
			// we have to run this everytime to make sure we
			// get reset after a movement.
			var flipped = this.element.attr('class').match(/\bui-flipped-\S+/g),
				position = flipped ? flipped[0].replace('ui-flipped-', '') : this.options.placement;

			this.element.removeClass(function (index, css) {
	    		return (css.match(/\bpos-\S+/g) || []).join(' ');
			}).addClass("pos-" + position);

			// trigger events
			this.element.trigger('shown');
			this.hideWithDelay();
		},

		hide:function(){
			this.element.fadeOut('fast');
			this.element.trigger('hidden');
		},

		hideWithDelay:function(delay){
			if(delay || this.options.hideDelay){
				this.timeout = setTimeout(this.proxy('hide'), delay || this.options.hideDelay)
			}
		},

		// =============================== Events ===============================

		" show":function(elm, ev, header, content, target){
			this.show(header, content, target || ev);
		},

		" hide":function(elm,ev){
			this.hide();
		},

		" mouseenter": function(elm, ev) {
			clearTimeout(this.timeout);
		},

		" mousemove": function(elm, ev) {
			clearTimeout(this.timeout);
		},

		" mouseleave": function(elm, ev) {
			this.hideWithDelay(this.options.mouseLeaveDelay);
		},

		"{window} resize:debounce(100)": function() {
			this.element.triggerHandler('move');
		}

	});

});

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
			showDelay: 100,
			hideDelay: 100,
			showEvent: 'mouseenter',
			hideEvent: 'mouseleave',
			collision: 'flip',
			template: '//ui/popover/views/init.ejs',
			parent: document.body
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
			this.tooltip = $(can.view.render(this.options.template, {})).appendTo(this.options.parent);
		},

		attr:function (attr) {
			return this.options[attr] || this.element.attr('data-' + attr);
		},

		// =============================== Visibility ===============================

		show:function(elm,ev){
			clearTimeout(this.hideTimeout);
			this.showTimeout = setTimeout(this.proxy(function(){
				var title = this.attr('title');
				this.tooltip.find('.popover-title').html(title)[title ? 'show' : 'hide']();
				this.tooltip.find('.popover-content').html(this.attr('content'));

				var pos = this.constructor.positions[this.options.placement];
				this.tooltip.css({ left:0, top:0 })
				this.tooltip.position({
					my: pos.my,
					at: pos.at,
					of: this.element
				})
				this.tooltip.fadeIn('fast');

				// detect if we flipped it and adjust css classes
				// we have to run this everytime to make sure we
				// get reset after a movement.
				var flipped = this.tooltip.attr('class').match(/\bui-flipped-\S+/g),
					position = flipped ? flipped[0].replace('ui-flipped-', '') : this.options.placement;
				this.tooltip.removeClass(function (index, css) {
		    		return (css.match(/\bpos-\S+/g) || []).join(' ');
				}).addClass("pos-" + position);

				// trigger events
				this.element.trigger('shown');
			}), this.options.showDelay);
		},

		hide:function(){
			clearTimeout(this.showTimeout);
			this.hideTimeout = setTimeout(this.proxy(function(){
				this.tooltip.fadeOut('fast');
				this.element.trigger('hidden');
			}), this.options.hideDelay);
		},

		// =============================== Events ===============================

		" {showEvent}": "show",

		" {hideEvent}": "hide",

		" move": "move"

	});

});

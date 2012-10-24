steal('can/control',
	  'can/control/plugin',
	  'ui/position',
      './dropdown.less',
function(){

	can.Control('ui.Dropdown',{
		defaults:{
			position:{
	 			my: "left top",
				at: "left bottom",
	 			keep: true
			}
		}
	},{

		init:function(){
			this.element.addClass('dropdown-menu');
		},

		// =============================== API ===========================

		show:function(target){
			this.element.css({ left:0, top:0 })

			this.element.position({
				my: "left top",
				at: "left bottom",
				of: target
			}).show();

			this._opener = target;
			this.element.trigger('shown');
		},

		hide:function(){
			this.element.hide();
			this.element.trigger('hidden');
		},

		toggle:function(target){
			if(this.element.is(":visible")){
				this.hide();
			} else {
				this.show(target);
			}
		},

		// =============================== Events ===============================

		"button click": "hide",

		" hide": "hide",

		" toggle":function(elm,ev,target){
			this.toggle(target);
		},

		" show":function(elm,ev,target){
			this.show(target);
		},

		"{window} click":function(elm, ev){
			if(this._opener &&
			   !$.contains(this.element[0], ev.target) &&
			   !$.contains(this._opener, ev.target) &&
			   this._opener != ev.target){
				this.hide();
			}
		}

	});

});

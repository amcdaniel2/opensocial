steal('can/control',
	    'can/control/plugin')
.then('jquery/event/hover',
      'position',
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
			new can.ui.Positionable(this.element, this.options.position);
		},

		// =============================== Visibility ===========================

		show:function(target){
			this.element.show().triggerHandler('move', target);
			this._opener = target;
		},

		hide:function(){
			this.element.hide();
		},

		// =============================== Events ===============================

		"button click":function(){
			this.hide();
		},

		" toggle":function(elm,ev,target){
			if(this.element.is(":visible")){
				this.hide();
			} else {
				this.show(target);
			}
		},

		" show":function(elm,ev,target){
			this.show(target);
		},

		" hide":function(){
			this.hide();
		},

		"{window} click":function(elm, ev){
			if(this._opener &&
			   !$.contains(this.element[0], ev.target) &&
			   !$.contains(this._opener, ev.target) &&
			   this._opener != ev.target){
				this.hide();
			}
		},

		// =============================== Hover Leave ===============================

		"hoverinit":function(elm,event,hover){
			hover.delay(200);
			hover.leave(200);
			hover.distance(20);
		},

		"hoverleave":function(elm,event){
			this.element.hide();
		}

	});

});

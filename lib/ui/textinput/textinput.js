steal('can/control',
	  'can/control/plugin',
	  './textinput.css',
function(){

can.Control('ui.Textinput', {
	init:function(){
		this.element.attr('title', 'Click to edit');
	},

	" click":function(elm,ev){
		var val = elm.text(),
			width = elm.width();

		elm.addClass('focused');
		elm.html('<input type="text" value="' + val + '" style="width:' + width + '" />');
		elm.children('input').focus();
	},

	"input blur":function(elm,ev){
		this.element.removeClass('focused');
		this.element.html(elm.val());
	}
})

});

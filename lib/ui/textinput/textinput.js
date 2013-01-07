steal('can/control',
	  'can/control/plugin',
	  './textinput.css',
function(){

can.Control('ui.Textinput', {
	init:function(){
		this.element.attr('title', 'Click to edit');
	},

	"click":function(elm,ev){
		if(this.element.hasClass('disabled')){
			return;
		}

		var val = elm.text(),
			width = elm.width();

		this.prevText = val;

		elm.addClass('focused');
		elm.html('<input type="text" value="' + val + '" style="width:' + width + '" />');
		elm.children('input').focus();
	},

	"keyup":function(elm,ev){
		if(ev.keyCode === 27){ // escape
			this.element.removeClass('focused');
			this.element.html(this.prevText);
		} else if(ev.keyCode === 13){ // enter
			this.element.find('input').blur();
		}
	},

	"input blur":function(elm,ev){
		var val = elm.val();
		this.element.removeClass('focused');
		this.element.html(val);

		if(val != this.prevText){
			this.element.trigger('change', val);
		}
	}
})

});

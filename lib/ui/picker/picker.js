steal('can/construct/super',
	  'ui/typeahead',
	  './picker.css',
function(){

ui.Typeahead('ui.Picker', {

	init:function(){
		this._super.apply(this, arguments);
		this.element.wrap('<div class="ui_picker_wrap" />');
		this.element.after('<button type="button" class="add-email">Add</button>');
		this.element.addClass('ui_typeahead');
	},

	// =============================== API ===============================

	hide:function(){
		this._super.apply(this, arguments);
		this.element.next().hide();
	},

	// =============================== Events ===============================

	"keyup":function(elm,ev){
		var val = elm.val(),
			next = this.element.next();

		if(this.validateEmail(val)){
			next.show();
		} else {
			next.hide();
		}

		this._super.apply(this, arguments);
	},

	"change":function(elm, ev, model){
		var val = elm.val();

		// if we don't check the model,
		// we could get into recursion
		if(val && !model){
			ev.stopPropagation();

			// if they typed a email and did not hit 'Add'
			// we need to confirm they wanted to add the email
			var confirmed = confirm('Would you like to add ' + val + '?');
			if(confirmed){
				this.element.trigger('change', val);
				this.query = val;
			}

			this.hide();
		}
	},

	".add-email click":function(elm,ev){
		this.query = this.element.val();
	},

	// =============================== Utils ===============================

	validateEmail:function(email) {
    	return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

});

});

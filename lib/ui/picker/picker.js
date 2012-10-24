steal('ui/typeahead', function(){

ui.Typeahead('ui.Picker', {
	init:function(){
		this._super.apply(this, arguments);
		this.element.addClass('ui_typeahead')
	}
});

});
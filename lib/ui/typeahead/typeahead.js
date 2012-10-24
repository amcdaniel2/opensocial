steal('can/construct/proxy',
	  'can/control',
      'can/control/plugin',
      'can/view/ejs',
      'ui/dropdown',
      './typeahead.css',
function(){

can.Control('ui.typeahead', {
	defaults:{
		model: undefined,
		params: undefined,
		dropdown: undefined,
		minLength: 1,
		items: [ ]
	}
},{

	init:function(){
		this.element.after('<ul class="typeahead-menu" />');

		this.options.dropdown = this.dropdown = this.element.next();
		this.element.attr('autocomplete', 'off');
		this.dropdown.ui_dropdown();
		this.on();

		can.view.ejs('typeahead_list',
			'<% if(this.length) { %>' +
				'<% for(var i=0;i<this.length;i++) { %>' +
					'<li><button data-value="<%== this[i].name %>"><%== this[i].name %></button></li>' +
				'<% } %>' +
			'<% } else { %>' +
				'<li><button disabled>No items</button></li>' +
			'<% } %>');
	},

	// =============================== Events ===============================

	" keyup":function(elm,ev){
		this.filter(elm.val());
	},

	" keydown":function(elm,ev){
		if(ev.keyCode === 27){
			this.hide();
		}
	},

	"{dropdown} hidden": "hide",

	"{dropdown} button click":function(elm,ev){
		if(elm.not('disabled')){
			this.query = $(elm).attr('data-value');
		}
	},

	// =============================== API ===============================

	show:function(items){
		if(!this.dropdown.children().length){
			this.dropdown.html(can.view('typeahead_list', items));
		} else {
			this.dropdown.children().show();
		}

		this.dropdown.outerWidth(this.element.outerWidth());
		this.dropdown.trigger('show', this.element);
	},

	hide:function(){
		this.element.val(this.query);
		this.element.removeClass('opened')
		this.dropdown.hide().empty();
		this.element.blur();
	},

	focus:function(){
		this.query = this.element.val();
		this.element.val('');
		this.element.addClass('opened');

		if(!this.options.items.length && this.options.model){
			this.dropdown.html('<li><button disabled>Loading...</button></li>');
			this.options.model.findAll(this.options.params).done(this.proxy('show'));
		} else {
			this.show(this.options.items);
		}
	},

	filter:function(val){
		this.dropdown.find('button:not(disabled)')
			.each(this.proxy(function(i, elm){
				var txt = $(elm).attr('data-value');
				if(this.matcher(txt, val)){
					$(elm).html(this.highlighter(txt, val)).show();
				} else {
					$(elm).parent().hide();
				}
		}))
	},

	// =============================== Utils ===============================

	matcher:function(item, val){
		return ~item.toLowerCase().indexOf(val.toLowerCase());
	},

	highlighter: function (item, query) {
		query = query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
		return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
			return '<strong>' + match + '</strong>'
		});
	},

	sorter: function (items) {
		var beginswith = [],
			caseSensitive = [],
			caseInsensitive = [],
			item;

		while (item = items.shift()) {
			if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {
				beginswith.push(item);
			} else if (~item.indexOf(this.query)) {
				caseSensitive.push(item);
			} else {
				caseInsensitive.push(item)
			}
		}

		return beginswith.concat(caseSensitive, caseInsensitive)
	}

});

});

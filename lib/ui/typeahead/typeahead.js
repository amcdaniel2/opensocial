steal('can/construct/proxy',
	  'can/control',
      'can/control/plugin',
      'can/view/ejs',
      'ui/dropdown',
      './typeahead.css',
      './views/list.ejs',
function(){

can.Control('ui.Typeahead', {
	defaults:{
		model: undefined,
		params: undefined,
		items: []
	}
},{

	init:function(){
		this.element.after('<ul class="typeahead-menu" />');

		this.options.dropdown = this.dropdown = this.element.next();
		this.element.attr('autocomplete', 'off');
		this.dropdown.ui_dropdown();
		this.on();
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
			this.dropdown.html(can.view('//ui/typeahead/views/list.ejs', this.sorter(items)));
		} else {
			this.dropdown.children(":not(.no-items)").show();
		}

		this.dropdown.outerWidth(this.element.outerWidth());
		this.dropdown.trigger('show', this.element);
	},

	hide:function(){
		this.element.val(this.query);
		this.element.removeClass('opened')
		this.dropdown.hide();
		this.filter();
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

	filter:function(query){
		var emptyQuery = query === "" || query === undefined,
			hidden = 0,
			noItems = this.dropdown.find('.no-items');

		var items = this.dropdown.find('button:not(:disabled)')
			.each(this.proxy(function(i, elm){
				elm = $(elm);

				var val = elm.attr('data-value'),
					li = elm.parent(),
					ul = li.parent(),
					isGroup = ul.hasClass('group-list');

				if(emptyQuery || this.matcher(query, val)){
					if(emptyQuery){
						elm.html(val);
					} else {
						elm.html(this.highlighter(query, val));
					}

					li.show();

					if(isGroup){
						ul.parent().show();
					}
				} else {
					li.hide();
					hidden++;

					if(isGroup){
						if(!ul.children('li:visible').length){
							ul.parent().hide();
						}
					}
				}
		}));

		noItems[items.length === hidden ? 'show' : 'hide']();
	},

	// =============================== Utils ===============================

	matcher:function(query, val){
		return ~val.toLowerCase().indexOf(query.toLowerCase());
	},

	highlighter: function (query, val) {
		query = query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
		return val.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
			return '<strong>' + match + '</strong>'
		});
	},

	sorter: function (items) {
	    var groups = {};

	    for (var i = 0; i < items.length; i++) {
	        if (!groups[items[i].group]) {
	            groups[items[i].group] = i;
	        }
	    }

	    return items.sort(function(one, other) {
	        return groups[one.group] - groups[other.group];
	    });
	}

});

});

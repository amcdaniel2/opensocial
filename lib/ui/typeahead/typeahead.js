steal('can/control',
      'can/control/plugin',
      'can/view/ejs',
      'ui/position',
      './typeahead.css',
function(){

can.Control('ui.typeahead', {
  model: undefined,
  view: 'ui/typeahead/views/init.ejs',
  minLength: 1
},{

  init:function(){
    this.element.after('<ul class="typeahead dropdown-menu" />');
    this.dropdown = this.element.next();
    this.element.attr('autocomplete', 'off');
  },

  " keyup":function(elm,ev){
    var val = elm.val();
  },

  " focus":function(elm,ev){
    this.query = elm.val();
    elm.val('');

    can.view.ejs('typeahead_list',
      '<% for(var i=0;i<this.length;i++) { %>' +
        '<li data-value="<%== this[i].name %>"><a href="#"><%== this[i].name %></a></li>' +
      '<% } %>');

    var html = can.view('typeahead_list', [ { name: 'candy' }, { name: 'noreo' } ] );

    this.dropdown.html();

    this.dropdown.position({
      my: "left top",
      at: "left bottom",
      of: this.element
    }).show();
  },

  " blur":function(elm,ev){
    elm.val(this.query);
    this.dropdown.hide().empty();
  },

  highlighter: function (item) {
    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
      return '<strong>' + match + '</strong>'
    });
  },

  matcher: function (item) {
    return ~item.toLowerCase().indexOf(this.query.toLowerCase())
  },

  sorter: function (items) {
    var beginswith = [],
        caseSensitive = [],
        caseInsensitive = [],
        item;

    while (item = items.shift()) {
      if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
      else if (~item.indexOf(this.query)) caseSensitive.push(item)
      else caseInsensitive.push(item)
    }

    return beginswith.concat(caseSensitive, caseInsensitive)
  }

});

});

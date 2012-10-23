steal('can/control',
      'can/control/plugin',
      'ui/position',
      './typeahead.css',
function(){

can.Control('ui.typeahead', {
  model: undefined,
  view: 'ui/typeahead/views/init.ejs'
},{

  init:function(){
    this.element.after('<ul class="typeahead dropdown-menu" />');
    this.dropdown = this.element.next();
  },

  " keyup":function(elm,ev){
    var val = elm.val();
  },

  " focus":function(elm,ev){
    this.prev = elm.val();
    elm.val('');

    this.dropdown.append('<li data-value="Delaware"><a href="#"><strong>D</strong>elaware</a></li>')
    this.dropdown.show();
    this.dropdown.position({
      my: "left top",
      at: "left bottom",
      of: this.element
    });
  },

  " blur":function(elm,ev){
    elm.val(this.prev);
    this.dropdown.hide().empty();
  }

});

});

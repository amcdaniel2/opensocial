steal('can/control',
      'can/control/plugin',
      'ui/position',
      './typeahead.css',
function(){

//
//<li data-value="Delaware" class="active"><a href="#"><strong>D</strong>elaware</a></li>

can.Control('ui.typeahead', {
  model: undefined,
  view: 'ui/typeahead/views/init.ejs'
},{

  init:function(){
    this.dropdown = $('<ul class="typeahead dropdown-menu" />').appendTo(this.element);
  },

  " keyup":function(elm,ev){
    var val = elm.val();

  }

});

});

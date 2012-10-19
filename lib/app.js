steal('can/control',
      'can/view/ejs',
      'can/view/modifiers',
      'views/init.ejs',
function(){

var OpenSocial = can.Control({

  init:function(){
    this.element.append('views/init.ejs', {});
  }

});

new OpenSocial(document.body);

});

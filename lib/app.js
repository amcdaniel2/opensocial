steal('can/construct/proxy',
      'can/control',
      'can/view/ejs',
      'can/view/modifiers')
.then('ui/datepicker',
      'ui/typeahead',
      'ui/progress-polyfill',
      'views/init.ejs',
function(){

var data = {
  followers: [ { user: "Justin", pic: "https://twimg0-a.akamaihd.net/profile_images/54538623/cleaned.png" } ],
  assignedTo: "Mike Dunseng",
  progress: .4,
  createdBy: "Mike Dunseng",
  createdOn: "1/1/11",
  project: "Ultralight",
  pic: "https://twimg0-a.akamaihd.net/profile_images/2086334400/IMG_0082.JPG"
};

var OpenSocial = can.Control({

  init:function(){
    // TODO: Hook this up to model, get this from window.context object
    this.element.append('<div class="loading tasks-app" />');
    setTimeout(this.proxy('draw', data), 500);
  },

  draw:function(data){
    this.element.find('.tasks-app')
      .append('views/init.ejs', data)
      .removeClass('loading');
  },

  // =============================== Events ===============================

  ".finish click":function(elm,ev){
    alert('What should I do?');
  },

  ".assign click":function(elm,ev){
    alert('What should I do?');
  },

  ".add click":function(elm,ev){
    alert('What should I do?')
  },

  "#assigned change":function(elm,ev){

  },

  "#start_date change":function(elm,ev){

  },

  "#due_date change":function(elm,ev){

  },

  "#project change":function(elm,ev){

  },

  ".comment keydown":function(elm,ev){
    if(ev.keyCode === 13){
      var val = elm.val();
      alert('Adding comment:' + val)
    }
  }

});

new OpenSocial(document.body);

});

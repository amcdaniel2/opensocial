steal('can/construct/proxy',
      'can/construct/super',
      'can/control',
      'can/view/ejs',
      'can/view/modifiers')
.then('ui/datepicker',
      'ui/typeahead',
      'views/init.ejs',
function(){

var data = {
  followers: [ { user: "Justin", pic: "https://twimg0-a.akamaihd.net/profile_images/54538623/cleaned.png" } ],
  assignedTo: "Mike Dunseng",
  progress: "50%",
  createdBy: "Mike Dunseng",
  createdOn: "1/1/11",
  project: "Ultralight",
  pic: "https://twimg0-a.akamaihd.net/profile_images/2086334400/IMG_0082.JPG",
  taskScore: {
    score: 5,
    newness: 2,
    followers: 6
  }
};

var OpenSocial = can.Control({

  setup:function(el,options){
    this._super($('<div class="loading tasks-app" />').appendTo(el), options);
  },

  init:function(){
    setTimeout(this.proxy('draw', data), 500);
  },

  draw:function(data){
    this.element
      .append('views/init.ejs', data)
      .removeClass('loading');
  },

  // =============================== Events ===============================

  ".finish click":function(elm,ev){
    this.element.remove();
  },

  ".assign click":function(elm,ev){
    alert('What should I do?');
  },

  ".add click":function(elm,ev){

  },

  "#assigned change":function(elm,ev){

  },

  "#start_date change":function(elm,ev){
    alert('Start date changed.')
  },

  "#due_date change":function(elm,ev){
    alert('Due date changed.')
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

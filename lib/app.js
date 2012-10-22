steal('can/control',
      'can/view/ejs',
      'can/view/modifiers')
.then('ui/datepicker',
      'ui/datepicker/datepicker.css',
      'ui/placeholder-shim/placeholder-shim.js',
      'ui/progress-polyfill/progress-polyfill.js',
      'ui/progress-polyfill/progress-polyfill.css',
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
    this.element.append('views/init.ejs', data);
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

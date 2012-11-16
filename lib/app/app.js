steal('can/construct/proxy',
      'can/construct/super',
      'can/control',
      'can/view/ejs',
      'can/view/modifiers')
.then('ui/datepicker',
      'ui/popover',
      'ui/textinput',
      'ui/picker',
      'app/models',
      'app/views/init.ejs',
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

Cohuman.config = {
	mode: "qea",
	mobile: true,
	config: Cohuman.env["qea"]
};

var OpenSocial = can.Control({

  setup:function(el,options){
  	this._super($('<div class="loading tasks-app" />').appendTo(el), options);
  },

  init:function(){
  	can.route(':id').ready();

  	var oauth = new Cohuman.Models.OAuth();
  	oauth.realm = Cohuman.env[Cohuman.config.mode].api.realm;
  	oauth.secret = Cohuman.env[Cohuman.config.mode].api.secret;
  	oauth.key = Cohuman.env[Cohuman.config.mode].api.key;

  	// Key from generator
  	//oauth.token = 'f65d75c524673c5dbaf8c8e1a7e7aa79d746ea7a';
  	//oauth.attr('token_secret', 'f6dc62a69978852e9eeaacc0c8380a27edafe839');

  	// Key From Michael
  	oauth.attr('token', 'Qbp6W7xySFZeriToeNHg0EXzBfr1pJnhY6fO3Vn5');
  	oauth.attr('token_secret', 'Ih9drUyMJ8jLAlcCqpjIkPOXqErRfOLCsF16ueYq');

  	oauth.prefilter();

  	Cohuman.Models.Task.findOne({ id: can.route.attr('id') || "6420" }).done(function(){
  		debugger;
  	});

    setTimeout(this.proxy('draw', data), 500);
  },

  draw:function(data){
    this.element
      .append('app/views/init.ejs', data)
      .removeClass('loading');
  },

  // =============================== Events ===============================

  ".finish click":function(elm,ev){
    this.element.remove();
  },

  ".assign click":function(elm,ev){
    alert('What should I do?');
  },

  ".task-score mouseenter":function(elm,ev){
    //elm.trigger('show', 'foo', 'noo')
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

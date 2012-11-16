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

  	// Set the config
  	Cohuman.mode = "qea";
  	Cohuman.config = Cohuman.env[Cohuman.mode];
  	Cohuman.config.mobile = true;

  	// Bypass OAuth
  	var oauth = new Cohuman.Models.OAuth(Cohuman.config.api);
  	oauth.token = 'DFJU9HPbCszHbS7PQjNGo34oxfe1o6ZVK0AAdf0l';
  	oauth.token_secret = 'BBxvrcVe30GJyXtp16CXtOzJpt8MhRmarwtj2Kiq';
  	oauth.prefilter();

  	Cohuman.Models.Task.findOne({ id: can.route.attr('id') || "29389" }).done(this.proxy('draw'));
  },

  draw:function(data){
    this.element
      .append(can.view('app/views/init.ejs', data))
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

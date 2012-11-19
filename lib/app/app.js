steal('can/construct/proxy',
      'can/construct/super',
      'can/control',
      'can/view/ejs',
      'can/view/modifiers')
.then('ui/position',
	  'ui/datepicker',
      'ui/popover',
      'ui/textinput',
      'ui/picker',
      'app/models',
      'app/views/init.ejs',
      'app/app.css',
function(){

can.Control('OpenSocial', {

  setup:function(el,options){
  	var popover = $('<div class="loading tasks-app" />').appendTo(document.body);
  	this.opener = el;
  	this._super(popover, options);
  },

  init:function(){

  	// this means demo mode
  	if(this.options.id){
	  	this.element.position({
			my: "left center",
			at: "right center",
			of: this.opener
		});
  	}

  	// Set the config
  	Cohuman.mode = "qea";
  	Cohuman.config = Cohuman.env[Cohuman.mode];
  	Cohuman.config.mobile = true;

  	// Bypass OAuth
  	var oauth = new Cohuman.Models.OAuth(Cohuman.config.api);
  	oauth.token = 'DFJU9HPbCszHbS7PQjNGo34oxfe1o6ZVK0AAdf0l';
  	oauth.token_secret = 'BBxvrcVe30GJyXtp16CXtOzJpt8MhRmarwtj2Kiq';
  	oauth.prefilter();

  	Cohuman.Models.Task.findOne({ id: this.options.id || "29389" }).done(this.proxy('draw'));
  },

  draw:function(data){
    this.element
      .append(can.view('app/views/init.ejs', data))
      .removeClass('loading');
  },

  // =============================== Events ===============================

  " mouseenter":function(){
  	clearTimeout(this.timeout);
  },

  " mouseleave":function(){
  	this.timeout = setTimeout(this.proxy(function(){
  		this.element.remove();
  	}), 500);
  },

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

});

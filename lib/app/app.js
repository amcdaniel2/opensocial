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

can.extend(Cohuman.Models.Task.prototype, {
	userList:function(){
		//task.followers + task.project.members + favs: currentUser.connections

		var users = [],
			add = function(list, group){
				$.each(list, function(i,item){
					item.group = group;
					users.push(item);
				});
			};

		add(this.user.connections, 'Favorites')
		add(this.followers, 'On this project')
		add(this.project.members, 'On this project')

		return users;
      }
});

can.Control('OpenSocial', {

  setup:function(el,options){
  	options = options || {};
  	this.opener = el;
  	var popover = $('<div class="loading tasks-app" />').appendTo(document.body)
  	popover.wrap('<div class="tasks-wrapper" />');
  	options.wrapper = popover.parent();
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

  	$.when.apply($,
  		[ Cohuman.Models.Task.findOne({ id: this.options.id || "29389" }),
  		  Cohuman.Models.User.findOne({}) ]).done(this.proxy(function(task, user){
  			Cohuman.Models.Project.findOne({ id : task.project.id }).done(this.proxy('draw', task, user))
  		}));
  },

  draw:function(task, user, project){
  	// make a reference for our helper ...
  	task.user = user;
    this.element.append(can.view('app/views/init.ejs', {
      	task: task,
      	user: user,
      	project: project,
      	parentDom: this.element.closest('.tasks-wrapper')
      })).removeClass('loading');
  },

  // =============================== Events ===============================

  "{wrapper} mouseenter":function(){
  	clearTimeout(this.timeout);
  },

  "{wrapper} mouseleave":function(){
  	this.timeout = setTimeout(this.proxy(function(){
  		if(this.options.id){
  			this.element.remove();
  		}
  	}), 1000);
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

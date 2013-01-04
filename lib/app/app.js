steal('can/construct/proxy',
      'can/construct/super',
      'can/control',
      'can/control/plugin',
      'can/view/ejs',
      'can/view/modifiers')
.then('ui/position',
	  'ui/datepicker',
      'ui/popover',
      'ui/textinput',
      'ui/picker',
      'ui/slider',
      'util/cookie.js',
      './views/login.ejs',
      './views/signup.ejs',
      './views/task.ejs',
      './views/score_summary.ejs',
      './app.less',
      './models',
function(){

// Set the config
Cohuman.mode = "qea";
Cohuman.config = Cohuman.env[Cohuman.mode];
Cohuman.config.mobile = true;

can.Control('OpenSocial', {

  setup:function(el,options){
  	// make sure we have options.
  	options = options || {};

  	// get refences to the opener for later
  	this.opener = el;

  	// inject our new div and wrap it for positioned elements
  	var popover = $('<div class="splash tasks-app" />').appendTo(document.body)
  	popover.wrap('<div class="tasks-wrapper" />');
  	options.wrapper = popover.parent();

  	this._super(popover, options);
  },

  init:function(){
  	Cohuman.oauth = new Cohuman.Models.OAuth(Cohuman.config.api);
  	Cohuman.oauth.prefilter();

  	var cookie = $.cookie('cohuman_sess');
  	if(cookie){
  		Cohuman.oauth.attr(cookie);
  		this.task();
  	} else {
  		this.login();
  	}
  },

  login:function(){
  	this.element.append('app/views/login.ejs', {});
  	this.element.find('.email').focus();
  },

  "form[name=login] submit":function(elm,ev){
  	Cohuman.Models.User.login({
  		name: this.element.find('.email').val(),
  		password: this.element.find('.password').val()
  	}, this.proxy(function(user, json){
  		// save the session for later
  		$.cookie('cohuman_sess', $.toJSON({
                  token: json.access_token.oauth_token,
                  token_secret: json.access_token.oauth_token_secret
        	}));

  		// call the task
  		this.task();
  	}), function(error){
  		alert('Login failed!  Try again.')
  	});

  	return false;
  },

  task:function(){
  	// Get all our info as fast a possible
  	$.when.apply($, [ Cohuman.Models.Task.findOne({ id: this.options.id || "29389" }),
  		Cohuman.Models.User.findOne({}),
  		Cohuman.Models.Project.findAll()
  	]).done(this.proxy(function(task, user, projects){
		// make a reference for our helper
		task.user = user;
		user.task = task;
		user.projects = projects;

		// set a pointer for updating later
		this.task = task;
		this.user = user;

		// insert the dom and pass reference to the wrapper
		// since this isn't going to be inserted yet.
		this.element.removeClass('splash')
		this.element.html('app/views/task.ejs', {
			task: task,
			user: user,
			project: projects,
			parentDom: this.options.wrapper
		}).removeClass('loading');

		this.element.find('#progress').ui_slider({ val: this.task.progress, range: true, min: 0, max: 100 });

		this.element.height(this.element.height());
		//gadgets && gadgets.window.adjustHeight(this.element.height() + 75);
  	}));
  },

  // =============================== Events ===============================

  "#title change":function(elm,ev,val){
  	this.task.update({
  		name: val
  	});
  },

  ".status click":function(elm,ev){
  	var state = elm.text();
  	this.task.update({
  		state: state === "Finish" ? "finished" : "active"
  	});
  },

  ".assign click":function(elm,ev){
  	// stop the prop to prevent the doc click from closing it
  	ev.stopPropagation();
    this.element.find('#assigned').focus();
  },

  ".add-btn click":function(elm,ev){
  	// stop the prop to prevent the doc click from closing it
  	ev.stopPropagation();
  	this.toggleAssign();
  },

  toggleAssign:function(){
  	var ul = this.element.find('.followers'),
  		picker = ul.find('.ui_picker_wrap');

  	ul.find('.follower').toggle();
  	picker.toggle();

  	if(picker.is(':visible')){
  		picker.children('input').focus();
  	}
  },

  "#followers change":function(elm,ev,model){
  	this.toggleAssign();
  	Cohuman.Models.Following.create({
  		task : this.task,
  		follower_id: model.id
  	});
  },

  ".remove-follower click":function(elm,ev){
  	var li = elm.closest('.user'),
  		model = li.instance();

  	Cohuman.Models.Following.destroy({
  		task_id : this.task.id,
  		follower_id: model.id
  	}).done(function(){
  		li.remove();
  	});
  },

  "#assigned change":function(elm, ev, model){
  	this.task.setOwner({
  		id: model.id
  	});
  },

  "#progress change":function(elm,ev,val){
  	this.task.update({
  		progress: val
  	})
  },

  "#start_date changeDate":function(elm,ev){
  	var date = new Date(ev.timeStamp);
    this.task.update({
  		start_date: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
  	});
  },

  "#due_date changeDate":function(elm,ev){
  	var date = new Date(ev.timeStamp);
    this.task.update({
  		due_date: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
  	});
  },

  "#project change":function(elm, ev, model){
  	this.task.setProject({
  		id: model.id
  	});
  },

  ".comment keydown":function(elm,ev){
    if(ev.keyCode === 13){
      var val = elm.val();
      Cohuman.Models.Comment.create({
      	task_id: this.task.id,
      	text: val,
      	user: this.user
      }).done(this.proxy(function(data){
      	elm.val('');
      	this.task.comments.unshift(data);

      	// reset height
      	this.element.height('')
      	this.element.height(this.element.height());
		gadgets && gadgets.window.adjustHeight(this.element.height() + 75);
      }));
    }
  }

});

});

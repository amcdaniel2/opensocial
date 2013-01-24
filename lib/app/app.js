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
Cohuman.mode = "dev";
Cohuman.config = Cohuman.env[Cohuman.mode];
Cohuman.config.mobile = true;

/**
 * Date helper for formatting to MM/DD/YYYY
 */
Date.prototype.format = function(){
	// Get Days
	var dd = this.getDate();
	if(dd<10){
		dd='0'+dd;
	}

	// Months are 0 based
	var mm = this.getMonth()+1;

	if(mm<10){
		mm='0'+mm;
	}

	// get full year
	var yyyy= this.getFullYear();

	return String(mm + "\/" + dd + "\/" + yyyy);
};

/**
 * The IBM OpenSocial widget.
 */
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

  disableForm:function(){
  	// used to disable form if the status is set to 'Finished'
  	this.element.find('.title-span').addClass('disabled');
  	this.element.find('.status').attr('disabled', 'disabled');
	this.element.find('.assign').remove();
	this.element.find('.add-btn').hide();
	this.element.find('.remove-follower').remove();
	this.element.find('input').attr('disabled', 'disabled');
	this.element.find('.ui-slider').slider("option", "disabled", true);
  },

  // =============================== Login ===============================

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
  	$.when.apply($, [
  		Cohuman.Models.Task.findOne({ id: this.options.id || "29389" }),
  		Cohuman.Models.User.findOne({}),
  		Cohuman.Models.Project.findAll()
  	]).then(this.proxy(function(task, user, projects){
		// make a reference for our helper
		task.user = user;
		user.task = task;
		user.projects = projects;

		// set user for when adding users by email ?
		Cohuman.observer = new can.Observe();
		Cohuman.observer.attr('currentUser', user);

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

		var slider = this.element.find('#progress').slider({
			value: this.task.progress,
			range: 'min',
			step:1,
			min: 0,
			max: 100,
			slide: function( event, ui ) {
                var converted = Cohuman.Models.Task.convert.progress(ui.value),
                	handle = $(".ui-slider-handle");

                handle.html(converted + "%");

                // reset the value attr if doesn't match
                if(converted != ui.value){
                	// do a timeout because
                	setTimeout(function(){
                		slider.slider("value", converted);
                	}, 1)
                }

                if(ui.value === 100){
                	handle.css('marginLeft', '-46px');
                } else {
                	handle.css('marginLeft', 0)
                }
            }
		});

		$(".ui-slider-handle").html((this.task.progress || 0) + "%");

		 // users have to reset the state from the
		 // tasks app itself, so disable all the forms
		if(this.task.state === "finished"){
			this.disableForm();
		}

		// adjust the height
		this.element.height(this.element.height());
		gadgets && gadgets.window.adjustHeight(this.element.height() + 75);
  	})).fail(function(error){
		alert(error.message);
	});;
  },

  ".logout click":function(elm,ev){
  	$.cookie('cohuman_sess', null);
  	this.element.addClass('splash');
  	this.element.html('app/views/login.ejs', {});
  	this.element.find('.email').focus();
  },

  // =============================== Form Changes ===============================

  "#title change":function(elm,ev,val){
  	this.task.update({
  		name: val
  	});
  },

  ".status click":function(elm,ev){
  	var state = elm.text().trim();

  	if(state === "Finish"){
  		this.task.update({
	  		state: state === "Finish" ? "finished" : "active"
	  	});

  		this.disableForm();
  	}
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

  	if(model.id){
  		// if we have a model
  		Cohuman.Models.Following.create({
  			task : this.task,
  			follower_id: model.id
  		});
  	} else {
  		// if we are adding by email
  		Cohuman.Models.Following.create({
  			task : this.task,
  			addresses: model
  		});

  		this.element.find('#followers').ui_picker({
  			items: this.task.followerableUsers()
  		});
  	}
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
  	if(model.id){
  		// if we have a model
  		this.task.setOwner({
	  		id: model.id
	  	});
  	} else {
  		// if we are adding by email
  		this.task.setOwner({
	  		addresses: [ model ]
	  	}).done(this.proxy(function(){
	  		// make sure its in the fav group
	  		this.task.owner.attr('group', 'Favorites')

	  		// update the dropdown
	  		// probs could be cleaner by using observes
	  		this.element.find('#assigned').ui_picker({
	  			selected: this.task.owner,
	  			items: this.task.assignableUsers()
	  		});
	  	}));
  	}
  },

  "#progress slidechange":function(elm,ev,slider){
  	var val = Cohuman.Models.Task.convert.progress(slider.value)
  	this.task.update({
  		progress: val
  	})
  },

  "#start_date changeDate":function(elm,ev){
    this.task.update({
  		start_date: ev.date.getFullYear() + "-" + (ev.date.getMonth() + 1) + "-" + ev.date.getDate()
  	});
  },

  "#due_date changeDate":function(elm,ev){
    this.task.update({
  		target_date: ev.date.getFullYear() + "-" + (ev.date.getMonth() + 1) + "-" + ev.date.getDate()
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

steal('can/model',
      'can/model/list')
.then('app/models/task.js',
      'app/models/project.js',
      'app/models/user/user.js',
      'app/models/comment.js')
.then('app/models/oauth.js', function(){
	
	/**
	 * Extend the Task Model to provide support for
	 * aggregating a list for the dropdowns.
	 */
	can.extend(Cohuman.Models.Task.prototype, {
		assignableUsers:function(){
			var users = [],
				add = function(list, group){
					can.each(list, function(i,item){
						var alreadyContained = $.grep(users, function(g,ii){
							return g.id === item.id;
						}).length;

						if(!alreadyContained){
							item.group = group;
							users.push(item);
						}
					});
				};

			add(this.user.connections.favorited(), 'Favorites')
			add(this.followers, 'On this project')
			add(this.project.members, 'On this project')

			return users;
	    },

	    followerableUsers:function(){
	    	//Potential followers are project members that
	    	//aren't already following
	    	var members = $.grep(this.project.members, this.proxy(function(m,i){
	    		return $.inArray(m, this.followers) === -1;
	    	}));

	    	// plus favorite and other connections.
	    	can.each(this.user.connections, this.proxy(function(i,c){
	    		if($.inArray(c, this.followers) === -1){
	    			members.push(c);
	    		}
	    	}));

	    	return members;
	    }
	});

	/**
	 * Extend the User Model to provide support for
	 * aggregating a list for the dropdowns.
	 */
	can.extend(Cohuman.Models.User.prototype, {
		assignableProjects:function(){
			return $.map(this.projects, function(p,i){
				return p;
			})
		}
	});
});
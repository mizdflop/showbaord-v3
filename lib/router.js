Router.configure({
  layoutTemplate: 'layout' 
});

Router.map(function () {
	this.route('topics', {
		path: '/topics/:series/:season/:episode',
		template: 'topics',
	    //onBeforeAction: function () {
    	//  AccountsEntry.signInRequired(this);
    	//},
		waitOn: function(){
			return [
				Meteor.subscribe("episodes", this.params.season, this.params.episode),
				Meteor.subscribe("tvseries", this.params.series),
				Meteor.subscribe("topicsForEpisode", this.params.season, this.params.episode)
			];
		},
		action: function () {
      		if (this.ready()){
         		this.render();
         	}
         },
         data: {
         	topicsList: function () {return Topics.find(); }
         }
	});
});


Router.map(function () {
	this.route('showtopic', {
		path: '/topics/:series/:season/:episode/:topicid',
		template: 'showtopic',
	    //onBeforeAction: function () {
    	//  AccountsEntry.signInRequired(this);
    	//},
		waitOn: function(){
			return [
				Meteor.subscribe("episodes", this.params.season, this.params.episode),
				Meteor.subscribe("tvseries", this.params.series),
				Meteor.subscribe("topics", this.params.topicid),
				Meteor.subscribe("comments", this.params.topicid)
			];
		},
		data: {
			topic: function () { return Topics.findOne( {} ) ; },
			episode: function () { return Episodes.findOne(); },
			series: function () { return Tvseries.findOne(); },
			comments: function () { return Comments.find({parentId: "0"}, {sort: {timestamp: -1}});} ,

		},		
		action: function () {
			
      		if (this.ready()){
      			orderNumber=1;
         		this.render();
         	}
         }
	});
});





Router.map(function () {
	this.route('admin_index', {
		path: '/admin',
	});
});

Router.map(function () {
	this.route('add_series', {
		path: '/admin/add_series',
		template: 'add_series',
		waitOn: function(){
			return [
				Meteor.subscribe("tvseries")
			];
		},
		action: function () {
      		if (this.ready()){
         		this.render();
         	}
         }
	});

});

Router.map(function () {
	this.route('add_episode', {
		path: '/admin/add_episode',
		template: 'add_episode',
	    onBeforeAction: function () {
    	  //AccountsEntry.signInRequired(this);
    	},
		waitOn: function(){
			return [
				Meteor.subscribe("episodes"),
				Meteor.subscribe("tvseries")
			];
		},
		action: function () {
      		if (this.ready()){
         		this.render();
         	}
         }
	});
});
	
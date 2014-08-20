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
				Meteor.subscribe("episodes"),
				Meteor.subscribe("tvseries"),
				Meteor.subscribe("topics")
			];
		},
		action: function () {

      		if (this.ready()){
         		this.render();
         	}
         },
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
				Meteor.subscribe("episodes"),
				Meteor.subscribe("tvseries"),
				Meteor.subscribe("topics"),
				Meteor.subscribe("comments")
			];
		},
		data: {
			topic: function () { return Topics.findOne(); },
			episode: function () { return Episodes.findOne(); },
			series: function () { return Tvseries.findOne(); },
			comments: function () { return Comments.find({}, {sort: {timestamp: -1}});} 

		},
		
		action: function () {
      		if (this.ready()){
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
	
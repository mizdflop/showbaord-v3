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
				Meteor.subscribe("tvseries")
			];
		},
		
		action: function () {
			Session.set("visibleTopics", "Popular Topics");
			Session.set("filterBy", "Popularity");
			Session.set("URLValues", []);
			Session.set("topicForInsert", undefined);



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
	
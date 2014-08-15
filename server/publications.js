Meteor.publish("episodes", function(){
	return Episodes.find();
});
Meteor.publish("tvseries", function(){
	return Tvseries.find();
});
Meteor.publish("topics", function(){
	return Notesforshow.find();
});
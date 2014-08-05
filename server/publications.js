Meteor.publish("episodes", function(){
	return Episodes.find();
});
Meteor.publish("tvseries", function(){
	return Tvseries.find();
});
Meteor.publish("notesforshow", function(){
	return Notesforshow.find();
});
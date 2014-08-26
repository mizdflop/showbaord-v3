//needs to be fixed to work with different series
Meteor.publish("episodes", function(seasonNumber, episodeNumber){
	return Episodes.find({seasonNumber: parseInt(seasonNumber), episodeNumber: parseInt(episodeNumber)});
});
//fix this... dealing with a space
Meteor.publish("tvseries", function(seriesTitle){
	return Tvseries.find({seriesTitle: "Breaking Bad"});
});
Meteor.publish("topics", function(topicid){
	return Topics.find({_id: topicid});
});
Meteor.publish("topicsForEpisode", function(seasonNumber, episodeNumber){
	var theId = Episodes.findOne({seasonNumber: parseInt(seasonNumber), episodeNumber: parseInt(episodeNumber)})._id;
	console.log(theId);
	return Topics.find({episodeId: theId});
});

Meteor.publish("comments", function(topicId){
	return Comments.find({topicId: topicId});
});

var initialEnterText = "Add an observation...";


Template.showtopic.helpers({
	formatDate: function (timestamp) {
		return moment().format('LL', timestamp);
	},
	initialText: function(){
		return initialEnterText;
	},
	timeAgo: function( passedTime ){
         return moment( passedTime ).fromNow();
     },
     reverseMe: function( arr ){
     	return arr.reverse();
     },
     alreadyRecommended: function(arr){
     	if( arr.indexOf(Meteor.userId()) ==-1){
     		return false;
     	} else {
     		return true;
     	}
     }

});

Template.showtopic.events({
	'click #newObservation': function () {
		if( $('#newObservation').text() === initialEnterText){
			$('#newObservation').text("").css("color", "#000000");
		}		
	},
	'keydown #newObservation': function(e){
		//console.log( $('#newObservation').text() );
		if(e.keyCode==13){
			insertComment( Topics.findOne()._id, Meteor.userId(), $('#newObservation').text(), 0 );
			$('#newObservation').text("");
		}
		if( $('#newObservation').text() === initialEnterText){
			$('#newObservation').text("").css("color", "#000000");
		}		
	},
	'click .recommended-link': function(){
		console.log(this._id);
		commentRecommended(this._id, Meteor.userId());
	},
	'click .reply-to-conversation': function(){
		Session.set("show")
	}
});

function insertComment ( topicId, userId, commentText, parent) {
	Comments.insert(
	{ 
		topicId: topicId,
		userId: userId,
		commentText:commentText,
		parent: parent,
		timestamp: Date(),
		recommendedBy: []
	}
	);
}

function commentRecommended(commentId, userId){
	Comments.update({_id: commentId}, {$push: {recommendedBy: userId}})

}
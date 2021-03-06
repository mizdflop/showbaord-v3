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
     },
     nestedComment: function(idstr){
     	return Comments.find({parentId: idstr}, {sort: {timestamp: 1}});
     },
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
	'keydown .interiorReply': function(e){
		if(e.keyCode==13){
			console.log(e.currentTarget.innerText);
			insertComment( Topics.findOne()._id, Meteor.userId(), e.currentTarget.innerText, this._id );
			$(e.currentTarget).text('');
		}
	},
	'click .fa-link': function(e){
		Router.go("/" + this._id);
	},
	'click #linkToTopics': function(){
		Router.go(
			"topics",
			{
				episode: Router.current().params['episode'],
				season: Router.current().params['season'],
				series: Router.current().params['series']
			}
		);
	}
});

//combine into a callback function on inssert. this isn't going to work like this. 
function insertComment(topicId, userId, commentText, parent){
	var updateModifer = {};
	if( Comments.find({userId: Meteor.userId() }).count()== 0){
		updateModifer =  {$inc: {numberCommentors: 1, numberComments: 1}, $set: {lastCommentTimestamp: Date()} };
	} else {
		updateModifer = {$inc: {numberComments: 1}, $set: {lastCommentTimestamp: Date() }};
	}
	Topics.update({_id: topicId}, updateModifer, function(error, numberModified){
		if(numberModified){
			insertNew( topicId, Meteor.userId(), commentText, parent );
		}
	});

	

}


function insertNew ( topicId, userId, commentText, parent) {
	Comments.insert(
	{ 
		topicId: topicId,
		userId: userId,
		commentText:commentText,
		parentId: parent,
		timestamp: Date(),
		recommendedBy: []
	}
	);
}

function commentRecommended(commentId, userId){
	Comments.update({_id: commentId}, {$push: {recommendedBy: userId}})

}
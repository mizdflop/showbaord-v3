Template.showtopic.helpers({
	formatDate: function (timestamp) {
		return moment().format('LL', timestamp);
	}
});

Template.showtopic.events({
	'click #newObservation': function () {
		if( $('#newObservation').text() === "Add an observation..."){
			$('#newObservation').text("").css("color", "#000000");
		}		
	},
	'keyup #newObservation': function(e){
		if(e.keyCode=13){
			//enter stuff here.
		}
	}
});


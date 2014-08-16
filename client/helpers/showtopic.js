Template.showtopic.helpers({
	formatDate: function (timestamp) {
		return moment().format('LL', timestamp);
	}
});

Template.showtopic.events({
	'click': function () {
		// ...
	}
});


function insertTopic(topicType, URL, conversationStarter, spoiler){
  Topics.insert({
    episodeId: Episodes.findOne()._id,
    createdBy: Meteor.userId(),
    timestamp: Date.now(),
    noteType: topicType,
    linkedArticleInfo: {
      URL: URL,
      title: Session.get("URLValues").title,
      image: Session.get("URLValues").image,
      description: Session.get("URLValues").description
    },
    conversatoinStarter: conversationStarter,
    spoilerWarning: spoiler
  });
}

Template.addTopicModal.helpers({
  sectionToDisplay: function (str) {
    //console.log(str);
    if(Session.equals("sectionToDisplay", str)){ 
      Session.set("showConversationStarter", true);
      return true;
    } else {
      Session.set("showConversationStarter", false);
      return false;
    }
  },
  showConversationStarter: function(){
    return Session.get("showConversationStarter");
  },
  URLFetched: function(){
    return Session.get("URLFetched");
  },
  fetchedPageValues: function(){
    return Session.get("URLValues");
  }
});




Template.addTopicModal.events({
  'change #createTopicDropdown': function(e){
      Session.set("sectionToDisplay", e.target.value);
  },
  'click #checkURL': function(e){
      e.preventDefault();
      console.log( $('#URLofInterest').val() );
      Meteor.call('fetchRemoteData', $('#URLofInterest').val(), function (error, result) {
          //console.log(error);
          if(error){ 
            alert("couldn't find it");
          } else {
            Session.set("URLFetched", true);
            Session.set("URLValues", result);
          }

      });
  },
  'click #fetchAudioFile': function(e){
      e.preventDefault();
      //Meteor.call('fetchAudioURL', $('#audioClipSource').val(), function(error, result){
      //  if(error){
      //    alert('totlly no audio');
      //  } else {
      Session.set("audioFileEntered", true);
      //  }

      // d });
  },
  'submit form': function(event){
      event.preventDefault();
      event.stopPropagation();
      insertTopic( $('#createTopicDropdown').val(), $('#URLofInterest').val(), $('#conversationStarter').val(), $('#spoiler').is(":checked"))
      Router.go("/");
      return false; 
  }
});










Template.addTopicModal.rendered = function () {
  $('#addTopicModal').on('show.bs.modal', function (e) {
      console.log('here');
      Session.set("URLValues", {});
      Session.set("sectionToDisplay", undefined);
      Session.set("URLFetched", false);
      $('#conversationItemForm').trigger('reset');
  });
   

};
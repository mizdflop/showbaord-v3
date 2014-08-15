function insertTopic(topicType, URL, conversationStarter, spoiler){
    console.log(spoiler);
    if(topicType ==="Article/Analysis"){
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
        conversationStarter: conversationStarter,
        spoilerWarning: spoiler,
        tags: Session.get("tagsArray")
      });
    } else if(topicType === "Audio/Podcast") {
      Topics.insert({
        episodeId: Episodes.findOne()._id,
        createdBy: Meteor.userId(),
        timestamp: Date.now(),
        noteType: topicType,
        soundCloudEmbedCode: Session.get("soundCloudEmbedCode"),
        spoilerWarning: spoiler,
        tags: Session.get("tagsArray")
      });      
    } else if(topicType ==="Original Thought") {
      Topics.insert({
        episodeId: Episodes.findOne()._id,
        createdBy: Meteor.userId(),
        timestamp: Date.now(),
        noteType: topicType,
        spoilerWarning: spoiler,
        tags: Session.get("tagsArray")      
    });      

    }
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
  },
  soundCloudEmbed: function(){
    return Session.get("soundCloudEmbedCode");
  },
  tags: function(){
    return Session.get("tagsArray");
  },
  tag: function(){
    return this.toString();
  },

});

Template.addTopicModal.allTags = function(){
      var tmp = _.union(
        _.map(Episodes.findOne().scenes, function(key, val){ return "scene " + key.sceneNumber + ": " + key.sceneDesc}),
        _.map(Episodes.findOne().characters, function(key, val){ return "character: " + key.characterName})
      );
      return tmp;

}


Template.addTopicModal.events({
  'change #createTopicDropdown': function(e){
      Session.set("sectionToDisplay", e.target.value);
      //initalizeTypeAhead();

  },
  'click #checkURL': function(e){
      e.preventDefault();
      console.log( $('#URLofInterest').val() );
      Meteor.call('fetchRemoteData', $('#URLofInterest').val(), function (error, result) {
          //console.log(error);
          if(error){ 
            //alert("couldn't find it");
          } else {
            Session.set("URLFetched", true);
            Session.set("URLValues", result);
          }

      });
  },
  'click #fetchAudioFile': function(event){
      event.preventDefault();
      event.stopPropagation();
      Session.set("soundCloudEmbedCode", $('#audioClipSource').val() );
  },
  'keyup .typeahead, click .tt-dropdown-menu': function(e){
      if( e.keyCode===9 || e.keyCode===13 || e.type==="click"){
        e.preventDefault();
        e.stopPropagation();
        var tempArray = Session.get("tagsArray");
        tempArray.push( _.rest( $('.typeahead').val().split(' '),1 ).join(" ") );
        Session.set("tagsArray", tempArray);
        $('.typeahead').val('');
      }


  },
  'submit form': function(event){
      event.preventDefault();
      event.stopPropagation();
      //rewrite with callback
      insertTopic( $('#createTopicDropdown').val(), $('#URLofInterest').val(), $('#conversationStarter').val(), $('#spoiler').is(":checked"))
      //Router.go("/");
      return false; 
  },
  'click .mytag': function(e){
    Session.set("tagsArray", _.without(Session.get("tagsArray"), e.currentTarget.innerText));

  }
});

Template.addTopicModal.rendered = function () {
  $('#addTopicModal').on('show.bs.modal', function (e) {
      Session.set("URLValues", {});
      Session.set("sectionToDisplay", undefined);
      Session.set("URLFetched", false);
      Session.set("soundCloudEmbedCode", "");
      Session.set("tagsArray", []);
      $('#conversationItemForm').trigger('reset');
      Meteor.typeahead.inject('.typeahead');

  });
   

};
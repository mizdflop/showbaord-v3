Meteor.startup(function(){
    // initializes all typeahead instances
    Meteor.typeahead.inject();
    console.log('i ate here');
});

function initalizeTypeAhead(){
  console.log("do I run");
  Meteor.typeahead('.typeahead', _.union(
      _.pluck(Episodes.findOne().scenes,"sceneDesc"),
      _.pluck(Episodes.findOne().characters, "characterName")
  ));

}
function insertTopic(topicType, URL, conversationStarter, spoiler){
    console.log(conversationStarter);
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
        spoilerWarning: spoiler
      });
    } else if(topicType === "Audio/Podcast") {
      Topics.insert({
        episodeId: Episodes.findOne()._id,
        createdBy: Meteor.userId(),
        timestamp: Date.now(),
        noteType: topicType,
        soundCloudEmbedCode: Session.get("soundCloudEmbedCode"),
        conversationStarter: conversationStarter,
        spoilerWarning: spoiler
      });      
    } else if(topicType ==="Original Thought") {
      Topics.insert({
        episodeId: Episodes.findOne()._id,
        createdBy: Meteor.userId(),
        timestamp: Date.now(),
        noteType: topicType,
        conversationStarter: conversationStarter,
        spoilerWarning: spoiler
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
  }

});

Template.addTopicModal.allTags = function(){
  console.log('hit');
  return ['foo', 'bar'];
}


Template.addTopicModal.events({
  'change #createTopicDropdown': function(e){
      Session.set("sectionToDisplay", e.target.value);
      initalizeTypeAhead();

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
      if(e.keyCode===9 || e.keyCode===13 || e.type==="click"){
        e.preventDefault();
        e.stopPropagation();
        //console.log( $('typeahead').value());
        var tempArray = Session.get("tagsArray");
        tempArray.push( $('.typeahead').val() );
        Session.set("tagsArray", tempArray);
        initalizeTypeAhead(); 
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
  'click .myTag': function(e){
    console.log(e); 
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


  });
   

};
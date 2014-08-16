function insertTopic(topicType, URL, conversationStarter, spoiler, topicTitle){
    var insertObject = {
        episodeId: Episodes.findOne()._id,
        createdById: Meteor.userId(),
        createdByUsername: Meteor.user().username,
        timestamp: Date.now(),
        noteType: topicType,
        conversationStarter: conversationStarter,
        spoilerWarning: spoiler,
        tags: Session.get("tagsArray")
    };
    if(topicType ==="Article/Analysis"){
        insertObject.linkedArticleInfo = {
          URL: URL,
          title: Session.get("URLValues").title,
          image: Session.get("URLValues").image,
          description: Session.get("URLValues").description
        }
    } else if(topicType === "Audio/Podcast") {
        insertObject.soundCloudEmbedCode = Session.get("soundCloudEmbedCode");
    } 
    //if it's an original thought, we don't need anyting more
    Topics.insert( insertObject );
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
  fetching: function(){
    return Session.get("fetching");
  }

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
      if( $('#URLofInterest').is(":focus") || $('#checkURL').is(":focus") ){
        Session.set("fetching", true);
        Meteor.call('fetchRemoteData', $('#URLofInterest').val(), function (error, result) {
            if(error){ 
              alert("couldn't find it");
            } else if(result) {
              Session.set("URLFetched", true);
              Session.set("URLValues", result);
            }
            Session.set("fetching", false);
        });
      }
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
        if( $('.typeahead').val()==="" ) { return false; }
        var tempArray = Session.get("tagsArray");
        //if what was entered was a character or a scene, parse it
        if( $('.typeahead').val().split(' ')[0] === "character:") {
              tempArray.push( _.rest( $('.typeahead').val().split(' '),1 ).join(" ") );
        } else if ( $('.typeahead').val().split(' ')[0] === "scene" ){
          tempArray.push( _.rest( $('.typeahead').val().split(' '),2 ).join(" ") );
        } else {
          tempArray.push( $('.typeahead').val() );
        }
        Session.set("tagsArray", tempArray);
        $('.typeahead').typeahead('val', '');

      }


  },
  'submit form': function(event){
      event.preventDefault();
      event.stopPropagation();
      //rewrite with callback
      insertTopic( $('#createTopicDropdown').val(), $('#URLofInterest').val(), 
                      $('#conversationStarter').val(), $('#spoiler').is(":checked"), 
                      $('#topicTitle').val() 
      );
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
      Session.set("fetching", false);
      $('#conversationItemForm').trigger('reset');
      Meteor.typeahead.inject('.typeahead');

  });
};
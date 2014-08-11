Template.addTopicModal.helpers({
  sectionToDisplay: function (str) {
    console.log(str);
    if(Session.equals("topicForInsert", str)){ return true;}
  },
  anyTopicSet: function(){
    if(Session.equals("topicForInsert", undefined)){
      return false;
    }
    return true;
  },
  urlFetched: function(){
    if( Session.get("URLValues")[1] ) {
      return true;
    }
  },
  fetchedPageTitle: function(){
    return Session.get("URLValues")[0];
  },
  fetchedPageImg: function(){
    return Session.get("URLValues")[1];
  },
  fetchedPageDesc: function(){
    return Session.get("URLValues")[2];
  },
  audioFileEntered: function(){
    return Session.get("audioFileEntered");
  }


});
Template.addTopicModal.events({
  'change #createTopicDropdown': function(e){
      Session.set("topicForInsert", e.target.value);
  },
  'click #checkURL': function(e){
      e.preventDefault();
      console.log( $('#URLofInterest').val() );
      Meteor.call('fetchRemoteData', $('#URLofInterest').val(), function (error, result) {
          //console.log(error);
          if(error){ 
            alert("couldn't find it");
          } else {
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
  }
});
Template.addTopicModal.rendered = function () {
  // ...

};
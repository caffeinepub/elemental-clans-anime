import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldContactMessage = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    submittedAt : Time.Time;
  };

  type OldFanMail = {
    username : Text;
    message : Text;
    submittedAt : Time.Time;
    emailOrSocial : ?Text;
  };

  type OldActor = {
    episodes : Map.Map<Text, { id : Text; number : Nat; title : Text; summary : Text; status : { #Released; #ComingSoon; #InProduction }; duration : Nat; releaseDate : ?Time.Time; thumbnailUrl : ?Text; videoLink : ?Text }>;
    characters : Map.Map<Text, { id : Text; name : Text; clan : Text; role : Text; bio : Text; initials : Text }>;
    newsEntries : Map.Map<Text, { id : Text; title : Text; date : Time.Time; category : { #DevLog; #EpisodeAnnouncement; #SeasonUpdate }; body : Text }>;
    galleryImages : Map.Map<Text, { id : Text; title : Text; altText : Text; category : { #ConceptArt; #FightScenes; #CharacterDesigns }; path : Text; thumbnail : Text; imageData : ?Blob }>;
    clans : Map.Map<Text, { id : Text; name : Text; description : Text; symbol : Text; primaryColor : Text }>;
    userProfiles : Map.Map<Principal, { username : Text; avatarUrl : Text; matchedClanId : ?Text; matchedCharacterId : ?Text; unlockedBadges : List.List<Text> }>;
    contactMessages : List.List<OldContactMessage>;
    fanMailEntries : List.List<OldFanMail>;
  };

  type ContactStatus = { #new; #read; #replied };

  type NewContactMessage = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    submittedAt : Time.Time;
    status : ContactStatus;
  };

  type NewFanMail = {
    username : Text;
    message : Text;
    submittedAt : Time.Time;
    emailOrSocial : ?Text;
    status : ContactStatus;
  };

  type NewActor = {
    episodes : Map.Map<Text, { id : Text; number : Nat; title : Text; summary : Text; status : { #Released; #ComingSoon; #InProduction }; duration : Nat; releaseDate : ?Time.Time; thumbnailUrl : ?Text; videoLink : ?Text }>;
    characters : Map.Map<Text, { id : Text; name : Text; clan : Text; role : Text; bio : Text; initials : Text }>;
    newsEntries : Map.Map<Text, { id : Text; title : Text; date : Time.Time; category : { #DevLog; #EpisodeAnnouncement; #SeasonUpdate }; body : Text }>;
    galleryImages : Map.Map<Text, { id : Text; title : Text; altText : Text; category : { #ConceptArt; #FightScenes; #CharacterDesigns }; path : Text; thumbnail : Text; imageData : ?Blob }>;
    clans : Map.Map<Text, { id : Text; name : Text; description : Text; symbol : Text; primaryColor : Text }>;
    userProfiles : Map.Map<Principal, { username : Text; avatarUrl : Text; matchedClanId : ?Text; matchedCharacterId : ?Text; unlockedBadges : List.List<Text> }>;
    contactMessages : List.List<NewContactMessage>;
    fanMailEntries : List.List<NewFanMail>;
  };

  public func run(old : OldActor) : NewActor {
    let newContactMessages = old.contactMessages.map<OldContactMessage, NewContactMessage>(
      func(oldMessage) {
        { oldMessage with status = #new : ContactStatus };
      }
    );

    let newFanMailEntries = old.fanMailEntries.map<OldFanMail, NewFanMail>(
      func(oldEntry) {
        { oldEntry with status = #new : ContactStatus };
      }
    );

    {
      old with
      contactMessages = newContactMessages;
      fanMailEntries = newFanMailEntries;
    };
  };
};

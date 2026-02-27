import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Blob "mo:core/Blob";

module {
  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type OldEpisodeId = Text;
  type OldEpisodeNumber = Nat;

  type OldContactStatus = {
    #new;
    #read;
    #replied;
  };

  type OldUserProfile = {
    username : Text;
    avatarUrl : Text;
    matchedClanId : ?Text;
    matchedCharacterId : ?Text;
    unlockedBadges : List.List<Text>;
  };

  type OldUserProfileView = {
    username : Text;
    avatarUrl : Text;
    matchedClanId : ?Text;
    matchedCharacterId : ?Text;
    unlockedBadges : [Text];
  };

  type OldEpisode = {
    id : OldEpisodeId;
    number : OldEpisodeNumber;
    title : Text;
    summary : Text;
    status : OldEpisodeStatus;
    duration : Nat;
    releaseDate : ?Time.Time;
    thumbnailUrl : ?Text;
    videoLink : ?Text;
  };

  type OldEpisodeStatus = {
    #Released;
    #ComingSoon;
    #InProduction;
  };

  type OldCharacter = {
    id : Text;
    name : Text;
    clan : Text;
    role : Text;
    bio : Text;
    initials : Text;
  };

  type OldNewsEntry = {
    id : Text;
    title : Text;
    date : Time.Time;
    category : OldNewsCategory;
    body : Text;
  };

  type OldNewsCategory = {
    #DevLog;
    #EpisodeAnnouncement;
    #SeasonUpdate;
  };

  type OldGalleryImage = {
    id : Text;
    title : Text;
    altText : Text;
    category : OldGalleryCategory;
    path : Text;
    thumbnail : Text;
    imageData : ?Blob;
  };

  type OldGalleryCategory = {
    #ConceptArt;
    #FightScenes;
    #CharacterDesigns;
  };

  type OldClan = {
    id : Text;
    name : Text;
    description : Text;
    symbol : Text;
    primaryColor : Text;
  };

  type OldContactMessage = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    submittedAt : Time.Time;
    status : OldContactStatus;
  };

  type OldFanMail = {
    username : Text;
    message : Text;
    submittedAt : Time.Time;
    emailOrSocial : ?Text;
    status : OldContactStatus;
  };

  type OldAccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  // Old actor type definition
  type OldActorType = {
    accessControlState : OldAccessControlState;
    episodes : Map.Map<Text, OldEpisode>;
    characters : Map.Map<Text, OldCharacter>;
    newsEntries : Map.Map<Text, OldNewsEntry>;
    galleryImages : Map.Map<Text, OldGalleryImage>;
    clans : Map.Map<Text, OldClan>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    contactMessages : List.List<OldContactMessage>;
    fanMailEntries : List.List<OldFanMail>;
  };

  // New types are imported from main.mo, so we don't need to re-declare them here.

  // New actor type definition (will be built automatically via migration)
  type NewActorType = {
    accessControlState : OldAccessControlState;
    episodes : Map.Map<Text, OldEpisode>;
    characters : Map.Map<Text, OldCharacter>;
    newsEntries : Map.Map<Text, OldNewsEntry>;
    galleryImages : Map.Map<Text, OldGalleryImage>;
    clans : Map.Map<Text, OldClan>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    contactMessages : List.List<OldContactMessage>;
    fanMailEntries : List.List<OldFanMail>;
  };

  public func run(old : OldActorType) : NewActorType {
    old;
  };
};

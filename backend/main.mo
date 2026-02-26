import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import List "mo:core/List";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type EpisodeId = Text;
  type EpisodeNumber = Nat;

  public type UserProfile = {
    username : Text;
    avatarUrl : Text;
    matchedClanId : ?Text;
    matchedCharacterId : ?Text;
    unlockedBadges : [Text];
  };

  public type Episode = {
    id : EpisodeId;
    number : EpisodeNumber;
    title : Text;
    summary : Text;
    status : EpisodeStatus;
    duration : Nat;
    releaseDate : ?Time.Time;
    thumbnailUrl : ?Text;
    videoLink : ?Text;
  };

  public type EpisodeStatus = {
    #Released;
    #ComingSoon;
    #InProduction;
  };

  public type Character = {
    id : Text;
    name : Text;
    clan : Text;
    role : Text;
    bio : Text;
    initials : Text;
  };

  public type NewsEntry = {
    id : Text;
    title : Text;
    date : Time.Time;
    category : NewsCategory;
    body : Text;
  };

  public type NewsCategory = {
    #DevLog;
    #EpisodeAnnouncement;
    #SeasonUpdate;
  };

  public type GalleryImage = {
    id : Text;
    title : Text;
    altText : Text;
    category : GalleryCategory;
    path : Text;
    thumbnail : Text;
    imageData : ?Blob;
  };

  public type GalleryCategory = {
    #ConceptArt;
    #FightScenes;
    #CharacterDesigns;
  };

  public type Clan = {
    id : Text;
    name : Text;
    description : Text;
    symbol : Text;
    primaryColor : Text;
  };

  let episodes = Map.empty<Text, Episode>();
  let characters = Map.empty<Text, Character>();
  let newsEntries = Map.empty<Text, NewsEntry>();
  let galleryImages = Map.empty<Text, GalleryImage>();
  let clans = Map.empty<Text, Clan>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // USER PROFILE FUNCTIONS
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // EPISODE FUNCTIONS
  public shared ({ caller }) func addEpisode(episode : Episode) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add episodes");
    };
    if (episodes.containsKey(episode.id)) {
      Runtime.trap("Episode with id already exists");
    };
    episodes.add(episode.id, episode);
  };

  public shared ({ caller }) func updateEpisode(episode : Episode) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update episodes");
    };
    if (not episodes.containsKey(episode.id)) {
      Runtime.trap("Episode with id does not exist");
    };
    episodes.add(episode.id, episode);
  };

  public shared ({ caller }) func deleteEpisode(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete episodes");
    };
    if (not episodes.containsKey(id)) {
      Runtime.trap("Episode with id does not exist");
    };
    episodes.remove(id);
  };

  // Public content readable by anyone including guests - no auth check needed
  public query func getEpisode(id : Text) : async ?Episode {
    episodes.get(id);
  };

  public query func getAllEpisodes() : async [Episode] {
    episodes.values().toArray();
  };

  public query func getEpisodesByStatus(status : EpisodeStatus) : async [Episode] {
    episodes.values().filter(func(episode) { episode.status == status }).toArray();
  };

  public query func searchEpisodes(searchTerm : Text) : async [Episode] {
    episodes.values().filter(func(episode) {
      episode.title.contains(#text searchTerm) or episode.summary.contains(#text searchTerm)
    }).toArray();
  };

  public query func getEpisodeCount() : async Nat {
    episodes.size();
  };

  // CHARACTER FUNCTIONS
  public shared ({ caller }) func addCharacter(character : Character) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add characters");
    };
    if (characters.containsKey(character.id)) {
      Runtime.trap("Character with id already exists");
    };
    characters.add(character.id, character);
  };

  public shared ({ caller }) func updateCharacter(character : Character) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update characters");
    };
    if (not characters.containsKey(character.id)) {
      Runtime.trap("Character with id does not exist");
    };
    characters.add(character.id, character);
  };

  public shared ({ caller }) func deleteCharacter(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete characters");
    };
    if (not characters.containsKey(id)) {
      Runtime.trap("Character with id does not exist");
    };
    characters.remove(id);
  };

  // Public content readable by anyone including guests - no auth check needed
  public query func getCharacter(id : Text) : async ?Character {
    characters.get(id);
  };

  public query func getAllCharacters() : async [Character] {
    characters.values().toArray();
  };

  public query func searchCharactersByName(searchTerm : Text) : async [Character] {
    characters.values().filter(func(character) {
      character.name.contains(#text searchTerm)
    }).toArray();
  };

  public query func getCharacterCount() : async Nat {
    characters.size();
  };

  // NEWS FUNCTIONS
  public shared ({ caller }) func addNewsEntry(entry : NewsEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add news entries");
    };
    if (newsEntries.containsKey(entry.id)) {
      Runtime.trap("News entry with id already exists");
    };
    newsEntries.add(entry.id, entry);
  };

  public shared ({ caller }) func updateNewsEntry(entry : NewsEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update news entries");
    };
    if (not newsEntries.containsKey(entry.id)) {
      Runtime.trap("News entry with id does not exist");
    };
    newsEntries.add(entry.id, entry);
  };

  public shared ({ caller }) func deleteNewsEntry(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete news entries");
    };
    if (not newsEntries.containsKey(id)) {
      Runtime.trap("News entry with id does not exist");
    };
    newsEntries.remove(id);
  };

  // Public content readable by anyone including guests - no auth check needed
  public query func getNewsEntry(id : Text) : async ?NewsEntry {
    newsEntries.get(id);
  };

  public query func getAllNewsEntries() : async [NewsEntry] {
    newsEntries.values().toArray();
  };

  public query func getNewsEntriesByCategory(category : NewsCategory) : async [NewsEntry] {
    newsEntries.values().filter(func(entry) { entry.category == category }).toArray();
  };

  public query func getNewsEntryCount() : async Nat {
    newsEntries.size();
  };

  // GALLERY FUNCTIONS
  public shared ({ caller }) func addGalleryImage(image : GalleryImage) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add gallery images");
    };
    if (galleryImages.containsKey(image.id)) {
      Runtime.trap("Gallery image with id already exists");
    };
    galleryImages.add(image.id, image);
  };

  public shared ({ caller }) func updateGalleryImage(image : GalleryImage) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update gallery images");
    };
    if (not galleryImages.containsKey(image.id)) {
      Runtime.trap("Gallery image with id does not exist");
    };
    galleryImages.add(image.id, image);
  };

  public shared ({ caller }) func deleteGalleryImage(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery images");
    };
    if (not galleryImages.containsKey(id)) {
      Runtime.trap("Gallery image with id does not exist");
    };
    galleryImages.remove(id);
  };

  // Public content readable by anyone including guests - no auth check needed
  public query func getGalleryImage(id : Text) : async ?GalleryImage {
    galleryImages.get(id);
  };

  public query func getAllGalleryImages() : async [GalleryImage] {
    galleryImages.values().toArray();
  };

  public query func getGalleryImagesByCategory(category : GalleryCategory) : async [GalleryImage] {
    galleryImages.values().filter(func(image) { image.category == category }).toArray();
  };

  public query func getGalleryImageCount() : async Nat {
    galleryImages.size();
  };

  // CLAN FUNCTIONS
  public shared ({ caller }) func addClan(clan : Clan) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add clans");
    };
    if (clans.containsKey(clan.id)) {
      Runtime.trap("Clan with id already exists");
    };
    clans.add(clan.id, clan);
  };

  public shared ({ caller }) func updateClan(clan : Clan) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update clans");
    };
    if (not clans.containsKey(clan.id)) {
      Runtime.trap("Clan with id does not exist");
    };
    clans.add(clan.id, clan);
  };

  // Public content readable by anyone including guests - no auth check needed
  public query func getClan(id : Text) : async ?Clan {
    clans.get(id);
  };

  public query func getAllClans() : async [Clan] {
    clans.values().toArray();
  };

  public query func getClansByColor(color : Text) : async [Clan] {
    clans.values().filter(func(clan) { clan.primaryColor == color }).toArray();
  };

  public query func getClanCount() : async Nat {
    clans.size();
  };

  // ADMIN ONLY UTILS
  public shared ({ caller }) func resetData() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reset data");
    };
    episodes.clear();
    characters.clear();
    newsEntries.clear();
    galleryImages.clear();
    clans.clear();
  };
};

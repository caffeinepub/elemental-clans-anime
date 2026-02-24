import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";



actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type EpisodeId = Text;
  type EpisodeNumber = Nat;

  public type UserProfile = {
    name : Text;
    email : Text;
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

  // USER PROFILE MAGIC
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

  // EPISODE MAGIC
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

  public query ({ caller }) func getEpisode(id : Text) : async ?Episode {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve episodes");
    };
    episodes.get(id);
  };

  public query ({ caller }) func getAllEpisodes() : async [Episode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve episodes");
    };
    episodes.values().toArray();
  };

  public query ({ caller }) func getEpisodesByStatus(status : EpisodeStatus) : async [Episode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve episodes");
    };
    episodes.values().filter(func(episode) { episode.status == status }).toArray();
  };

  public query ({ caller }) func searchEpisodes(searchTerm : Text) : async [Episode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve episodes");
    };
    episodes.values().filter(func(episode) {
      episode.title.contains(#text searchTerm) or episode.summary.contains(#text searchTerm)
    }).toArray();
  };

  public query ({ caller }) func getEpisodeCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve episodes");
    };
    episodes.size();
  };

  // CHARACTER MAGIC
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

  public query ({ caller }) func getCharacter(id : Text) : async ?Character {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve characters");
    };
    characters.get(id);
  };

  public query ({ caller }) func getAllCharacters() : async [Character] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve characters");
    };
    characters.values().toArray();
  };

  public query ({ caller }) func searchCharactersByName(searchTerm : Text) : async [Character] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve characters");
    };
    characters.values().filter(func(character) {
      character.name.contains(#text searchTerm)
    }).toArray();
  };

  public query ({ caller }) func getCharacterCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve characters");
    };
    characters.size();
  };

  // NEWS MAGIC
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

  public query ({ caller }) func getNewsEntry(id : Text) : async ?NewsEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve news entries");
    };
    newsEntries.get(id);
  };

  public query ({ caller }) func getAllNewsEntries() : async [NewsEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve news entries");
    };
    newsEntries.values().toArray();
  };

  public query ({ caller }) func getNewsEntriesByCategory(category : NewsCategory) : async [NewsEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve news entries");
    };
    newsEntries.values().filter(func(entry) { entry.category == category }).toArray();
  };

  public query ({ caller }) func getNewsEntryCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve news entries");
    };
    newsEntries.size();
  };

  // GALLERY MAGIC
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

  public query ({ caller }) func getGalleryImage(id : Text) : async ?GalleryImage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve gallery images");
    };
    galleryImages.get(id);
  };

  public query ({ caller }) func getAllGalleryImages() : async [GalleryImage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve gallery images");
    };
    galleryImages.values().toArray();
  };

  public query ({ caller }) func getGalleryImagesByCategory(category : GalleryCategory) : async [GalleryImage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve gallery images");
    };
    galleryImages.values().filter(func(image) { image.category == category }).toArray();
  };

  public query ({ caller }) func getGalleryImageCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve gallery images");
    };
    galleryImages.size();
  };

  // CLAN MAGIC
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

  public query ({ caller }) func getClan(id : Text) : async ?Clan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve clans");
    };
    clans.get(id);
  };

  public query ({ caller }) func getAllClans() : async [Clan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve clans");
    };
    clans.values().toArray();
  };

  public query ({ caller }) func getClansByColor(color : Text) : async [Clan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve clans");
    };
    clans.values().filter(func(clan) { clan.primaryColor == color }).toArray();
  };

  public query ({ caller }) func getClanCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve clans");
    };
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

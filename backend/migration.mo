import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";

module {
  type OldUserProfile = {
    username : Text;
    avatarUrl : Text;
    matchedClanId : ?Text;
    matchedCharacterId : ?Text;
    unlockedBadges : [Text];
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewUserProfile = {
    username : Text;
    avatarUrl : Text;
    matchedClanId : ?Text;
    matchedCharacterId : ?Text;
    unlockedBadges : List.List<Text>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        { oldProfile with unlockedBadges = List.fromArray(oldProfile.unlockedBadges) };
      }
    );
    { old with userProfiles = newUserProfiles };
  };
};

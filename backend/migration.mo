import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";

module {
  // Old user profile (before the migration)
  type OldUserProfile = {
    name : Text;
    email : Text;
  };

  // Old actor type
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // New user profile (after the migration)
  type NewUserProfile = {
    username : Text;
    avatarUrl : Text;
    matchedClanId : ?Text;
    matchedCharacterId : ?Text;
    unlockedBadges : [Text];
  };

  // New actor type
  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    let newProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProfile) {
        {
          username = oldProfile.name;
          avatarUrl = "";
          matchedClanId = null;
          matchedCharacterId = null;
          unlockedBadges = [];
        };
      }
    );
    { userProfiles = newProfiles };
  };
};

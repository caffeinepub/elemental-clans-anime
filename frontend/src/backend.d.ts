import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Character {
    id: string;
    bio: string;
    clan: string;
    name: string;
    role: string;
    initials: string;
}
export interface Episode {
    id: EpisodeId;
    status: EpisodeStatus;
    title: string;
    duration: bigint;
    thumbnailUrl?: string;
    videoLink?: string;
    summary: string;
    number: EpisodeNumber;
    releaseDate?: Time;
}
export type EpisodeNumber = bigint;
export interface ContactMessage {
    status: ContactStatus;
    subject: string;
    name: string;
    submittedAt: Time;
    email: string;
    message: string;
}
export interface NewsEntry {
    id: string;
    title: string;
    body: string;
    date: Time;
    category: NewsCategory;
}
export interface GalleryImage {
    id: string;
    title: string;
    thumbnail: string;
    imageData?: Uint8Array;
    path: string;
    category: GalleryCategory;
    altText: string;
}
export interface Clan {
    id: string;
    primaryColor: string;
    name: string;
    description: string;
    symbol: string;
}
export interface UserProfileView {
    matchedClanId?: string;
    username: string;
    matchedCharacterId?: string;
    unlockedBadges: Array<string>;
    avatarUrl: string;
}
export interface FanMail {
    status: ContactStatus;
    username: string;
    submittedAt: Time;
    message: string;
    emailOrSocial?: string;
}
export type EpisodeId = string;
export enum ContactStatus {
    new_ = "new",
    read = "read",
    replied = "replied"
}
export enum EpisodeStatus {
    InProduction = "InProduction",
    Released = "Released",
    ComingSoon = "ComingSoon"
}
export enum GalleryCategory {
    FightScenes = "FightScenes",
    ConceptArt = "ConceptArt",
    CharacterDesigns = "CharacterDesigns"
}
export enum NewsCategory {
    SeasonUpdate = "SeasonUpdate",
    DevLog = "DevLog",
    EpisodeAnnouncement = "EpisodeAnnouncement"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCharacter(character: Character): Promise<void>;
    addClan(clan: Clan): Promise<void>;
    addEpisode(episode: Episode): Promise<void>;
    addGalleryImage(image: GalleryImage): Promise<void>;
    addNewsEntry(entry: NewsEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllContactMessages(): Promise<void>;
    clearAllFanMail(): Promise<void>;
    deleteCharacter(id: string): Promise<void>;
    deleteContactMessage(id: bigint): Promise<void>;
    deleteEpisode(id: string): Promise<void>;
    deleteFanMail(id: bigint): Promise<void>;
    deleteGalleryImage(id: string): Promise<void>;
    deleteNewsEntry(id: string): Promise<void>;
    filterContactsByStatus(status: ContactStatus): Promise<Array<ContactMessage>>;
    filterFanMailByStatus(status: ContactStatus): Promise<Array<FanMail>>;
    getAllCharacters(): Promise<Array<Character>>;
    getAllClans(): Promise<Array<Clan>>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllEpisodes(): Promise<Array<Episode>>;
    getAllFanMail(): Promise<Array<FanMail>>;
    getAllGalleryImages(): Promise<Array<GalleryImage>>;
    getAllNewsEntries(): Promise<Array<NewsEntry>>;
    getCallerUserProfile(): Promise<UserProfileView | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharacter(id: string): Promise<Character | null>;
    getCharacterCount(): Promise<bigint>;
    getClan(id: string): Promise<Clan | null>;
    getClanCount(): Promise<bigint>;
    getClansByColor(color: string): Promise<Array<Clan>>;
    getContactMessageStats(): Promise<{
        new: bigint;
        total: bigint;
        read: bigint;
        replied: bigint;
    }>;
    getEpisode(id: string): Promise<Episode | null>;
    getEpisodeCount(): Promise<bigint>;
    getEpisodesByStatus(status: EpisodeStatus): Promise<Array<Episode>>;
    getGalleryImage(id: string): Promise<GalleryImage | null>;
    getGalleryImageCount(): Promise<bigint>;
    getGalleryImagesByCategory(category: GalleryCategory): Promise<Array<GalleryImage>>;
    getNewsEntriesByCategory(category: NewsCategory): Promise<Array<NewsEntry>>;
    getNewsEntry(id: string): Promise<NewsEntry | null>;
    getNewsEntryCount(): Promise<bigint>;
    getUnlockedBadges(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfileView | null>;
    isCallerAdmin(): Promise<boolean>;
    resetData(): Promise<void>;
    saveCallerUserProfile(profile: UserProfileView): Promise<void>;
    searchCharactersByName(searchTerm: string): Promise<Array<Character>>;
    searchEpisodes(searchTerm: string): Promise<Array<Episode>>;
    submitContactMessage(name: string, email: string, subject: string, message: string): Promise<void>;
    submitFanMail(username: string, message: string, emailOrSocial: string | null): Promise<void>;
    unlockBadge(badgeId: string): Promise<boolean>;
    unlockLoyaltyBadges(clanId: string): Promise<Array<string>>;
    updateCharacter(character: Character): Promise<void>;
    updateClan(clan: Clan): Promise<void>;
    updateContactMessageStatus(id: bigint, newStatus: ContactStatus): Promise<void>;
    updateEpisode(episode: Episode): Promise<void>;
    updateFanMailStatus(id: bigint, newStatus: ContactStatus): Promise<void>;
    updateGalleryImage(image: GalleryImage): Promise<void>;
    updateNewsEntry(entry: NewsEntry): Promise<void>;
    useBadgeUnlockLogic(_quizResult: string): Promise<Array<string>>;
}

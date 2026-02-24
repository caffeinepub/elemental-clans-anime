import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Episode, GalleryImage, Character, NewsEntry, Clan, UserProfile } from '../backend';
import { GalleryCategory, EpisodeStatus } from '../backend';

// ── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ── Episodes ─────────────────────────────────────────────────────────────────

export function useGetAllEpisodes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Episode[]>({
    queryKey: ['episodes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEpisodes();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episode: Episode) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEpisode(episode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useUpdateEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episode: Episode) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEpisode(episode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useDeleteEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEpisode(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

// ── Gallery Images ────────────────────────────────────────────────────────────

export function useGetAllGalleryImages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryImages();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetGalleryImagesByCategory(category: GalleryCategory) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['galleryImages', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryImagesByCategory(category);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: GalleryImage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    },
  });
}

export function useUpdateGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: GalleryImage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    },
  });
}

export function useDeleteGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    },
  });
}

/**
 * Helper to get the display src for a gallery image.
 * If imageData (Uint8Array) is present, returns a blob URL.
 * Otherwise returns the path string.
 */
export function getGalleryImageSrc(image: GalleryImage): string {
  if (image.imageData && image.imageData.length > 0) {
    // Copy into a plain ArrayBuffer to satisfy Blob constructor type requirements
    const buffer = image.imageData.buffer.slice(
      image.imageData.byteOffset,
      image.imageData.byteOffset + image.imageData.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }
  return image.path || image.thumbnail || '';
}

// ── Characters ────────────────────────────────────────────────────────────────

export function useGetAllCharacters() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCharacters();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: Character) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCharacter(character);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useUpdateCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: Character) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCharacter(character);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useDeleteCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCharacter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

// ── News Entries ──────────────────────────────────────────────────────────────

export function useGetAllNewsEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewsEntry[]>({
    queryKey: ['newsEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNewsEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddNewsEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: NewsEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNewsEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsEntries'] });
    },
  });
}

export function useUpdateNewsEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: NewsEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNewsEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsEntries'] });
    },
  });
}

export function useDeleteNewsEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNewsEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsEntries'] });
    },
  });
}

// ── Clans ─────────────────────────────────────────────────────────────────────

export function useGetAllClans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Clan[]>({
    queryKey: ['clans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateClan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clan: Clan) => {
      if (!actor) throw new Error('Actor not available');
      // Try update; if not found in backend, add it
      try {
        await actor.updateClan(clan);
      } catch (err) {
        const msg = String(err);
        if (msg.includes('does not exist')) {
          await actor.addClan(clan);
        } else {
          throw err;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clans'] });
    },
  });
}

export { EpisodeStatus, GalleryCategory };

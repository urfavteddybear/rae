import type { Track } from "@rae/shared";

// Discovery = metadata only (title/artist/album/artwork/search).
// A metadata API is NOT an audio source. Provider implementations
// (Phase 3+) normalize to Track/Artist/Album shapes below.
export interface Artist {
  id: string;
  name: string;
  artworkUrl?: string;
}

export interface Album {
  id: string;
  title: string;
  artists: string[];
  artworkUrl?: string;
  releaseYear?: number;
}

export interface MusicProvider {
  readonly name: string;
  searchTracks(query: string, limit?: number): Promise<Track[]>;
  searchArtists(query: string, limit?: number): Promise<Artist[]>;
  searchAlbums(query: string, limit?: number): Promise<Album[]>;
  getArtistTopTracks(artistId: string, limit?: number): Promise<Track[]>;
  getAlbumTracks(albumId: string): Promise<Track[]>;
}

// Resolver = turns a Track (+ providerRef) into something Lavalink
// can actually play. Kept separate from discovery on purpose:
// metadata provider and playable source may differ.
export interface ResolvedSource {
  // Lavalink load query, e.g. "ytsearch:..." or direct URL.
  loadQuery: string;
  track: Track;
}

export interface MusicResolver {
  readonly name: string;
  resolve(track: Track): Promise<ResolvedSource | null>;
}

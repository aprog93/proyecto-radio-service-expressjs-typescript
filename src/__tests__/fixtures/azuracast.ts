/**
 * AzuraCast API response fixtures
 * Complete mock data for all AzuraCast endpoints
 */

import {
  // Base types
  AzuraSong,
  AzuraListeners,
  AzuraLive,
  // Now Playing
  AzuraNowPlaying,
  AzuraNowPlayingResponse,
  AzuraNowPlayingGlobalResponse,
  AzuraGlobalNowPlaying,
  // Station
  AzuraStation,
  AzuraStationInfo,
  AzuraStationInfoResponse,
  AzuraStationListItem,
  // History
  AzuraHistoryResponse,
  // On-Demand
  AzuraOnDemand,
  AzuraOnDemandResponse,
  AzuraOnDemandItemResponse,
  // Podcasts
  AzuraPodcast,
  AzuraPodcastResponse,
  AzuraPodcastItemResponse,
  AzuraPodcastEpisode,
  AzuraPodcastEpisodesResponse,
  AzuraPodcastEpisodeItemResponse,
  // Schedule
  AzuraScheduleResponse,
  AzuraScheduleItem,
  AzuraStreamer,
  AzuraStreamersResponse,
  // Requests
  AzuraRequestsResponse,
  AzuraRequestSubmitResponse,
  // Listeners
  AzuraListener,
  AzuraListenersResponse,
  // System
  AzuraSystemStatusResponse,
  AzuraTimeResponse,
  AzuraArtResponse,
} from '@/types/azuracast.js';

// ============================================
// Base Types
// ============================================

export const mockAzuraSong: AzuraSong = {
  id: '123456',
  art: 'https://example.com/cover.jpg',
  text: 'Artist Name - Song Title',
  artist: 'Artist Name',
  title: 'Song Title',
  album: 'Album Name',
  genre: 'Pop',
  lyrics: 'Song lyrics here...',
};

export const mockAzuraListeners: AzuraListeners = {
  total: 1500,
  unique: 850,
  current: 125,
};

export const mockAzuraLive: AzuraLive = {
  is_live: true,
  streamer_name: 'DJ Roberto',
  broadcast_start: Math.floor(Date.now() / 1000) - 3600,
  art: 'https://example.com/dj.jpg',
};

export const mockAzuraLiveOffline: AzuraLive = {
  is_live: false,
  streamer_name: '',
  broadcast_start: null,
  art: null,
};

// ============================================
// Now Playing
// ============================================

export const mockAzuraNowPlaying: AzuraNowPlaying = {
  sh_id: 1,
  played_at: Math.floor(Date.now() / 1000),
  duration: 240,
  playlist: 'Default Playlist',
  streamer: '',
  is_request: false,
  song: mockAzuraSong,
  elapsed: 120,
  remaining: 120,
};

export const mockAzuraStation: AzuraStation = {
  id: 1,
  name: 'Radio Cesar',
  shortcode: 'radiocesar',
  description: 'Community radio station',
  frontend_type: 'shoutcast',
  backend_type: 'liquidsoap',
  listen_url: 'http://radiocesar.local:8000/live',
  is_public: true,
  is_master_station: true,
};

export const mockAzuraNowPlayingResponse: AzuraNowPlayingResponse = {
  station: mockAzuraStation,
  listeners: mockAzuraListeners,
  live: mockAzuraLive,
  now_playing: mockAzuraNowPlaying,
  playing_next: null,
  song_history: [mockAzuraNowPlaying],
};

// Global Now Playing
export const mockAzuraGlobalNowPlaying: AzuraGlobalNowPlaying = {
  station_id: 1,
  station_name: 'Radio Cesar',
  station_shortcode: 'radiocesar',
  listeners: mockAzuraListeners,
  live: mockAzuraLive,
  now_playing: mockAzuraNowPlaying,
};

export const mockAzuraGlobalNowPlayingResponse: AzuraNowPlayingGlobalResponse = {
  nowplaying: [mockAzuraGlobalNowPlaying],
};

// ============================================
// Station Info
// ============================================

export const mockAzuraStationInfo: AzuraStationInfo = {
  id: 1,
  name: 'Radio Cesar',
  shortcode: 'radiocesar',
  description: 'Community radio from Cesar, Colombia',
  frontend_type: 'shoutcast',
  backend_type: 'liquidsoap',
  listen_url: 'http://radiocesar.local:8000/live',
  url: 'https://radio-azura.orioncaribe.com',
  public_player_url: 'https://radio-azura.orioncaribe.com/public/mi-radio-comunitaria',
  playlist_pls_url: 'https://radio-azura.orioncaribe.com/api/station/1/playlist.pls',
  playlist_m3u_url: 'https://radio-azura.orioncaribe.com/api/station/1/playlist.m3u',
  is_public: true,
  hls_enabled: true,
  hls_url: 'https://radio-azura.orioncaribe.com/api/station/1/hls/live/playlist.m3u',
  hls_listeners: 50,
  mount_count: 1,
  remote_count: 0,
};

export const mockAzuraStationInfoResponse: AzuraStationInfoResponse = {
  station: mockAzuraStationInfo,
  listeners: mockAzuraListeners,
  is_online: true,
  uptime: 86400,
};

// Stations List
export const mockAzuraStationListItem: AzuraStationListItem = {
  id: 1,
  name: 'Radio Cesar',
  shortcode: 'radiocesar',
  description: 'Community radio from Cesar, Colombia',
  frontend: 'shoutcast',
  backend: 'liquidsoap',
  listen_url: 'http://radiocesar.local:8000/live',
  url: 'https://radio-azura.orioncaribe.com',
  public_player_url: 'https://radio-azura.orioncaribe.com/public/mi-radio-comunitaria',
  playlist_pls_url: 'https://radio-azura.orioncaribe.com/api/station/1/playlist.pls',
  playlist_m3u_url: 'https://radio-azura.orioncaribe.com/api/station/1/playlist.m3u',
  is_public: true,
};

export const testAzuraStations: AzuraStationListItem[] = [mockAzuraStationListItem];

// ============================================
// History
// ============================================

export const mockAzuraHistoryResponse: AzuraHistoryResponse = {
  records: [mockAzuraNowPlaying, mockAzuraNowPlaying],
  total: 2,
  page: 1,
  pages: 1,
};

// ============================================
// On-Demand
// ============================================

export const mockAzuraOnDemand: AzuraOnDemand = {
  id: 1,
  title: 'Interview with Mayor',
  artist: 'Radio Cesar',
  album: 'Special Programs',
  genre: 'Talk',
  lyrics: '',
  art: 'https://example.com/interview.jpg',
  mime: 'audio/mp3',
  length: 1800,
  size: 15000000,
  path: '/var/azuracast/station/1/ondemand/interview.mp3',
  download_url: 'https://radio-azura.orioncaribe.com/api/station/1/ondemand/download/1',
};

export const mockAzuraOnDemandResponse: AzuraOnDemandResponse = {
  ondemand: [mockAzuraOnDemand],
  total: 1,
  page: 1,
  pages: 1,
};

export const mockAzuraOnDemandItemResponse: AzuraOnDemandItemResponse = {
  item: mockAzuraOnDemand,
};

// ============================================
// Podcasts
// ============================================

export const mockAzuraPodcast: AzuraPodcast = {
  id: 1,
  title: 'Radio Cesar News',
  description: 'Weekly news from our community',
  link: 'https://radio-azura.orioncaribe.com/public/mi-radio-comunitaria/podcasts',
  author: 'Radio Cesar Team',
  email: 'info@radiocesar.com',
  language: 'es',
  website: 'https://radio-azura.orioncaribe.com',
  episodes_count: 10,
  art: 'https://example.com/podcast-art.jpg',
};

export const mockAzuraPodcastResponse: AzuraPodcastResponse = {
  podcasts: [mockAzuraPodcast],
  total: 1,
  page: 1,
  pages: 1,
};

export const mockAzuraPodcastItemResponse: AzuraPodcastItemResponse = {
  podcast: mockAzuraPodcast,
};

export const mockAzuraPodcastEpisode: AzuraPodcastEpisode = {
  id: 1,
  title: 'Episode 1: Community News',
  description: 'First episode of our podcast',
  publish_date: '2024-01-15T10:00:00Z',
  length: 1800,
  size: 15000000,
  mime: 'audio/mp3',
  art: 'https://example.com/episode-art.jpg',
  download_url: 'https://radio-azura.orioncaribe.com/api/station/1/podcast/1/episode/1/media',
  play_url: 'https://radio-azura.orioncaribe.com/api/station/1/podcast/1/episode/1/media',
};

export const mockAzuraPodcastEpisodesResponse: AzuraPodcastEpisodesResponse = {
  episodes: [mockAzuraPodcastEpisode],
  total: 1,
  page: 1,
  pages: 1,
};

export const mockAzuraPodcastEpisodeItemResponse: AzuraPodcastEpisodeItemResponse = {
  episode: mockAzuraPodcastEpisode,
};

// ============================================
// Streamers
// ============================================

export const mockAzuraStreamer: AzuraStreamer = {
  id: 1,
  streamer_username: 'dj_roberto',
  display_name: 'DJ Roberto',
  description: 'Evening show host',
  art: 'https://example.com/dj-roberto.jpg',
  is_active: true,
  last_seen: Math.floor(Date.now() / 1000),
};

export const mockAzuraStreamersResponse: AzuraStreamersResponse = {
  streamers: [mockAzuraStreamer],
};

// ============================================
// Schedule (depends on Streamers)
// ============================================

export const mockAzuraScheduleItem: AzuraScheduleItem = {
  id: 1,
  name: 'Morning Show',
  start_time: '06:00:00',
  end_time: '09:00:00',
  day: 1,
  loop_days: [1, 2, 3, 4, 5],
  station_id: 1,
  description: 'Start your day with news and music',
  url: '',
  artwork: 'https://example.com/morning-show.jpg',
  color: '#FF6B6B',
  streamers: [mockAzuraStreamer],
};

export const mockAzuraScheduleResponse: AzuraScheduleResponse = {
  schedule: [mockAzuraScheduleItem],
  day: new Date().getDay(),
  yesterday: '2024-01-14',
  tomorrow: '2024-01-16',
};

// ============================================
// Requests
// ============================================

export const mockAzuraRequest: AzuraRequestsResponse = {
  requests: [],
  allowed: true,
  request_delay: 60,
  request_limit: 3,
};

export const mockAzuraRequestSubmitResponse: AzuraRequestSubmitResponse = {
  success: true,
  message: 'Request submitted successfully',
  request_id: 123,
};

// ============================================
// Listeners
// ============================================

export const mockAzuraListener: AzuraListener = {
  ip: '192.168.1.1',
  user_agent: 'Mozilla/5.0',
  connect_time: Math.floor(Date.now() / 1000) - 3600,
  duration: 3600,
  mount_name: '/live',
  country: 'CO',
  region: 'CES',
  city: 'Valledupar',
};

export const mockAzuraListenersResponse: AzuraListenersResponse = {
  listeners: [mockAzuraListener],
  total: 100,
  unique: 80,
};

// ============================================
// System Status
// ============================================

export const mockAzuraFrontendStatus = {
  frontend_type: 'shoutcast',
  is_running: true,
  message: 'Frontend is running',
  listeners: 50,
};

export const mockAzuraBackendStatus = {
  backend_type: 'liquidsoap',
  is_running: true,
  message: 'Backend is running',
  current_song: mockAzuraSong,
  listeners: 50,
};

export const mockAzuraSystemStatusResponse: AzuraSystemStatusResponse = {
  online: true,
  timestamp: Date.now(),
  needs_restart: false,
  frontends: [mockAzuraFrontendStatus],
  backends: [mockAzuraBackendStatus],
};

// ============================================
// Time
// ============================================

export const mockAzuraTimeResponse: AzuraTimeResponse = {
  timestamp: Date.now(),
  utc_datetime: new Date().toISOString(),
  utc_date: new Date().toISOString().split('T')[0],
  utc_time: new Date().toTimeString(),
  utc_json: new Date().toISOString(),
  timezone: 'America/Bogota',
  unix_time: Math.floor(Date.now() / 1000),
};

// ============================================
// Art
// ============================================

export const mockAzuraArtResponse: AzuraArtResponse = {
  url: 'https://example.com/art.jpg',
  path: '/var/azuracast/station/1/artwork.jpg',
};

// ============================================
// Helper Functions
// ============================================

export function createMockAzuraSong(overrides: Partial<AzuraSong> = {}): AzuraSong {
  return {
    ...mockAzuraSong,
    id: `song-${Date.now()}`,
    ...overrides,
  };
}

export function createMockAzuraNowPlaying(
  overrides: Partial<AzuraNowPlaying> = {}
): AzuraNowPlaying {
  return {
    ...mockAzuraNowPlaying,
    sh_id: Math.floor(Math.random() * 10000),
    played_at: Math.floor(Date.now() / 1000),
    ...overrides,
  };
}

export function createMockAzuraNowPlayingResponse(
  overrides: Partial<AzuraNowPlayingResponse> = {}
): AzuraNowPlayingResponse {
  return {
    ...mockAzuraNowPlayingResponse,
    ...overrides,
  };
}

export function createMockAzuraScheduleItem(
  overrides: Partial<AzuraScheduleItem> = {}
): AzuraScheduleItem {
  return {
    ...mockAzuraScheduleItem,
    id: Math.floor(Math.random() * 1000),
    ...overrides,
  };
}

export function createMockAzuraPodcast(
  overrides: Partial<AzuraPodcast> = {}
): AzuraPodcast {
  return {
    ...mockAzuraPodcast,
    id: Math.floor(Math.random() * 1000),
    ...overrides,
  };
}

export function createMockAzuraOnDemand(
  overrides: Partial<AzuraOnDemand> = {}
): AzuraOnDemand {
  return {
    ...mockAzuraOnDemand,
    id: Math.floor(Math.random() * 1000),
    ...overrides,
  };
}

// ============================================
// Error Response Fixtures
// ============================================

export const azuracastApiError = {
  error: 'Unauthorized',
  message: 'Invalid API key',
};

export const azuracastNotFoundError = {
  error: 'Not Found',
  message: 'Station not found',
};

export const azuracastServerError = {
  error: 'Internal Server Error',
  message: 'AzuraCast API unavailable',
};

/**
 * Types for AzuraCast API responses
 * Complete type definitions for all public endpoints
 */

// ============================================
// Tipos Base
// ============================================

export interface AzuraSong {
  id: string;
  art: string;
  text: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
  lyrics: string;
}

export interface AzuraListeners {
  total: number;
  unique: number;
  current: number;
}

export interface AzuraLive {
  is_live: boolean;
  streamer_name: string;
  broadcast_start: number | null;
  art: string | null;
}

// ============================================
// Tipos para Now Playing
// ============================================

export interface AzuraNowPlaying {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: AzuraSong;
  elapsed: number;
  remaining: number;
}

export interface AzuraStation {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  frontend_type: string;
  backend_type: string;
  listen_url: string;
  is_public: boolean;
  is_master_station: boolean;
}

export interface AzuraNowPlayingResponse {
  station: AzuraStation;
  listeners: AzuraListeners;
  live: AzuraLive;
  now_playing: AzuraNowPlaying;
  playing_next: AzuraNowPlaying | null;
  song_history: AzuraNowPlaying[];
}

// ============================================
// Tipos para Global Now Playing (varias estaciones)
// ============================================

export interface AzuraGlobalNowPlaying {
  station_id: number;
  station_name: string;
  station_shortcode: string;
  listeners: AzuraListeners;
  live: AzuraLive;
  now_playing: AzuraNowPlaying;
}

export interface AzuraNowPlayingGlobalResponse {
  nowplaying: AzuraGlobalNowPlaying[];
}

// ============================================
// Tipos para Station Info
// ============================================

export interface AzuraStationInfo {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  frontend_type: string;
  backend_type: string;
  listen_url: string;
  url: string;
  public_player_url: string;
  playlist_pls_url: string;
  playlist_m3u_url: string;
  is_public: boolean;
  hls_enabled: boolean;
  hls_url: string | null;
  hls_listeners: number;
  mount_count: number;
  remote_count: number;
}

export interface AzuraStationInfoResponse {
  station: AzuraStationInfo;
  listeners: AzuraListeners;
  is_online: boolean;
  uptime: number;
}

// ============================================
// Tipos para History
// ============================================

export interface AzuraHistoryResponse {
  // Real AzuraCast response - can be either an array or object with records
  records?: AzuraNowPlaying[];
  total?: number;
  page?: number;
  pages?: number;
}

// Type for direct array response (what AzuraCast actually returns)
export type AzuraHistoryArrayResponse = AzuraNowPlaying[];

// ============================================
// Tipos para On-Demand
// ============================================

export interface AzuraOnDemand {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  lyrics: string;
  art: string;
  mime: string;
  length: number;
  size: number;
  path: string;
  download_url: string;
}

export interface AzuraOnDemandResponse {
  ondemand: AzuraOnDemand[];
  total: number;
  page: number;
  pages: number;
}

export interface AzuraOnDemandItemResponse {
  item: AzuraOnDemand;
}

// ============================================
// Tipos para Podcasts
// ============================================

export interface AzuraPodcast {
  id: number;
  title: string;
  description: string;
  link: string;
  author: string;
  email: string;
  language: string;
  website: string;
  episodes_count: number;
  art: string;
}

export interface AzuraPodcastResponse {
  podcasts: AzuraPodcast[];
  total: number;
  page: number;
  pages: number;
}

export interface AzuraPodcastItemResponse {
  podcast: AzuraPodcast;
}

export interface AzuraPodcastEpisode {
  id: number;
  title: string;
  description: string;
  publish_date: string;
  length: number;
  size: number;
  mime: string;
  art: string;
  download_url: string;
  play_url: string;
}

export interface AzuraPodcastEpisodesResponse {
  episodes: AzuraPodcastEpisode[];
  total: number;
  page: number;
  pages: number;
}

export interface AzuraPodcastEpisodeItemResponse {
  episode: AzuraPodcastEpisode;
}

// ============================================
// Tipos para Schedule
// ============================================

export interface AzuraScheduleItem {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  day: number;
  loop_days: number[];
  station_id: number;
  description: string;
  url: string;
  artwork: string;
  color: string;
 streamers: AzuraStreamer[];
}

export interface AzuraScheduleResponse {
  schedule: AzuraScheduleItem[];
  day: number;
  yesterday: string;
  tomorrow: string;
}

// ============================================
// Tipos para Streamers/DJs
// ============================================

export interface AzuraStreamer {
  id: number;
  streamer_username: string;
  display_name: string;
  description: string;
  art: string;
  is_active: boolean;
  last_seen: number;
}

export interface AzuraStreamersResponse {
  streamers: AzuraStreamer[];
}

// ============================================
// Tipos para Requests
// ============================================

export interface AzuraRequest {
  id: number;
  song_id: string;
  station_id: number;
  ip: string;
  timestamp: number;
  played_at: number;
  status: string;
}

export interface AzuraRequestsResponse {
  requests: AzuraRequest[];
  allowed: boolean;
  request_delay: number;
  request_limit: number;
}

export interface AzuraRequestSubmitResponse {
  success: boolean;
  message: string;
  request_id?: number;
}

// ============================================
// Tipos para Listeners
// ============================================

export interface AzuraListener {
  ip: string;
  user_agent: string;
  connect_time: number;
  duration: number;
  mount_name: string;
  country: string;
  region: string;
  city: string;
}

export interface AzuraListenersResponse {
  listeners: AzuraListener[];
  total: number;
  unique: number;
}

// ============================================
// Tipos para System Status
// ============================================

export interface AzuraFrontendStatus {
  frontend_type: string;
  is_running: boolean;
  message: string;
  listeners: number;
}

export interface AzuraBackendStatus {
  backend_type: string;
  is_running: boolean;
  message: string;
  current_song: AzuraSong | null;
  listeners: number;
}

export interface AzuraSystemStatusResponse {
  // Real AzuraCast response
  online: boolean;
  timestamp: number;
  // Extended info (may not be available on all instances)
  needs_restart?: boolean;
  frontends?: AzuraFrontendStatus[];
  backends?: AzuraBackendStatus[];
}

// ============================================
// Tipos para Time
// ============================================

export interface AzuraTimeResponse {
  // Real AzuraCast response
  timestamp: number;
  utc_datetime: string;
  utc_date: string;
  utc_time: string;
  utc_json: string;
  // Alternative format (may not be available)
  timezone?: string;
  unix_time?: number;
}

// ============================================
// Tipos para Stations List
// ============================================

export interface AzuraStationListItem {
  id: number;
  name: string;
  shortcode: string;
  description: string;
  frontend: string;
  backend: string;
  listen_url: string;
  url: string;
  public_player_url: string;
  playlist_pls_url: string;
  playlist_m3u_url: string;
  is_public: boolean;
}

export interface AzuraStationsResponse {
  stations: AzuraStationListItem[];
}

// ============================================
// Tipos para Art (Media Artwork)
// ============================================

export interface AzuraArtResponse {
  url: string;
  path: string;
}

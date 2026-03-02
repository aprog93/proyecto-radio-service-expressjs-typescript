/**
 * AzuraCast API Service - Complete proxy and cache layer
 * Implements all public endpoints from AzuraCast API
 */

import axios, { AxiosError } from 'axios';
import { env } from '../config/env.js';
import { cache } from '../lib/cache.js';
import {
  // Now Playing
  AzuraNowPlayingResponse,
  AzuraNowPlayingGlobalResponse,
  AzuraGlobalNowPlaying,
  // Station
  AzuraStationInfoResponse,
  AzuraStationInfo,
  AzuraStationListItem,
  // History
  AzuraHistoryResponse,
  // On-Demand
  AzuraOnDemandResponse,
  AzuraOnDemandItemResponse,
  // Podcasts
  AzuraPodcastResponse,
  AzuraPodcastItemResponse,
  AzuraPodcastEpisodesResponse,
  AzuraPodcastEpisodeItemResponse,
  // Schedule
  AzuraScheduleResponse,
  AzuraScheduleItem,
  // Streamers
  AzuraStreamersResponse,
  AzuraStreamer,
  // Requests
  AzuraRequestsResponse,
  AzuraRequestSubmitResponse,
  // Listeners
  AzuraListenersResponse,
  AzuraListener,
  // System Status
  AzuraSystemStatusResponse,
  AzuraFrontendStatus,
  AzuraBackendStatus,
  // Time
  AzuraTimeResponse,
  // Art
  AzuraArtResponse,
} from '../types/azuracast.js';

const STATION_ID = env.AZURACAST_STATION_ID;

// Create axios client with better timeout and error handling
const client = axios.create({
  baseURL: `${env.AZURACAST_BASE_URL}/api`,
  timeout: 30000, // 30 seconds - AzuraCast can be slow
  // Don't throw on 4xx/5xx, let us handle it
  validateStatus: () => true,
});

// Add retry logic for network errors (only 1 retry to avoid long delays)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Only retry once on network errors
    if (!error.response && config && !config._retryCount) {
      config._retryCount = 1;
      console.warn(`Retrying AzuraCast request (attempt 2/2)...`);
      return client(config);
    }
    
    return Promise.reject(error);
  }
);

// Add API key header if available
if (env.AZURACAST_API_KEY) {
  client.defaults.headers.common['X-API-Key'] = env.AZURACAST_API_KEY;
}

export class AzuraCastService {
  // ============================================
  // Global Endpoints
  // ============================================

  /**
   * GET /status
   * Get system status
   */
  static async getSystemStatus(): Promise<AzuraSystemStatusResponse> {
    const cacheKey = 'azura:system:status';
    const cached = cache.get<AzuraSystemStatusResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraSystemStatusResponse>('/status');
      cache.set(cacheKey, response.data, 60); // 1 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getSystemStatus', err);
    }
  }

  /**
   * GET /time
   * Get server time
   */
  static async getServerTime(): Promise<AzuraTimeResponse> {
    const cacheKey = 'azura:system:time';
    const cached = cache.get<AzuraTimeResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraTimeResponse>('/time');
      cache.set(cacheKey, response.data, 60); // 1 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getServerTime', err);
    }
  }

  /**
   * GET /nowplaying
   * Get now playing for all stations
   */
  static async getGlobalNowPlaying(): Promise<AzuraNowPlayingGlobalResponse> {
    const cacheKey = 'azura:global:nowplaying';
    const cached = cache.get<AzuraNowPlayingGlobalResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraNowPlayingGlobalResponse>('/nowplaying');
      cache.set(cacheKey, response.data, env.CACHE_TTL_SECONDS);
      return response.data;
    } catch (err) {
      throw this._handleError('getGlobalNowPlaying', err);
    }
  }

  /**
   * GET /nowplaying/{station_id}
   * Get now playing for specific station (uses cache)
   */
  static async getNowPlaying(): Promise<AzuraNowPlayingResponse> {
    const cacheKey = `azura:${STATION_ID}:now-playing`;
    const cached = cache.get<AzuraNowPlayingResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraNowPlayingResponse>(
        `/nowplaying/${STATION_ID}`
      );
      cache.set(cacheKey, response.data, env.CACHE_TTL_SECONDS);
      return response.data;
    } catch (err) {
      throw this._handleError('getNowPlaying', err);
    }
  }

  /**
   * GET /nowplaying/{station_id}/art
   * Get current playing song artwork
   */
  static async getNowPlayingArt(): Promise<AzuraArtResponse> {
    const cacheKey = `azura:${STATION_ID}:nowplaying:art`;
    const cached = cache.get<AzuraArtResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraArtResponse>(
        `/nowplaying/${STATION_ID}/art`
      );
      cache.set(cacheKey, response.data, env.CACHE_TTL_SECONDS);
      return response.data;
    } catch (err) {
      throw this._handleError('getNowPlayingArt', err);
    }
  }

  /**
   * GET /stations
   * Get list of all stations
   */
  static async getStations(): Promise<AzuraStationListItem[]> {
    const cacheKey = 'azura:stations:list';
    const cached = cache.get<AzuraStationListItem[]>(cacheKey);
    
    if (cached) return cached;

    try {
      // API returns directly an array, not { stations: [...] }
      const response = await client.get<AzuraStationListItem[]>('/stations');
      cache.set(cacheKey, response.data, 300); // 5 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getStations', err);
    }
  }

  // ============================================
  // Station Endpoints
  // ============================================

  /**
   * GET /station/{station_id}
   * Get station public info
   */
  static async getStationInfo(): Promise<AzuraStationInfoResponse> {
    const cacheKey = `azura:${STATION_ID}:info`;
    const cached = cache.get<AzuraStationInfoResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraStationInfoResponse>(
        `/station/${STATION_ID}`
      );
      cache.set(cacheKey, response.data, 120); // 2 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getStationInfo', err);
    }
  }

  /**
   * GET /station/{station_id}/art/{media_id}
   * Get artwork for specific media
   */
  static async getMediaArt(mediaId: string): Promise<AzuraArtResponse> {
    const cacheKey = `azura:${STATION_ID}:media:${mediaId}:art`;
    const cached = cache.get<AzuraArtResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraArtResponse>(
        `/station/${STATION_ID}/art/${mediaId}`
      );
      cache.set(cacheKey, response.data, env.CACHE_TTL_SECONDS);
      return response.data;
    } catch (err) {
      throw this._handleError('getMediaArt', err);
    }
  }

  // ============================================
  // History
  // ============================================

  /**
   * GET /station/{station_id}/history
   * Get playback history
   * Note: AzuraCast returns an array directly, not an object
   */
  static async getHistory(
    page: number = 1,
    limit: number = 50
  ): Promise<AzuraHistoryResponse> {
    const cacheKey = `azura:${STATION_ID}:history:${page}:${limit}`;
    const cached = cache.get<AzuraHistoryResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraHistoryResponse>(
        `/station/${STATION_ID}/history`,
        { params: { page, limit } }
      );
      // AzuraCast returns an array directly
      const data = response.data;
      cache.set(cacheKey, data, 60); // 1 min cache
      return data;
    } catch (err) {
      throw this._handleError('getHistory', err);
    }
  }

  // ============================================
  // On-Demand
  // ============================================

  /**
   * GET /station/{station_id}/ondemand
   * Get on-demand media list
   */
  static async getOnDemand(
    page: number = 1,
    limit: number = 25
  ): Promise<AzuraOnDemandResponse> {
    const cacheKey = `azura:${STATION_ID}:ondemand:${page}:${limit}`;
    const cached = cache.get<AzuraOnDemandResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraOnDemandResponse>(
        `/station/${STATION_ID}/ondemand`,
        { params: { page, limit } }
      );
      cache.set(cacheKey, response.data, 120); // 2 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getOnDemand', err);
    }
  }

  /**
   * GET /station/{station_id}/ondemand/{media_id}
   * Get specific on-demand media
   */
  static async getOnDemandItem(mediaId: number): Promise<AzuraOnDemandItemResponse> {
    const cacheKey = `azura:${STATION_ID}:ondemand:${mediaId}`;
    const cached = cache.get<AzuraOnDemandItemResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraOnDemandItemResponse>(
        `/station/${STATION_ID}/ondemand/${mediaId}`
      );
      cache.set(cacheKey, response.data, 120);
      return response.data;
    } catch (err) {
      throw this._handleError('getOnDemandItem', err);
    }
  }

  /**
   * GET /station/{station_id}/ondemand/download/{media_id}
   * Get download URL for on-demand media
   */
  static async getOnDemandDownload(mediaId: number): Promise<{ url: string }> {
    try {
      const response = await client.get<{ url: string }>(
        `/station/${STATION_ID}/ondemand/download/${mediaId}`
      );
      return response.data;
    } catch (err) {
      throw this._handleError('getOnDemandDownload', err);
    }
  }

  // ============================================
  // Podcasts
  // ============================================

  /**
   * GET /station/{station_id}/public/podcasts
   * Get list of podcasts
   */
  static async getPodcasts(
    page: number = 1,
    limit: number = 25
  ): Promise<AzuraPodcastResponse> {
    const cacheKey = `azura:${STATION_ID}:podcasts:${page}:${limit}`;
    const cached = cache.get<AzuraPodcastResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraPodcastResponse>(
        `/station/${STATION_ID}/public/podcasts`,
        { params: { page, limit } }
      );
      cache.set(cacheKey, response.data, 300); // 5 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getPodcasts', err);
    }
  }

  /**
   * GET /station/{station_id}/public/podcast/{podcast_id}
   * Get specific podcast
   */
  static async getPodcast(podcastId: number): Promise<AzuraPodcastItemResponse> {
    const cacheKey = `azura:${STATION_ID}:podcast:${podcastId}`;
    const cached = cache.get<AzuraPodcastItemResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraPodcastItemResponse>(
        `/station/${STATION_ID}/public/podcast/${podcastId}`
      );
      cache.set(cacheKey, response.data, 300);
      return response.data;
    } catch (err) {
      throw this._handleError('getPodcast', err);
    }
  }

  /**
   * GET /station/{station_id}/public/podcast/{podcast_id}/episodes
   * Get podcast episodes
   */
  static async getPodcastEpisodes(
    podcastId: number,
    page: number = 1,
    limit: number = 25
  ): Promise<AzuraPodcastEpisodesResponse> {
    const cacheKey = `azura:${STATION_ID}:podcast:${podcastId}:episodes:${page}`;
    const cached = cache.get<AzuraPodcastEpisodesResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraPodcastEpisodesResponse>(
        `/station/${STATION_ID}/public/podcast/${podcastId}/episodes`,
        { params: { page, limit } }
      );
      cache.set(cacheKey, response.data, 180); // 3 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getPodcastEpisodes', err);
    }
  }

  /**
   * GET /station/{station_id}/public/podcast/{podcast_id}/episode/{episode_id}
   * Get specific podcast episode
   */
  static async getPodcastEpisode(
    podcastId: number,
    episodeId: number
  ): Promise<AzuraPodcastEpisodeItemResponse> {
    const cacheKey = `azura:${STATION_ID}:podcast:${podcastId}:episode:${episodeId}`;
    const cached = cache.get<AzuraPodcastEpisodeItemResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraPodcastEpisodeItemResponse>(
        `/station/${STATION_ID}/public/podcast/${podcastId}/episode/${episodeId}`
      );
      cache.set(cacheKey, response.data, 180);
      return response.data;
    } catch (err) {
      throw this._handleError('getPodcastEpisode', err);
    }
  }

  /**
   * GET /station/{station_id}/podcast/{podcast_id}/art
   * Get podcast artwork
   */
  static async getPodcastArt(podcastId: number): Promise<AzuraArtResponse> {
    const cacheKey = `azura:${STATION_ID}:podcast:${podcastId}:art`;
    const cached = cache.get<AzuraArtResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraArtResponse>(
        `/station/${STATION_ID}/podcast/${podcastId}/art`
      );
      cache.set(cacheKey, response.data, 300);
      return response.data;
    } catch (err) {
      throw this._handleError('getPodcastArt', err);
    }
  }

  /**
   * GET /station/{station_id}/podcast/{podcast_id}/episode/{episode_id}/art
   * Get episode artwork
   */
  static async getEpisodeArt(
    podcastId: number,
    episodeId: number
  ): Promise<AzuraArtResponse> {
    const cacheKey = `azura:${STATION_ID}:podcast:${podcastId}:episode:${episodeId}:art`;
    const cached = cache.get<AzuraArtResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraArtResponse>(
        `/station/${STATION_ID}/podcast/${podcastId}/episode/${episodeId}/art`
      );
      cache.set(cacheKey, response.data, 180);
      return response.data;
    } catch (err) {
      throw this._handleError('getEpisodeArt', err);
    }
  }

  /**
   * GET /station/{station_id}/podcast/{podcast_id}/episode/{episode_id}/media
   * Get episode media URL
   */
  static async getEpisodeMedia(
    podcastId: number,
    episodeId: number
  ): Promise<{ url: string }> {
    const cacheKey = `azura:${STATION_ID}:podcast:${podcastId}:episode:${episodeId}:media`;
    const cached = cache.get<{ url: string }>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<{ url: string }>(
        `/station/${STATION_ID}/podcast/${podcastId}/episode/${episodeId}/media`
      );
      cache.set(cacheKey, response.data, 180);
      return response.data;
    } catch (err) {
      throw this._handleError('getEpisodeMedia', err);
    }
  }

  // ============================================
  // Schedule
  // ============================================

  /**
   * GET /station/{station_id}/schedule
   * Get station schedule
   */
  static async getSchedule(
    day: number = new Date().getDay()
  ): Promise<AzuraScheduleResponse> {
    const cacheKey = `azura:${STATION_ID}:schedule:${day}`;
    const cached = cache.get<AzuraScheduleResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraScheduleResponse>(
        `/station/${STATION_ID}/schedule`,
        { params: { day } }
      );
      cache.set(cacheKey, response.data, 300); // 5 min cache
      return response.data;
    } catch (err) {
      throw this._handleError('getSchedule', err);
    }
  }

  // ============================================
  // Streamers
  // ============================================

  /**
   * GET /station/{station_id}/streamers
   * Get list of streamers/DJs
   */
  static async getStreamers(): Promise<AzuraStreamersResponse> {
    const cacheKey = `azura:${STATION_ID}:streamers`;
    const cached = cache.get<AzuraStreamersResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraStreamersResponse>(
        `/station/${STATION_ID}/streamers`
      );
      cache.set(cacheKey, response.data, 300);
      return response.data;
    } catch (err) {
      throw this._handleError('getStreamers', err);
    }
  }

  /**
   * GET /station/{station_id}/streamer/{streamer_id}/art
   * Get streamer avatar
   */
  static async getStreamerArt(streamerId: number): Promise<AzuraArtResponse> {
    const cacheKey = `azura:${STATION_ID}:streamer:${streamerId}:art`;
    const cached = cache.get<AzuraArtResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraArtResponse>(
        `/station/${STATION_ID}/streamer/${streamerId}/art`
      );
      cache.set(cacheKey, response.data, 300);
      return response.data;
    } catch (err) {
      throw this._handleError('getStreamerArt', err);
    }
  }

  // ============================================
  // Requests
  // ============================================

  /**
   * GET /station/{station_id}/requests
   * Get available song requests
   */
  static async getRequests(): Promise<AzuraRequestsResponse> {
    try {
      const response = await client.get<AzuraRequestsResponse>(
        `/station/${STATION_ID}/requests`
      );
      return response.data;
    } catch (err) {
      throw this._handleError('getRequests', err);
    }
  }

  /**
   * POST /station/{station_id}/request/{request_id}
   * Submit song request
   */
  static async submitRequest(requestId: number): Promise<AzuraRequestSubmitResponse> {
    try {
      const response = await client.post<AzuraRequestSubmitResponse>(
        `/station/${STATION_ID}/request/${requestId}`
      );
      // Invalidate now playing cache after request
      cache.clear(`azura:${STATION_ID}:now-playing`);
      return response.data;
    } catch (err) {
      throw this._handleError('submitRequest', err);
    }
  }

  /**
   * Legacy method - Request a song by song_id
   */
  static async requestSong(songId: string): Promise<AzuraRequestSubmitResponse> {
    try {
      const response = await client.post(
        `/stations/${STATION_ID}/requests`,
        { song_id: songId }
      );
      cache.clear(`azura:${STATION_ID}:now-playing`);
      return response.data;
    } catch (err) {
      throw this._handleError('requestSong', err);
    }
  }

  // ============================================
  // Listeners
  // ============================================

  /**
   * GET /station/{station_id}/listeners
   * Get current listeners
   */
  static async getListeners(): Promise<AzuraListenersResponse> {
    const cacheKey = `azura:${STATION_ID}:listeners`;
    const cached = cache.get<AzuraListenersResponse>(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await client.get<AzuraListenersResponse>(
        `/station/${STATION_ID}/listeners`
      );
      cache.set(cacheKey, response.data, 30); // 30 sec cache
      return response.data;
    } catch (err) {
      throw this._handleError('getListeners', err);
    }
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Clear all cache (admin only)
   */
  static clearCache(): void {
    cache.clear();
  }

  /**
   * Clear specific station cache
   */
  static clearStationCache(): void {
    cache.clear(`azura:${STATION_ID}:*`);
  }

  // ============================================
  // Error Handler
  // ============================================

  private static _handleError(operation: string, error: unknown): Error {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      console.error(`AzuraCast API Error [${operation}]:`, {
        status: error.response?.status,
        message,
        url: error.config?.url,
      });
      return new Error(`AzuraCast ${operation} failed: ${message}`);
    }
    
    console.error(`AzuraCast API Error [${operation}]:`, error);
    return error instanceof Error ? error : new Error(String(error));
  }
}

export default AzuraCastService;

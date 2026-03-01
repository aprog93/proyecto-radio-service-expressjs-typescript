/**
 * Station routes - Complete AzuraCast API proxy
 * All public endpoints from AzuraCast API
 */

import { Router, Request, Response } from 'express';
import { AzuraCastService } from '../services/azuracast.js';
import { success, error } from '../types/api.js';

const router: Router = Router();

// ============================================
// Global Endpoints
// ============================================

/**
 * GET /api/station/status
 * Get system status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getSystemStatus();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch system status';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/time
 * Get server time
 */
router.get('/time', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getServerTime();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch server time';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/nowplaying-global
 * Get now playing for all stations
 */
router.get('/nowplaying-global', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getGlobalNowPlaying();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch global now playing';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Now Playing (cached)
// ============================================

/**
 * GET /api/station/now-playing
 * Get current playing track and metadata
 */
router.get('/now-playing', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getNowPlaying();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch now playing';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/now-playing/art
 * Get current playing song artwork
 */
router.get('/now-playing/art', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getNowPlayingArt();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch now playing art';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Station Info
// ============================================

/**
 * GET /api/station/info
 * Get station public information
 */
router.get('/info', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getStationInfo();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch station info';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/stations
 * Get list of all stations
 */
router.get('/stations', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getStations();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch stations';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/media/:mediaId/art
 * Get artwork for specific media
 */
router.get('/media/:mediaId/art', async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.params;
    if (!mediaId) {
      res.status(400).json(error('Missing mediaId parameter'));
      return;
    }
    const data = await AzuraCastService.getMediaArt(mediaId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch media art';
    res.status(500).json(error(msg));
  }
});

// ============================================
// History
// ============================================

/**
 * GET /api/station/history
 * Get playback history
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const data = await AzuraCastService.getHistory(page, limit);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch history';
    res.status(500).json(error(msg));
  }
});

// ============================================
// On-Demand
// ============================================

/**
 * GET /api/station/ondemand
 * Get on-demand media list
 */
router.get('/ondemand', async (_req: Request, res: Response) => {
  try {
    const page = parseInt(_req.query.page as string) || 1;
    const limit = parseInt(_req.query.limit as string) || 25;
    const data = await AzuraCastService.getOnDemand(page, limit);
    res.json(success(data));
  } catch (err) {
    // On-demand may not be enabled - return empty response instead of 500
    const errMsg = err instanceof Error ? err.message : '';
    if (errMsg.includes('no admite medios bajo demanda') || errMsg.includes('On-Demand is disabled')) {
      res.json(success({ ondemand: [], total: 0 }));
      return;
    }
    const msg = err instanceof Error ? err.message : 'Failed to fetch on-demand media';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/ondemand/:mediaId
 * Get specific on-demand media
 */
router.get('/ondemand/:mediaId', async (req: Request, res: Response) => {
  try {
    const mediaId = parseInt(req.params.mediaId, 10);
    if (isNaN(mediaId)) {
      res.status(400).json(error('Invalid media ID'));
      return;
    }
    const data = await AzuraCastService.getOnDemandItem(mediaId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch on-demand item';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/ondemand/:mediaId/download
 * Get download URL for on-demand media
 */
router.get('/ondemand/:mediaId/download', async (req: Request, res: Response) => {
  try {
    const mediaId = parseInt(req.params.mediaId, 10);
    if (isNaN(mediaId)) {
      res.status(400).json(error('Invalid media ID'));
      return;
    }
    const data = await AzuraCastService.getOnDemandDownload(mediaId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to get download URL';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Podcasts
// ============================================

/**
 * GET /api/station/podcasts
 * Get list of podcasts
 */
router.get('/podcasts', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const data = await AzuraCastService.getPodcasts(page, limit);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch podcasts';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/podcasts/:podcastId
 * Get specific podcast
 */
router.get('/podcasts/:podcastId', async (req: Request, res: Response) => {
  try {
    const podcastId = parseInt(req.params.podcastId, 10);
    if (isNaN(podcastId)) {
      res.status(400).json(error('Invalid podcast ID'));
      return;
    }
    const data = await AzuraCastService.getPodcast(podcastId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch podcast';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/podcasts/:podcastId/episodes
 * Get podcast episodes
 */
router.get('/podcasts/:podcastId/episodes', async (req: Request, res: Response) => {
  try {
    const podcastId = parseInt(req.params.podcastId, 10);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    
    if (isNaN(podcastId)) {
      res.status(400).json(error('Invalid podcast ID'));
      return;
    }
    
    const data = await AzuraCastService.getPodcastEpisodes(podcastId, page, limit);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch podcast episodes';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/podcasts/:podcastId/episodes/:episodeId
 * Get specific podcast episode
 */
router.get('/podcasts/:podcastId/episodes/:episodeId', async (req: Request, res: Response) => {
  try {
    const podcastId = parseInt(req.params.podcastId, 10);
    const episodeId = parseInt(req.params.episodeId, 10);
    
    if (isNaN(podcastId) || isNaN(episodeId)) {
      res.status(400).json(error('Invalid podcast or episode ID'));
      return;
    }
    
    const data = await AzuraCastService.getPodcastEpisode(podcastId, episodeId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch podcast episode';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/podcast-art/:podcastId
 * Get podcast artwork
 */
router.get('/podcast-art/:podcastId', async (req: Request, res: Response) => {
  try {
    const podcastId = parseInt(req.params.podcastId, 10);
    if (isNaN(podcastId)) {
      res.status(400).json(error('Invalid podcast ID'));
      return;
    }
    const data = await AzuraCastService.getPodcastArt(podcastId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch podcast art';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/episode-art/:podcastId/:episodeId
 * Get episode artwork
 */
router.get('/episode-art/:podcastId/:episodeId', async (req: Request, res: Response) => {
  try {
    const podcastId = parseInt(req.params.podcastId, 10);
    const episodeId = parseInt(req.params.episodeId, 10);
    
    if (isNaN(podcastId) || isNaN(episodeId)) {
      res.status(400).json(error('Invalid podcast or episode ID'));
      return;
    }
    
    const data = await AzuraCastService.getEpisodeArt(podcastId, episodeId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch episode art';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/episode-media/:podcastId/:episodeId
 * Get episode media URL
 */
router.get('/episode-media/:podcastId/:episodeId', async (req: Request, res: Response) => {
  try {
    const podcastId = parseInt(req.params.podcastId, 10);
    const episodeId = parseInt(req.params.episodeId, 10);
    
    if (isNaN(podcastId) || isNaN(episodeId)) {
      res.status(400).json(error('Invalid podcast or episode ID'));
      return;
    }
    
    const data = await AzuraCastService.getEpisodeMedia(podcastId, episodeId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch episode media';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Schedule
// ============================================

/**
 * GET /api/station/schedule
 * Get station schedule
 */
router.get('/schedule', async (req: Request, res: Response) => {
  try {
    const day = parseInt(req.query.day as string) || new Date().getDay();
    const data = await AzuraCastService.getSchedule(day);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch schedule';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Streamers
// ============================================

/**
 * GET /api/station/streamers
 * Get list of streamers/DJs
 */
router.get('/streamers', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getStreamers();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch streamers';
    res.status(500).json(error(msg));
  }
});

/**
 * GET /api/station/streamer-art/:streamerId
 * Get streamer avatar
 */
router.get('/streamer-art/:streamerId', async (req: Request, res: Response) => {
  try {
    const streamerId = parseInt(req.params.streamerId, 10);
    if (isNaN(streamerId)) {
      res.status(400).json(error('Invalid streamer ID'));
      return;
    }
    const data = await AzuraCastService.getStreamerArt(streamerId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch streamer art';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Requests
// ============================================

/**
 * GET /api/station/requests
 * Get available song requests
 */
router.get('/requests', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getRequests();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch requests';
    res.status(500).json(error(msg));
  }
});

/**
 * POST /api/station/requests
 * Request a song (requires auth for song_id method)
 */
router.post('/requests', async (req: Request, res: Response) => {
  try {
    // Support both methods: song_id (legacy) and request_id
    const { songId, requestId } = req.body;
    
    if (requestId) {
      const data = await AzuraCastService.submitRequest(requestId);
      res.json(success(data));
      return;
    }
    
    if (songId) {
      // Legacy method - requires auth
      if (!req.userId) {
        res.status(401).json(error('Authentication required for song requests'));
        return;
      }
      const data = await AzuraCastService.requestSong(songId);
      res.json(success(data));
      return;
    }
    
    res.status(400).json(error('Missing songId or requestId'));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to submit request';
    res.status(500).json(error(msg));
  }
});

/**
 * POST /api/station/request/:requestId
 * Submit song request by ID
 */
router.post('/request/:requestId', async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId, 10);
    if (isNaN(requestId)) {
      res.status(400).json(error('Invalid request ID'));
      return;
    }
    const data = await AzuraCastService.submitRequest(requestId);
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to submit request';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Listeners
// ============================================

/**
 * GET /api/station/listeners
 * Get current listeners
 */
router.get('/listeners', async (_req: Request, res: Response) => {
  try {
    const data = await AzuraCastService.getListeners();
    res.json(success(data));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch listeners';
    res.status(500).json(error(msg));
  }
});

// ============================================
// Cache Management (Admin only in production)
// ============================================

/**
 * POST /api/station/cache/clear
 * Clear station cache
 */
router.post('/cache/clear', async (_req: Request, res: Response) => {
  try {
    AzuraCastService.clearStationCache();
    res.json(success({ message: 'Cache cleared successfully' }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to clear cache';
    res.status(500).json(error(msg));
  }
});

export default router;

/**
 * AzuraCast Service Tests
 * Basic tests verifying service structure and types
 */

import { describe, it, expect } from 'vitest';
import { AzuraCastService } from '@/services/azuracast';
import {
  mockAzuraNowPlayingResponse,
  mockAzuraStationInfoResponse,
  mockAzuraScheduleResponse,
  mockAzuraPodcastResponse,
  mockAzuraOnDemandResponse,
} from '../fixtures/azuracast.js';

describe('AzuraCastService', () => {
  describe('Service Methods Exist', () => {
    it('should have getSystemStatus method', () => {
      expect(typeof AzuraCastService.getSystemStatus).toBe('function');
    });

    it('should have getServerTime method', () => {
      expect(typeof AzuraCastService.getServerTime).toBe('function');
    });

    it('should have getGlobalNowPlaying method', () => {
      expect(typeof AzuraCastService.getGlobalNowPlaying).toBe('function');
    });

    it('should have getNowPlaying method', () => {
      expect(typeof AzuraCastService.getNowPlaying).toBe('function');
    });

    it('should have getNowPlayingArt method', () => {
      expect(typeof AzuraCastService.getNowPlayingArt).toBe('function');
    });

    it('should have getStations method', () => {
      expect(typeof AzuraCastService.getStations).toBe('function');
    });

    it('should have getStationInfo method', () => {
      expect(typeof AzuraCastService.getStationInfo).toBe('function');
    });

    it('should have getMediaArt method', () => {
      expect(typeof AzuraCastService.getMediaArt).toBe('function');
    });

    it('should have getHistory method', () => {
      expect(typeof AzuraCastService.getHistory).toBe('function');
    });

    it('should have getOnDemand method', () => {
      expect(typeof AzuraCastService.getOnDemand).toBe('function');
    });

    it('should have getOnDemandItem method', () => {
      expect(typeof AzuraCastService.getOnDemandItem).toBe('function');
    });

    it('should have getOnDemandDownload method', () => {
      expect(typeof AzuraCastService.getOnDemandDownload).toBe('function');
    });

    it('should have getPodcasts method', () => {
      expect(typeof AzuraCastService.getPodcasts).toBe('function');
    });

    it('should have getPodcast method', () => {
      expect(typeof AzuraCastService.getPodcast).toBe('function');
    });

    it('should have getPodcastEpisodes method', () => {
      expect(typeof AzuraCastService.getPodcastEpisodes).toBe('function');
    });

    it('should have getPodcastEpisode method', () => {
      expect(typeof AzuraCastService.getPodcastEpisode).toBe('function');
    });

    it('should have getPodcastArt method', () => {
      expect(typeof AzuraCastService.getPodcastArt).toBe('function');
    });

    it('should have getEpisodeArt method', () => {
      expect(typeof AzuraCastService.getEpisodeArt).toBe('function');
    });

    it('should have getEpisodeMedia method', () => {
      expect(typeof AzuraCastService.getEpisodeMedia).toBe('function');
    });

    it('should have getSchedule method', () => {
      expect(typeof AzuraCastService.getSchedule).toBe('function');
    });

    it('should have getStreamers method', () => {
      expect(typeof AzuraCastService.getStreamers).toBe('function');
    });

    it('should have getStreamerArt method', () => {
      expect(typeof AzuraCastService.getStreamerArt).toBe('function');
    });

    it('should have getRequests method', () => {
      expect(typeof AzuraCastService.getRequests).toBe('function');
    });

    it('should have submitRequest method', () => {
      expect(typeof AzuraCastService.submitRequest).toBe('function');
    });

    it('should have requestSong method', () => {
      expect(typeof AzuraCastService.requestSong).toBe('function');
    });

    it('should have getListeners method', () => {
      expect(typeof AzuraCastService.getListeners).toBe('function');
    });

    it('should have clearCache method', () => {
      expect(typeof AzuraCastService.clearCache).toBe('function');
    });

    it('should have clearStationCache method', () => {
      expect(typeof AzuraCastService.clearStationCache).toBe('function');
    });
  });

  describe('Type Definitions', () => {
    it('should have valid NowPlayingResponse', () => {
      expect(mockAzuraNowPlayingResponse.station).toBeDefined();
      expect(mockAzuraNowPlayingResponse.now_playing).toBeDefined();
      expect(mockAzuraNowPlayingResponse.listeners).toBeDefined();
    });

    it('should have valid StationInfoResponse', () => {
      expect(mockAzuraStationInfoResponse.station).toBeDefined();
      expect(mockAzuraStationInfoResponse.listeners).toBeDefined();
    });

    it('should have valid ScheduleResponse', () => {
      expect(mockAzuraScheduleResponse.schedule).toBeDefined();
      expect(Array.isArray(mockAzuraScheduleResponse.schedule)).toBe(true);
    });

    it('should have valid PodcastResponse', () => {
      expect(mockAzuraPodcastResponse.podcasts).toBeDefined();
      expect(Array.isArray(mockAzuraPodcastResponse.podcasts)).toBe(true);
    });

    it('should have valid OnDemandResponse', () => {
      expect(mockAzuraOnDemandResponse.ondemand).toBeDefined();
      expect(Array.isArray(mockAzuraOnDemandResponse.ondemand)).toBe(true);
    });
  });
});

describe('AzuraCast API Endpoints', () => {
  it('should have 24 endpoint methods defined', () => {
    // Count of public methods in AzuraCastService
    const serviceMethods = Object.getOwnPropertyNames(AzuraCastService).filter(
      (prop) => typeof (AzuraCastService as unknown as Record<string, unknown>)[prop] === 'function'
    );
    
    // Should have all the methods we implemented
    expect(serviceMethods.length).toBeGreaterThanOrEqual(24);
  });
});

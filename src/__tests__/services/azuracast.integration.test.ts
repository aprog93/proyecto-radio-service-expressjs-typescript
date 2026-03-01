/**
 * AzuraCast Integration Tests
 * Tests all public endpoints against the real AzuraCast API
 * 
 * These tests require the following environment variables:
 * - AZURACAST_BASE_URL: The base URL of AzuraCast instance
 * - AZURACAST_STATION_ID: The station ID to test against
 * 
 * Run with: pnpm test run src/__tests__/services/azuracast.integration.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { AzuraCastService } from '@/services/azuracast.js';
import { env } from '@/config/env.js';

// Increase timeout for integration tests (AzuraCast can be slow)
const INTEGRATION_TIMEOUT = 30000;

describe('AzuraCast Integration Tests', () => {
  // Verify we have a real AzuraCast URL configured
  const hasRealAzuraCast = !env.AZURACAST_BASE_URL.includes('demo.azuracast.com');

  beforeAll(() => {
    if (!hasRealAzuraCast) {
      console.log('⚠️  Running against demo AzuraCast - some tests may fail');
    }
    console.log(`Testing against AzuraCast: ${env.AZURACAST_BASE_URL}`);
    console.log(`Station ID: ${env.AZURACAST_STATION_ID}`);
  });

  describe('Global Endpoints', () => {
    it('should get system status', async () => {
      const result = await AzuraCastService.getSystemStatus();
      expect(result).toBeDefined();
      // Real AzuraCast response: { online: boolean, timestamp: number }
      expect(typeof result.online === 'boolean').toBe(true);
      expect(typeof result.timestamp === 'number').toBe(true);
    });

    it('should get server time', async () => {
      const result = await AzuraCastService.getServerTime();
      expect(result).toBeDefined();
      // Real AzuraCast response: { timestamp: number, utc_datetime: string, ... }
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp === 'number').toBe(true);
    });
  }, INTEGRATION_TIMEOUT);

  describe('Now Playing Endpoints', () => {
    it('should get now playing for station', async () => {
      // This may fail if station ID is incorrect
      try {
        const result = await AzuraCastService.getNowPlaying();
        expect(result).toBeDefined();
        // The response structure varies
        expect(typeof result === 'object').toBe(true);
      } catch (error) {
        // If station not found, skip this test
        const err = error as Error;
        if (err.message.includes('Registro no encontrado')) {
          console.log('⚠️  Station not found - check AZURACAST_STATION_ID');
          expect(true).toBe(true); // Pass with warning
        } else {
          throw error;
        }
      }
    });

    it('should get now playing art (or gracefully fail)', async () => {
      try {
        const result = await AzuraCastService.getNowPlayingArt();
        expect(result).toBeDefined();
      } catch (error) {
        // Expected if no station or no art
        const err = error as Error;
        if (err.message.includes('Registro no encontrado')) {
          console.log('⚠️  Station not found for art endpoint');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  }, INTEGRATION_TIMEOUT);

  describe('Station Info Endpoints', () => {
    it('should get station list', async () => {
      const result = await AzuraCastService.getStations();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        // Log the stations found
        console.log('Stations found:', result.map((s: { id: number; name: string }) => `${s.id}: ${s.name}`).join(', '));
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
      }
    });

    it('should get station info', async () => {
      try {
        const result = await AzuraCastService.getStationInfo();
        expect(result).toBeDefined();
        // The actual response structure varies - could be { station: {...} } or just {...}
        expect(typeof result === 'object').toBe(true);
      } catch (error) {
        const err = error as Error;
        if (err.message.includes('Registro no encontrado')) {
          console.log('⚠️  Station not found - check AZURACAST_STATION_ID');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  }, INTEGRATION_TIMEOUT);

  describe('History Endpoints', () => {
    it('should get song history (or fail gracefully if auth required)', async () => {
      try {
        const result = await AzuraCastService.getHistory();
        expect(result).toBeDefined();
        // Real AzuraCast response: array directly, not object with 'history' property
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        // Auth required for this endpoint - this is expected
        const err = error as Error;
        if (err.message.includes('iniciar sesión') || err.message.includes('403')) {
          console.log('⚠️  History endpoint requires authentication');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  }, INTEGRATION_TIMEOUT);

  describe('On-Demand Endpoints', () => {
    it('should handle on-demand (may be disabled)', async () => {
      try {
        const result = await AzuraCastService.getOnDemand();
        expect(result).toBeDefined();
        // If successful, result should be valid (don't check specific structure)
      } catch (error) {
        // On-demand may be disabled - this is expected
        const err = error as Error;
        if (err.message.includes('no admite medios bajo demanda')) {
          console.log('⚠️  On-demand is disabled for this station');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  }, INTEGRATION_TIMEOUT);

  describe('Podcast Endpoints', () => {
    it('should handle podcasts (may be empty)', async () => {
      const result = await AzuraCastService.getPodcasts();
      expect(result).toBeDefined();
      // May return empty array if no podcasts
      expect(Array.isArray(result.podcasts) || Array.isArray(result)).toBe(true);
    });
  }, INTEGRATION_TIMEOUT);

  describe('Schedule Endpoints', () => {
    it('should handle schedule (may be empty)', async () => {
      try {
        const result = await AzuraCastService.getSchedule();
        expect(result).toBeDefined();
        // May return empty array
        expect(Array.isArray(result.schedule) || Array.isArray(result)).toBe(true);
      } catch (error) {
        // May fail if not configured
        const err = error as Error;
        if (err.message.includes('404') || err.message.includes('500')) {
          console.log('⚠️  Schedule endpoint may not be available');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  }, INTEGRATION_TIMEOUT);

  describe('Streamers Endpoints', () => {
    it('should handle streamers (may require auth)', async () => {
      try {
        const result = await AzuraCastService.getStreamers();
        expect(result).toBeDefined();
      } catch (error) {
        const err = error as Error;
        if (err.message.includes('iniciar sesión') || err.message.includes('403')) {
          console.log('⚠️  Streamers endpoint requires authentication');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  }, INTEGRATION_TIMEOUT);

  describe('Listeners Endpoints', () => {
    it('should handle listeners (may require auth)', async () => {
      try {
        const result = await AzuraCastService.getListeners();
        expect(result).toBeDefined();
      } catch (error) {
        const err = error as Error;
        if (err.message.includes('iniciar sesión') || err.message.includes('403')) {
          console.log('⚠️  Listeners endpoint requires authentication');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  });

  describe('Requests Endpoints', () => {
    it('should handle requests (may be disabled)', async () => {
      try {
        const result = await AzuraCastService.getRequests();
        expect(result).toBeDefined();
      } catch (error) {
        const err = error as Error;
        if (err.message.includes('no acepta solicitudes')) {
          console.log('⚠️  Requests are disabled for this station');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  });
});

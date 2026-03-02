import { AdminService } from './src/services/admin.js';

async function test() {
  try {
    console.log('🧪 Testing getLiveStats()...\n');
    const adminService = new AdminService();
    const liveStats = await adminService.getLiveStats();
    
    console.log('✅ Estadísticas obtenidas:');
    console.log('\n📊 Base de Datos:');
    console.log('  - Usuarios:', liveStats.totalUsers);
    console.log('  - Usuarios activos:', liveStats.activeUsers);
    console.log('  - Admins:', liveStats.admins);
    console.log('  - Donaciones:', `$${liveStats.totalDonations.amount}`);
    
    console.log('\n📻 AzuraCast:');
    console.log('  - Estación:', liveStats.azuracast.station.name);
    console.log('  - Estado:', liveStats.azuracast.isOnline ? '🟢 En línea' : '🔴 Fuera de línea');
    console.log('  - Oyentes actuales:', liveStats.azuracast.currentListeners);
    console.log('  - Bitrate:', liveStats.azuracast.station.bitrate, 'kbps');
    
    if (liveStats.azuracast.nowPlaying) {
      console.log('\n🎵 Ahora reproduciendo:');
      console.log('  - Artista:', liveStats.azuracast.nowPlaying.artist);
      console.log('  - Canción:', liveStats.azuracast.nowPlaying.title);
    }
    
  } catch (err) {
    console.error('❌ Error:', err instanceof Error ? err.message : err);
  }
  process.exit(0);
}

test();

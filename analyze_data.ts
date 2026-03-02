import { prisma } from './src/config/prisma.js';

async function analyzeDatabase() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        ANÁLISIS DE DATOS - RADIO CESAR DATABASE            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Users Analysis
    console.log('📊 USUARIOS\n' + '─'.repeat(60));
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`Total: ${users.length}\n`);
    users.forEach((u, idx) => {
      const createdDate = new Date(u.createdAt).toLocaleString('es-CO');
      console.log(`${idx + 1}. ${u.displayName} (${u.email})`);
      console.log(`   Role: ${u.role} | Activo: ${u.isActive} | Creado: ${createdDate}\n`);
    });

    // Events Analysis
    console.log('\n📅 EVENTOS\n' + '─'.repeat(60));
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`Total: ${events.length} | Publicados: ${events.filter(e => e.published).length}\n`);
    events.forEach((e, idx) => {
      const status = e.published ? '✓ Publicado' : '✗ Borrador';
      console.log(`${idx + 1}. ${e.title} - ${status}`);
    });

    // News Analysis
    console.log('\n📰 NOTICIAS\n' + '─'.repeat(60));
    const news = await prisma.news.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`Total: ${news.length} | Publicadas: ${news.filter(n => n.published).length}\n`);
    news.forEach((n, idx) => {
      const status = n.published ? '✓ Publicada' : '✗ Borrador';
      console.log(`${idx + 1}. ${n.title} - ${status}`);
    });

    // Products Analysis
    console.log('\n🛍️  PRODUCTOS\n' + '─'.repeat(60));
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        published: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`Total: ${products.length} | Publicados: ${products.filter(p => p.published).length}\n`);
    products.forEach((p, idx) => {
      const status = p.published ? '✓ Disponible' : '✗ Oculto';
      console.log(`${idx + 1}. ${p.name} - $${p.price} | Stock: ${p.stock} - ${status}`);
    });

    // Donations Analysis
    console.log('\n💝 DONACIONES\n' + '─'.repeat(60));
    const donations = await prisma.donation.findMany({
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (donations.length > 0) {
      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
      console.log(`Total: ${donations.length} | Monto total: $${totalAmount.toFixed(2)}\n`);
      donations.forEach((d, idx) => {
        const date = new Date(d.createdAt).toLocaleString('es-CO');
        console.log(`${idx + 1}. $${d.amount.toFixed(2)} - ${date}`);
      });
    } else {
      console.log('No hay donaciones registradas\n');
    }

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMEN DEL SISTEMA                     ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║ Usuarios:                    ${String(users.length).padEnd(42)} ║`);
    console.log(`║ Eventos:                     ${String(events.length).padEnd(42)} ║`);
    console.log(`║ Noticias:                    ${String(news.length).padEnd(42)} ║`);
    console.log(`║ Productos:                   ${String(products.length).padEnd(42)} ║`);
    console.log(`║ Donaciones:                  ${String(donations.length).padEnd(42)} ║`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeDatabase();

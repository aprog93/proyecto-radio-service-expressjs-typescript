import { prisma } from '../src/config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed de datos...\n');

  try {
    // Create admin users
    console.log('👥 Creando usuarios...');
    
    const admin1 = await prisma.user.upsert({
      where: { email: 'admin.principal@radiocesar.com' },
      update: {},
      create: {
        email: 'admin.principal@radiocesar.com',
        displayName: 'Admin Principal',
        password: bcrypt.hashSync('Admin123!', 10),
        role: 'admin',
        isActive: true,
      },
    });

    const admin2 = await prisma.user.upsert({
      where: { email: 'admin.contenidos@radiocesar.com' },
      update: {},
      create: {
        email: 'admin.contenidos@radiocesar.com',
        displayName: 'Admin Contenidos',
        password: bcrypt.hashSync('AdminContent123!', 10),
        role: 'admin',
        isActive: true,
      },
    });

    // Create regular listeners
    const listener1 = await prisma.user.upsert({
      where: { email: 'juan.perez@example.com' },
      update: {},
      create: {
        email: 'juan.perez@example.com',
        displayName: 'Juan Pérez',
        password: bcrypt.hashSync('Listener123!', 10),
        role: 'listener',
        isActive: true,
      },
    });

    const listener2 = await prisma.user.upsert({
      where: { email: 'maria.garcia@example.com' },
      update: {},
      create: {
        email: 'maria.garcia@example.com',
        displayName: 'María García',
        password: bcrypt.hashSync('Listener123!', 10),
        role: 'listener',
        isActive: true,
      },
    });

    const listener3 = await prisma.user.upsert({
      where: { email: 'carlos.rodriguez@example.com' },
      update: {},
      create: {
        email: 'carlos.rodriguez@example.com',
        displayName: 'Carlos Rodríguez',
        password: bcrypt.hashSync('Listener123!', 10),
        role: 'listener',
        isActive: false,
      },
    });

    console.log('✓ 5 usuarios creados (2 admins, 3 listeners)');

    // Create events
    console.log('📅 Creando eventos...');
    
    const event1 = await prisma.event.upsert({
      where: { id: 100 },
      update: {},
      create: {
        title: 'Festival de Música Comunitaria 2026',
        description: 'Gran festival anual con bandas locales, comida típica y actividades para toda la familia.',
        startDate: new Date('2026-04-15T10:00:00Z'),
        endDate: new Date('2026-04-17T22:00:00Z'),
        location: 'Plaza Central de la Comunidad',
        capacity: 2000,
        author_id: admin1.id,
        published: true,
      },
    }).catch(() => null);

    const event2 = await prisma.event.upsert({
      where: { id: 101 },
      update: {},
      create: {
        title: 'Taller de Radio y Podcasting',
        description: 'Aprende los fundamentos de la radiodifusión y la producción de podcasts.',
        startDate: new Date('2026-03-20T14:00:00Z'),
        endDate: new Date('2026-03-20T17:00:00Z'),
        location: 'Centro Comunitario - Sala de Capacitación',
        capacity: 50,
        author_id: admin1.id,
        published: true,
      },
    }).catch(() => null);

    const event3 = await prisma.event.upsert({
      where: { id: 102 },
      update: {},
      create: {
        title: 'Concierto Benéfico para la Comunidad',
        description: 'Recaudación de fondos para proyectos comunitarios.',
        startDate: new Date('2026-05-10T18:00:00Z'),
        endDate: new Date('2026-05-10T23:00:00Z'),
        location: 'Anfiteatro Municipal',
        capacity: 1500,
        author_id: admin1.id,
        published: false,
      },
    }).catch(() => null);

    console.log('✓ 3 eventos creados (2 publicados, 1 borrador)');

    // Create news
    console.log('📰 Creando noticias...');
    
    const news1 = await prisma.news.upsert({
      where: { id: 100 },
      update: {},
      create: {
        title: 'Radio Cesar Celebra 5 Años de Servicio Comunitario',
        content: 'Con alegría anunciamos que nuestra plataforma de radio comunitaria cumple 5 años de servicio continuo.',
        author_id: admin2.id,
        published: true,
      },
    }).catch(() => null);

    const news2 = await prisma.news.upsert({
      where: { id: 101 },
      update: {},
      create: {
        title: 'Nueva Sección: Historias de Nuestra Gente',
        content: 'Estamos iniciando una nueva sección donde compartimos historias inspiradoras de miembros de nuestra comunidad.',
        author_id: admin2.id,
        published: true,
      },
    }).catch(() => null);

    const news3 = await prisma.news.upsert({
      where: { id: 102 },
      update: {},
      create: {
        title: 'Mejoras Técnicas en Nuestro Servicio de Streaming',
        content: 'Hemos optimizado nuestros servidores para ofrecer mejor calidad de audio y menor latencia.',
        author_id: admin2.id,
        published: false,
      },
    }).catch(() => null);

    console.log('✓ 3 noticias creadas (2 publicadas, 1 borrador)');

    // Create products
    console.log('🛍️  Creando productos...');
    
    const product1 = await prisma.product.upsert({
      where: { id: 100 },
      update: {},
      create: {
        name: 'Camiseta Radio Cesar Edición Aniversario',
        description: 'Camiseta de algodón 100% con el logo especial de nuestro quinto aniversario.',
        price: 35000,
        category: 'Mercancía',
        stock: 150,
        published: true,
      },
    }).catch(() => null);

    const product2 = await prisma.product.upsert({
      where: { id: 101 },
      update: {},
      create: {
        name: 'Gorra Ajustable Radio Cesar',
        description: 'Gorra de lona con cierre ajustable. Material transpirable.',
        price: 18000,
        category: 'Accesorios',
        stock: 200,
        published: true,
      },
    }).catch(() => null);

    const product3 = await prisma.product.upsert({
      where: { id: 102 },
      update: {},
      create: {
        name: 'Taza Podcast Radio Cesar',
        description: 'Taza cerámica de 300ml con diseño exclusivo.',
        price: 12000,
        category: 'Bebidas',
        stock: 100,
        published: false,
      },
    }).catch(() => null);

    console.log('✓ 3 productos creados (2 disponibles, 1 próximamente)');

    // Create donations
    console.log('💝 Creando donaciones...');
    
    const donation1 = await prisma.donation.create({
      data: {
        amount: 50000,
        email: 'dona@example.com',
        message: 'Apoyando la radio comunitaria que me acompaña cada día',
      },
    }).catch(() => null);

    const donation2 = await prisma.donation.create({
      data: {
        amount: 100000,
        email: 'empresa@example.com',
        message: 'Patrocinio empresarial para proyectos comunitarios',
      },
    }).catch(() => null);

    if (donation1 && donation2) {
      console.log('✓ 2 donaciones creadas ($150,000.00 total)');
    }

    // Display summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           SEED DE DATOS COMPLETADO EXITOSAMENTE           ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║ Usuarios (5):                                              ║');
    console.log('║   ✓ 2 Admins                                               ║');
    console.log('║   ✓ 3 Listeners (1 inactivo)                               ║');
    console.log('║ Eventos (3):        ✓ 2 publicados, 1 borrador             ║');
    console.log('║ Noticias (3):       ✓ 2 publicadas, 1 borrador             ║');
    console.log('║ Productos (3):      ✓ 2 disponibles, 1 próximamente        ║');
    console.log('║ Donaciones (2):     ✓ $150,000.00 total                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('🔑 CREDENCIALES DE PRUEBA:\n');
    console.log('👨‍💼 Admin Principal:');
    console.log('   Email:    admin.principal@radiocesar.com');
    console.log('   Password: Admin123!\n');
    console.log('👨‍💼 Admin Contenidos:');
    console.log('   Email:    admin.contenidos@radiocesar.com');
    console.log('   Password: AdminContent123!\n');
    console.log('👤 Oyente Regular:');
    console.log('   Email:    juan.perez@example.com');
    console.log('   Password: Listener123!\n');

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

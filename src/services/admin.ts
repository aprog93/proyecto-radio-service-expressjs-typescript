import { prisma } from '../config/prisma.js';
import { User, UserRole } from '../types/database.js';
import { Prisma } from '../generated/prisma/index.js';

/**
 * Interfaz para estadísticas del sistema
 */
export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  admins: number;
  listeners: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalNews: number;
  publishedNews: number;
  totalEvents: number;
  publishedEvents: number;
  totalProducts: number;
  publishedProducts: number;
  totalDonations: {
    count: number;
    amount: number;
  };
}

/**
 * Servicio de administración y estadísticas
 */
export class AdminService {
  /**
   * Obtiene lista de usuarios con búsqueda y paginación
   */
  async listUsers(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          avatar: true,
          createdAt: true,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    // Map Prisma user to our User type (select only includes needed fields)
    const formattedUsers: User[] = users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      role: u.role as UserRole,
      avatar: u.avatar || undefined,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.createdAt.toISOString(),
      isActive: u.isActive,
    }));

    return {
      users: formattedUsers,
      total,
    };
  }

  /**
   * Obtiene estadísticas globales del sistema
   */
  async getStats(): Promise<SystemStats> {
    const [
      totalUsers,
      activeUsers,
      admins,
      listeners,
      totalBlogs,
      publishedBlogs,
      totalNews,
      publishedNews,
      totalEvents,
      publishedEvents,
      totalProducts,
      publishedProducts,
      totalDonations,
      donationsAmount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'listener' } }),
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.news.count(),
      prisma.news.count({ where: { published: true } }),
      prisma.event.count(),
      prisma.event.count({ where: { published: true } }),
      prisma.product.count(),
      prisma.product.count({ where: { published: true } }),
      prisma.donation.count(),
      this._getDonationsAmount(),
    ]);

    return {
      totalUsers,
      activeUsers,
      admins,
      listeners,
      totalBlogs,
      publishedBlogs,
      totalNews,
      publishedNews,
      totalEvents,
      publishedEvents,
      totalProducts,
      publishedProducts,
      totalDonations: {
        count: totalDonations,
        amount: donationsAmount,
      },
    };
  }

  /**
   * Obtiene monto total de donaciones
   */
  private async _getDonationsAmount(): Promise<number> {
    const result = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
    });
    return result._sum?.amount || 0;
  }
}

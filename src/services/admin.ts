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
    try {
      console.log('[AdminService] listUsers called with:', { page, limit, search });
      
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

      console.log('[AdminService] Retrieved users:', { count: users.length, total });

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
    } catch (err) {
      console.error('[AdminService] Error in listUsers():', err);
      throw err;
    }
  }

  /**
   * Obtiene estadísticas globales del sistema
   */
  async getStats(): Promise<SystemStats> {
    try {
      console.log('[AdminService] Starting getStats()');
      
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

      console.log('[AdminService] Counts retrieved successfully:', {
        totalUsers,
        activeUsers,
        admins,
        totalBlogs,
      });

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
    } catch (err) {
      console.error('[AdminService] Error in getStats():', err);
      throw err;
    }
  }

  /**
   * Obtiene monto total de donaciones
   * Retorna 0 si hay error (tabla podría no existir o estar vacía)
   */
  private async _getDonationsAmount(): Promise<number> {
    try {
      const result = await prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
      });
      return result._sum?.amount || 0;
    } catch (err) {
      console.error('[AdminService] Error in _getDonationsAmount():', err);
      // Return 0 if table doesn't exist or other error occurs
      return 0;
    }
  }
}

import { prisma } from '../config/prisma.js';
import { UserProfile, UpdateProfileRequest } from '../types/database.js';

/**
 * Tipo interno para datos crudos de UserProfile desde Prisma
 */
type PrismaUserProfile = {
  id: number;
  userId: number;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  socialMedia: string | null;
  preferences: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Tipo para datos de actualización de perfil
 */
type UserProfileUpdateData = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
};

/**
 * Servicio de gestión de perfiles de usuario
 */
export class UserProfileService {
  /**
   * Obtiene el perfil de un usuario por ID
   */
  async getProfileByUserId(userId: number): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile ? this._formatProfile(profile) : null;
  }

  /**
   * Crea un perfil de usuario (llamado al registrarse)
   */
  async createProfile(userId: number): Promise<UserProfile> {
    const profile = await prisma.userProfile.create({
      data: {
        userId,
      },
    });
    return this._formatProfile(profile);
  }

  /**
   * Actualiza el perfil del usuario
   */
  async updateProfile(userId: number, data: Partial<UpdateProfileRequest>): Promise<UserProfile> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Perfil no encontrado');
    }

    const updateData: UserProfileUpdateData = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.postalCode !== undefined) updateData.postalCode = data.postalCode;

    const updated = await prisma.userProfile.update({
      where: { userId },
      data: updateData,
    });

    return this._formatProfile(updated);
  }

  /**
   * Formatea un perfil para retornar
   */
  private _formatProfile(profile: PrismaUserProfile): UserProfile {
    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName || undefined,
      lastName: profile.lastName || undefined,
      phone: profile.phone || undefined,
      address: profile.address || undefined,
      city: profile.city || undefined,
      country: profile.country || undefined,
      postalCode: profile.postalCode || undefined,
      socialMedia: profile.socialMedia || undefined,
      preferences: profile.preferences || undefined,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}

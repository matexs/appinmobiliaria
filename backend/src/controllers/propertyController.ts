import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as propertyService from '../services/propertyService';

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { page, limit, sort_by, sort_order, ...filters } = req.query as Record<string, string>;
    const isAdmin = req.user?.role === 'admin';

    const result = await propertyService.getProperties({
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '12', 10),
      sort_by: sort_by || 'created_at',
      sort_order: sort_order || 'desc',
      search: filters.search,
      city: filters.city,
      province: filters.province,
      property_type_id: filters.property_type_id ? parseInt(filters.property_type_id, 10) : undefined,
      min_price: filters.min_price ? parseFloat(filters.min_price) : undefined,
      max_price: filters.max_price ? parseFloat(filters.max_price) : undefined,
      min_sqm: filters.min_sqm ? parseFloat(filters.min_sqm) : undefined,
      max_sqm: filters.max_sqm ? parseFloat(filters.max_sqm) : undefined,
      bedrooms: filters.bedrooms ? parseInt(filters.bedrooms, 10) : undefined,
      bathrooms: filters.bathrooms ? parseInt(filters.bathrooms, 10) : undefined,
      status: filters.status,
    }, isAdmin);

    res.json({
      success: true,
      data: result.data,
      total: result.total,
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '12', 10),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const data = await propertyService.getPropertyById(id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Propiedad no encontrada' });
  }
}

export async function getFeatured(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const data = await propertyService.getFeaturedProperties();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getRecent(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const data = await propertyService.getRecentProperties();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function create(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const data = await propertyService.createProperty(req.body, req.user!.id);
    res.status(201).json({ success: true, data, message: 'Propiedad creada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function update(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const data = await propertyService.updateProperty(id, req.body);
    res.json({ success: true, data, message: 'Propiedad actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function changeStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const data = await propertyService.updateProperty(id, { status });
    res.json({ success: true, data, message: `Estado cambiado a "${status}"` });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function toggleFeatured(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { is_featured } = req.body;
    const data = await propertyService.updateProperty(id, { is_featured });
    res.json({ success: true, data, message: is_featured ? 'Propiedad destacada' : 'Propiedad quitada de destacadas' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function remove(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    await propertyService.deleteProperty(id);
    res.json({ success: true, message: 'Propiedad eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getTypes(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const data = await propertyService.getPropertyTypes();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

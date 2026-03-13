import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { uploadImage, deleteImage } from '../services/storageService';
import { supabaseAdmin } from '../config/supabase';

const MAX_IMAGES_PER_PROPERTY = 20;

export async function upload(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const propertyId = req.params.id as string;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, error: 'No se enviaron archivos' });
      return;
    }

    // Verificar límite de imágenes
    const { count } = await supabaseAdmin
      .from('property_images')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    const currentCount = count || 0;
    if (currentCount + files.length > MAX_IMAGES_PER_PROPERTY) {
      res.status(400).json({
        success: false,
        error: `Máximo ${MAX_IMAGES_PER_PROPERTY} imágenes por propiedad. Actualmente tiene ${currentCount}.`,
      });
      return;
    }

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { imageUrl, storagePath } = await uploadImage(file, propertyId);

      const { data, error } = await supabaseAdmin
        .from('property_images')
        .insert({
          property_id: propertyId,
          image_url: imageUrl,
          storage_path: storagePath,
          is_cover: currentCount === 0 && i === 0, // Primera imagen es portada por defecto
          display_order: currentCount + i,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      uploadedImages.push(data);
    }

    res.status(201).json({ success: true, data: uploadedImages, message: 'Imágenes subidas exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function remove(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const imageId = req.params.id as string;

    // Obtener la imagen para borrar del storage
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('property_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      res.status(404).json({ success: false, error: 'Imagen no encontrada' });
      return;
    }

    await deleteImage(image.storage_path);

    const { error: deleteError } = await supabaseAdmin
      .from('property_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) throw new Error(deleteError.message);

    // Si era la portada, asignar la siguiente como portada
    if (image.is_cover) {
      const { data: nextImage } = await supabaseAdmin
        .from('property_images')
        .select('id')
        .eq('property_id', image.property_id)
        .order('display_order')
        .limit(1)
        .single();

      if (nextImage) {
        await supabaseAdmin
          .from('property_images')
          .update({ is_cover: true })
          .eq('id', nextImage.id);
      }
    }

    res.json({ success: true, message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function setCover(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const imageId = req.params.id as string;

    // Obtener la imagen para saber a qué propiedad pertenece
    const { data: image } = await supabaseAdmin
      .from('property_images')
      .select('property_id')
      .eq('id', imageId)
      .single();

    if (!image) {
      res.status(404).json({ success: false, error: 'Imagen no encontrada' });
      return;
    }

    // Quitar portada de todas las imágenes de esa propiedad
    await supabaseAdmin
      .from('property_images')
      .update({ is_cover: false })
      .eq('property_id', image.property_id);

    // Asignar como portada
    await supabaseAdmin
      .from('property_images')
      .update({ is_cover: true })
      .eq('id', imageId);

    res.json({ success: true, message: 'Imagen de portada actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

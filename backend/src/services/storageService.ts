import { supabaseAdmin } from '../config/supabase';

const BUCKET_NAME = 'property-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadImage(
  file: Express.Multer.File,
  propertyId: string
): Promise<{ imageUrl: string; storagePath: string }> {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new Error('Tipo de archivo no permitido. Solo JPEG, PNG o WebP.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('El archivo excede el tamaño máximo de 5MB.');
  }

  const ext = file.originalname.split('.').pop() || 'jpg';
  const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return {
    imageUrl: urlData.publicUrl,
    storagePath: fileName,
  };
}

export async function deleteImage(storagePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Error eliminando imagen: ${error.message}`);
  }
}

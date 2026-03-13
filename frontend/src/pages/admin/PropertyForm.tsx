import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProperty, updateProperty, getPropertyById,
  getPropertyTypes, uploadPropertyImages, deletePropertyImage, setPropertyImageCover
} from '../../services/propertyService';
import { LoadingScreen } from '../../components/common/Common';
import type { PropertyType, PropertyImage } from '../../types';
import toast from 'react-hot-toast';
import { HiUpload, HiTrash, HiStar, HiArrowLeft } from 'react-icons/hi';

export default function PropertyForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [types, setTypes] = useState<PropertyType[]>([]);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    title: string; description: string; price: number; address: string;
    city: string; province: string; latitude: string | number; longitude: string | number;
    square_meters: number; bedrooms: number; bathrooms: number;
    property_type_id: number; status: 'activa' | 'pausada' | 'vendida'; is_featured: boolean;
  }>({
    title: '', description: '', price: 0, address: '', city: '', province: '',
    latitude: '', longitude: '',
    square_meters: 0, bedrooms: 0, bathrooms: 0,
    property_type_id: 1, status: 'activa', is_featured: false,
  });

  useEffect(() => {
    getPropertyTypes().then((res) => setTypes(res.data || []));

    if (isEditing && id) {
      getPropertyById(id).then((res) => {
        if (res.data) {
          const p = res.data;
          setForm({
            title: p.title, description: p.description, price: p.price,
            address: p.address, city: p.city, province: p.province,
            latitude: p.latitude ?? '', longitude: p.longitude ?? '',
            square_meters: p.square_meters, bedrooms: p.bedrooms, bathrooms: p.bathrooms,
            property_type_id: p.property_type_id, status: p.status, is_featured: p.is_featured,
          });
          setExistingImages(p.property_images || []);
        }
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        ...form,
        price: Number(form.price),
        square_meters: Number(form.square_meters),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };

      let propertyId = id;
      if (isEditing && id) {
        await updateProperty(id, data);
      } else {
        const res = await createProperty(data);
        propertyId = res.data?.id;
      }

      // Upload new images
      if (propertyId && newFiles.length > 0) {
        await uploadPropertyImages(propertyId, newFiles);
      }

      toast.success(isEditing ? 'Propiedad actualizada' : 'Propiedad creada');
      navigate('/admin/propiedades');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deletePropertyImage(imageId);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      toast.success('Imagen eliminada');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      await setPropertyImageCover(imageId);
      setExistingImages(existingImages.map((img) => ({
        ...img, is_cover: img.id === imageId,
      })));
      toast.success('Portada actualizada');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (loading) return <LoadingScreen />;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)',
    display: 'block', marginBottom: '6px',
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/propiedades')} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'none', border: 'none', color: 'var(--color-text-secondary)',
        fontSize: '14px', marginBottom: '20px', padding: 0,
      }}>
        <HiArrowLeft /> Volver
      </button>

      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
        {isEditing ? 'Editar propiedad' : 'Nueva propiedad'}
      </h1>

      <form onSubmit={handleSubmit} style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        padding: '28px', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px', marginBottom: '20px',
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Título *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle} required placeholder="Ej: Casa con jardín en Palermo" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Descripción *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }} rows={4} required placeholder="Describí la propiedad en detalle..." />
          </div>
          <div>
            <label style={labelStyle}>Precio (ARS) *</label>
            <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              style={inputStyle} required min={0} />
          </div>
          <div>
            <label style={labelStyle}>Tipo de propiedad *</label>
            <select value={form.property_type_id} onChange={(e) => setForm({ ...form, property_type_id: Number(e.target.value) })}
              style={inputStyle}>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'activa' | 'pausada' | 'vendida' })}
              style={inputStyle}>
              <option value="activa">Activa</option>
              <option value="pausada">Pausada</option>
              <option value="vendida">Vendida</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Dirección *</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Ciudad *</label>
            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Provincia *</label>
            <input type="text" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}
              style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>m² *</label>
            <input type="number" value={form.square_meters || ''} onChange={(e) => setForm({ ...form, square_meters: Number(e.target.value) })}
              style={inputStyle} required min={0} />
          </div>
          <div>
            <label style={labelStyle}>Habitaciones</label>
            <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
              style={inputStyle} min={0} />
          </div>
          <div>
            <label style={labelStyle}>Baños</label>
            <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
              style={inputStyle} min={0} />
          </div>
          <div>
            <label style={labelStyle}>Latitud (para mapa)</label>
            <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              style={inputStyle} placeholder="-34.6037" />
          </div>
          <div>
            <label style={labelStyle}>Longitud (para mapa)</label>
            <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              style={inputStyle} placeholder="-58.3816" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              id="featured" />
            <label htmlFor="featured" style={{ fontSize: '14px', fontWeight: 500 }}>⭐ Propiedad destacada</label>
          </div>
        </div>

        {/* Images */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginBottom: '20px' }}>
          <label style={labelStyle}>Imágenes (máx. 20)</label>

          {existingImages.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {existingImages.map((img) => (
                <div key={img.id} style={{ position: 'relative', width: '100px', height: '80px' }}>
                  <img src={img.image_url} alt="" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: img.is_cover ? '3px solid var(--color-accent)' : '1px solid var(--color-border)',
                  }} />
                  <div style={{
                    position: 'absolute', top: '2px', right: '2px',
                    display: 'flex', gap: '2px',
                  }}>
                    <button type="button" onClick={() => handleSetCover(img.id)} title="Portada"
                      style={{ width: '22px', height: '22px', borderRadius: '4px', border: 'none', background: img.is_cover ? 'var(--color-accent)' : 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HiStar />
                    </button>
                    <button type="button" onClick={() => handleDeleteImage(img.id)} title="Eliminar"
                      style={{ width: '22px', height: '22px', borderRadius: '4px', border: 'none', background: 'rgba(239,68,68,0.8)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HiTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '20px', border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            color: 'var(--color-text-secondary)', fontSize: '14px',
            transition: 'all var(--transition)',
          }}>
            <HiUpload /> Subir imágenes ({newFiles.length} seleccionadas)
            <input type="file" accept="image/*" multiple
              onChange={(e) => setNewFiles(Array.from(e.target.files || []))}
              style={{ display: 'none' }} />
          </label>
        </div>

        <button type="submit" disabled={saving} style={{
          padding: '14px 32px',
          background: saving ? 'var(--color-text-light)' : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
          fontSize: '15px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
        }}>
          {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear propiedad'}
        </button>
      </form>
    </div>
  );
}

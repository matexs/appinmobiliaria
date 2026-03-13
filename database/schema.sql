-- ============================================================
-- SCHEMA COMPLETO - Aplicación Inmobiliaria
-- Ejecutar en Supabase SQL Editor en orden
-- ============================================================

-- ============================================================
-- 1. TIPOS ENUMERADOS
-- ============================================================
CREATE TYPE property_status AS ENUM ('activa', 'pausada', 'vendida');
CREATE TYPE visit_status AS ENUM ('confirmada', 'cancelada', 'completada');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- ============================================================
-- 2. TABLA: profiles (extiende auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  role user_role NOT NULL DEFAULT 'user',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. TABLA: property_types
-- ============================================================
CREATE TABLE property_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Seed de tipos de propiedad
INSERT INTO property_types (name, slug) VALUES
  ('Casa', 'casa'),
  ('Departamento', 'departamento'),
  ('Terreno', 'terreno'),
  ('Local Comercial', 'local-comercial'),
  ('Oficina', 'oficina'),
  ('PH', 'ph'),
  ('Cabaña', 'cabana'),
  ('Galpón', 'galpon');

-- ============================================================
-- 4. TABLA: properties
-- ============================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  province TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  square_meters NUMERIC(10, 2) NOT NULL DEFAULT 0,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  property_type_id INTEGER NOT NULL REFERENCES property_types(id),
  status property_status NOT NULL DEFAULT 'activa',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type_id);
CREATE INDEX idx_properties_featured ON properties(is_featured);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. TABLA: property_images
-- ============================================================
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_images_property ON property_images(property_id);

-- ============================================================
-- 6. TABLA: visits
-- ============================================================
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status visit_status NOT NULL DEFAULT 'confirmada',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Evitar doble booking: mismo property + fecha + hora
  CONSTRAINT unique_visit_slot UNIQUE (property_id, visit_date, start_time)
);

CREATE INDEX idx_visits_property ON visits(property_id);
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_date ON visits(visit_date);

CREATE TRIGGER visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 7. TABLA: contact_messages
-- ============================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_read ON contact_messages(is_read);
CREATE INDEX idx_messages_created ON contact_messages(created_at DESC);

-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FUNCIÓN HELPER: is_admin()
-- SECURITY DEFINER = bypasea RLS, evita recursión infinita
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- PROFILES
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins pueden ver todos los perfiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role puede insertar perfiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- PROPERTY TYPES (lectura pública)
CREATE POLICY "Lectura pública de tipos de propiedad"
  ON property_types FOR SELECT
  USING (true);

-- PROPERTIES
CREATE POLICY "Lectura pública de propiedades activas"
  ON properties FOR SELECT
  USING (status = 'activa' OR is_admin());

CREATE POLICY "Admins pueden insertar propiedades"
  ON properties FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins pueden actualizar propiedades"
  ON properties FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins pueden eliminar propiedades"
  ON properties FOR DELETE
  USING (is_admin());

-- PROPERTY IMAGES
CREATE POLICY "Lectura pública de imágenes"
  ON property_images FOR SELECT
  USING (true);

CREATE POLICY "Admins pueden insertar imágenes"
  ON property_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins pueden eliminar imágenes"
  ON property_images FOR DELETE
  USING (is_admin());

CREATE POLICY "Admins pueden actualizar imágenes"
  ON property_images FOR UPDATE
  USING (is_admin());

-- VISITS
CREATE POLICY "Usuarios ven sus propias visitas"
  ON visits FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Usuarios autenticados pueden crear visitas"
  ON visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus visitas"
  ON visits FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

-- CONTACT MESSAGES
CREATE POLICY "Cualquiera puede enviar mensajes"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins pueden ver mensajes"
  ON contact_messages FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins pueden actualizar mensajes"
  ON contact_messages FOR UPDATE
  USING (is_admin());

-- ============================================================
-- 9. STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

CREATE POLICY "Lectura pública de imágenes de propiedades"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Admins pueden subir imágenes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND is_admin());

CREATE POLICY "Admins pueden eliminar imágenes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND is_admin());


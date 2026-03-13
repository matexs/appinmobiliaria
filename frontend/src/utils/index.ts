/** Formatea un número como precio en ARS */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
}

/** Formatea una fecha ISO a formato legible */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Formatea una fecha corta */
export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Formatea el horario de visita */
export function formatTime(time: string): string {
  return time.slice(0, 5) + 'hs';
}

/** Obtiene la imagen de portada de una propiedad */
export function getCoverImage(images?: { image_url: string; is_cover: boolean }[]): string {
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';
  }
  const cover = images.find((img) => img.is_cover);
  return cover ? cover.image_url : images[0].image_url;
}

/** Genera un color de badge según el estado */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'activa': return '#22c55e';
    case 'pausada': return '#f59e0b';
    case 'vendida': return '#ef4444';
    default: return '#94a3b8';
  }
}

/** Genera un label legible para el estado */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'activa': return 'Activa';
    case 'pausada': return 'Pausada';
    case 'vendida': return 'Vendida';
    case 'confirmada': return 'Confirmada';
    case 'cancelada': return 'Cancelada';
    case 'completada': return 'Completada';
    default: return status;
  }
}

/** Trunca texto con ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/** Genera las iniciales de un nombre */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

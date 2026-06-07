export interface Oferta {
  id: number;
  titulo: string;
  descripcion: string;
  activo: boolean;
  comercioId?: number;
  comercio_id?: number;
  imagen_url?: string;
  imagenUrl?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  fechaFin?: string;

  comercioNombre?: string;
  comercio_nombre?: string;
  categoria?: string;
}

export interface Oferta {
  id: number;
  titulo: string;
  descripcion: string;
  activo: boolean;
  comercio_id: number;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;

  comercio_nombre?: string;
  categoria?: string;
}
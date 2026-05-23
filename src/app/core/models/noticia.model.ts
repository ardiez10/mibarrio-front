export interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  fuente?: string;
  url?: string;
  fecha_publicacion?: string;
  imagen_url?: string;
  fecha_creacion?: string;
  activo?: boolean;
}
export interface Comercio {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  activo?: boolean;
  categoria?: string;
  descripcion?: string;
  imagenUrl?: string;
}
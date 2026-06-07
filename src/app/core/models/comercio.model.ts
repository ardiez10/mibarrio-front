export interface Comercio {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  activo?: boolean;
  categoriaId?: number;
  categoria?: string;
  imagenUrl?: string;
  usuarioId?: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

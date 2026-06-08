export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rolId?: number;
  rolNombre?: string;
  createdAt?: string;
  updatedAt?: string;
  estado?: string;
  activo?: boolean;
}

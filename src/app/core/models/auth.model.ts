export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  email: string;
  userId: number;
  rol: string;
}

export interface SignupRequest {
  nombre: string;
  email: string;
  password: string;
  comercioNombre: string;
  comercioDireccion: string;
  comercioTelefono: string;
  categoriaId: number;
}

export interface SignupResponse {
  email: string;
  estado: string;
  message: string;
}

export interface AuthSession {
  token: string;
  email: string;
  userId: number;
  rol: string;
}

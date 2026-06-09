import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../models/auth.model';
import { Comercio, Horario } from '../models/comercio.model';
import { Noticia } from '../models/noticia.model';
import { Oferta } from '../models/oferta.model';
import { Categoria } from '../models/categoria.model';
import { Usuario } from '../models/usuario.model';

declare global {
  interface Window {
    __env?: {
      API_URL?: string;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class Api {
  
  private readonly API_URL = window.__env?.API_URL || 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, payload);
  }

  signup(payload: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.API_URL}/auth/signup`, payload);
  }
  
  getComercios(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.API_URL}/comercios`);
  }

  getAdminComercios(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.API_URL}/comercios/admin`);
  }

  getMisComercios(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.API_URL}/comercios/mios`);
  }

  getComerciosPendientes(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.API_URL}/comercios/pendientes`);
  }
  
  getComercioById(id: number): Observable<Comercio> {
    return this.http.get<Comercio>(`${this.API_URL}/comercios/${id}`);
  }
  
  getOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.API_URL}/ofertas`);
  }
  
  getOfertaById(id: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${this.API_URL}/ofertas/${id}`);
  }

  createOferta(comercioId: number, payload: {
    titulo: string;
    descripcion: string;
    fechaFin: string;
  }): Observable<Oferta> {
    return this.http.post<Oferta>(`${this.API_URL}/ofertas/comercio/${comercioId}`, payload);
  }

  updateOferta(id: number, payload: {
    titulo: string;
    descripcion: string;
    fechaFin: string;
  }): Observable<Oferta> {
    return this.http.put<Oferta>(`${this.API_URL}/ofertas/${id}`, payload);
  }

  deleteOferta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/ofertas/${id}`);
  }
  
  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.API_URL}/noticias`);
  }

  getAdminNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(`${this.API_URL}/noticias/admin`);
  }
  
  getNoticiaById(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.API_URL}/noticias/${id}`);
  }

  createNoticia(payload: {
    titulo: string;
    descripcion: string;
    fuente?: string;
    url?: string;
    imagenUrl?: string;
    fechaPublicacion?: string;
  }): Observable<Noticia> {
    return this.http.post<Noticia>(`${this.API_URL}/noticias`, payload);
  }

  updateNoticia(id: number, payload: {
    titulo: string;
    descripcion: string;
    fuente?: string;
    url?: string;
    imagenUrl?: string;
    fechaPublicacion?: string;
  }): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.API_URL}/noticias/${id}`, payload);
  }

  deleteNoticia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/noticias/${id}`);
  }

  activateNoticia(id: number): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.API_URL}/noticias/${id}/activar`, {});
  }

  getCategorias() {
    return this.http.get<Categoria[]>(`${this.API_URL}/categorias`);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios`);
  }

  getUsuariosPendientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/usuarios/pendientes`);
  }

  approveUsuario(id: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${id}/aprobar`, {});
  }

  rejectUsuario(id: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${id}/rechazar`, {});
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/usuarios/${id}`);
  }

  createComercio(payload: {
    nombre: string;
    direccion: string;
    telefono?: string;
    categoriaId: number;
    usuarioId: number;
  }): Observable<Comercio> {
    return this.http.post<Comercio>(`${this.API_URL}/comercios`, payload);
  }

  updateComercio(id: number, payload: {
    nombre: string;
    direccion: string;
    telefono?: string;
    categoriaId: number;
    usuarioId: number;
  }): Observable<Comercio> {
    return this.http.put<Comercio>(`${this.API_URL}/comercios/${id}`, payload);
  }

  deleteComercio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/comercios/${id}`);
  }

  approveComercio(id: number): Observable<Comercio> {
    return this.http.put<Comercio>(`${this.API_URL}/comercios/${id}/aprobar`, {});
  }

  rejectComercio(id: number): Observable<Comercio> {
    return this.http.put<Comercio>(`${this.API_URL}/comercios/${id}/rechazar`, {});
  }

  createHorario(comercioId: number, payload: {
    diaSemana: number;
    horaApertura: string;
    horaCierre: string;
  }): Observable<Horario> {
    return this.http.post<Horario>(`${this.API_URL}/horarios/comercio/${comercioId}`, payload);
  }

  updateHorario(id: number, payload: {
    diaSemana: number;
    horaApertura: string;
    horaCierre: string;
  }): Observable<Horario> {
    return this.http.put<Horario>(`${this.API_URL}/horarios/${id}`, payload);
  }

  deleteHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/horarios/${id}`);
  }
}

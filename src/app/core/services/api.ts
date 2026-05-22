import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Comercio } from '../models/comercio.model';
import { Oferta } from '../models/oferta.model';
import { Noticia } from '../models/noticia.model';

import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  getComercios(): Observable<Comercio[]> {

    return of([
      {
        id: 1,
        nombre: 'Panadería Central',
        direccion: 'Calle Mayor 12',
        telefono: '981111111',
        activo: true,
        categoria: 'Alimentación',
        imagenUrl: '/images/comercio-placeholder.png'
      },
      {
        id: 2,
        nombre: 'Café Os Mallos',
        direccion: 'Avenida Principal 8',
        telefono: '981222222',
        activo: false,
        categoria: 'Hostelería',
        imagenUrl: '/images/comercio-placeholder.png'
      },
      {
        id: 3,
        nombre: 'Librería Norte',
        direccion: 'Rua Real 15',
        telefono: '981333333',
        activo: true,
        categoria: 'Librería',        
        imagenUrl: '/images/comercio-placeholder.png'
      },
      {
        id: 4,
        nombre: 'Floristería Alba',
        direccion: 'Praza Galicia 3',
        telefono: '981444444',
        activo: true,
        categoria: 'Floristería',     
        imagenUrl: '/images/comercio-placeholder.png'
      },
      {
        id: 5,
        nombre: 'Moda Urbana',
        direccion: 'Calle Sol 22',
        telefono: '981555555',
        activo: false,
        categoria: 'Moda',     
        imagenUrl: '/images/comercio-placeholder.png'
      },
      {
        id: 6,
        nombre: 'ElectroHogar',
        direccion: 'Rua Nova 41',
        telefono: '981666666',
        activo: true,
        categoria: 'Electrónica',     
        imagenUrl: '/images/comercio-placeholder.png'
      }
    ]);
  }

  getComercioById(id: number): Observable<Comercio | undefined> {
    return this.getComercios().pipe(
      map(comercios => comercios.find(comercio => comercio.id === id))
    );
  }

  getOfertas(): Observable<Oferta[]> {

    return of([
      {
        id: 1,
        titulo: '2x1 en desayunos',
        descripcion: 'Solo esta semana',
        activa: true
      },
      {
        id: 2,
        titulo: 'Descuento en peluquería',
        descripcion: '15% para nuevos clientes',
        activa: false
      }
    ]);
  }

  getNoticias(): Observable<Noticia[]> {

    return of([
      {
        id: 1,
        titulo: 'Nuevo evento vecinal',
        contenido: 'Este sábado habrá actividades culturales en el barrio.'
      },
      {
        id: 2,
        titulo: 'Campaña comercio local',
        contenido: 'Nueva iniciativa para apoyar negocios de proximidad.'
      }
    ]);
  }
}
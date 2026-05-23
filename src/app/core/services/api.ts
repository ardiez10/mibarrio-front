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
        descripcion: 'Disfruta de dos desayunos por el precio de uno durante esta semana.',
        activo: true,
        comercio_id: 2,
        comercio_nombre: 'Café Os Mallos',
        categoria: 'Hostelería',
        imagen_url: '/images/comercio-placeholder.png'
      },
      {
        id: 2,
        titulo: '15% en productos artesanales',
        descripcion: 'Descuento especial en productos seleccionados de panadería.',
        activo: true,
        comercio_id: 1,
        comercio_nombre: 'Panadería Central',
        categoria: 'Alimentación',
        imagen_url: '/images/comercio-placeholder.png'
      },
      {
        id: 3,
        titulo: 'Descuento en libros infantiles',
        descripcion: 'Promoción para fomentar la lectura entre los más pequeños.',
        activo: false,
        comercio_id: 3,
        comercio_nombre: 'Librería Norte',
        categoria: 'Librería',
        imagen_url: '/images/comercio-placeholder.png'
      },
      {
        id: 4,
        titulo: 'Descuento en libros infantiles',
        descripcion: 'Promoción para fomentar la lectura entre los más pequeños.',
        activo: false,
        comercio_id: 3,
        comercio_nombre: 'Librería Norte',
        categoria: 'Librería',
        imagen_url: '/images/comercio-placeholder.png'
      }
    ]);
  }

  getOfertaById(id: number): Observable<Oferta | undefined> {
    return this.getOfertas().pipe(
      map(ofertas => ofertas.find(oferta => oferta.id === id))
    );
  }

  getNoticias(): Observable<Noticia[]> {
    return of([
      {
        id: 1,
        titulo: 'Nueva campaña de apoyo al comercio local',
        descripcion: 'El barrio impulsa una iniciativa para dar visibilidad a pequeños negocios y fomentar el consumo de proximidad.',
        fuente: 'Diario Local',
        url: 'https://example.com/noticia-1',
        fecha_publicacion: '2026-05-20',
        imagen_url: '/images/comercio-placeholder.png',
        activo: true
      },
      {
        id: 2,
        titulo: 'Actividades culturales este fin de semana',
        descripcion: 'Vecinos y asociaciones preparan una programación especial con música, talleres y actividades familiares.',
        fuente: 'Noticias Barrio',
        url: 'https://example.com/noticia-2',
        fecha_publicacion: '2026-05-18',
        imagen_url: '/images/comercio-placeholder.png',
        activo: true
      },
      {
        id: 3,
        titulo: 'Mejoras en la plaza principal del barrio',
        descripcion: 'El entorno contará con nuevas zonas verdes, bancos y espacios de encuentro para los vecinos.',
        fuente: 'Vigo Actualidad',
        url: 'https://example.com/noticia-3',
        fecha_publicacion: '2026-05-15',
        imagen_url: '/images/comercio-placeholder.png',
        activo: true
      }
    ]);
  }

  getNoticiaById(id: number): Observable<Noticia | undefined> {
    return this.getNoticias().pipe(
      map(noticias => noticias.find(noticia => noticia.id === id))
    );
  }
}
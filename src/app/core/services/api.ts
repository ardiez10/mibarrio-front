import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Comercio } from '../models/comercio.model';
import { Oferta } from '../models/oferta.model';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class Api {

  getComercios(): Observable<Comercio[]> {

    return of([
      {
        id: 1,
        nombre: 'Panadería Central',
        descripcion: 'Pan y bollería artesanal',
        direccion: 'Calle Mayor 12'
      },
      {
        id: 2,
        nombre: 'Café Os Mallos',
        descripcion: 'Cafetería y desayunos',
        direccion: 'Avenida Principal 8'
      }
    ]);
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
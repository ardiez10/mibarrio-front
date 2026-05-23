import { Routes } from '@angular/router';
import { ComerciosList } from './features/comercios/pages/comercios-list/comercios-list';
import { Home } from './features/home/pages/home/home';
import { MainLayout } from './layout/main-layout/main-layout';
import { ComercioDetail } from './features/comercios/pages/comercio-detail/comercio-detail';
import { OfertasList } from './features/ofertas/pages/ofertas-list/ofertas-list';
import { OfertaDetail } from './features/ofertas/pages/oferta-detail/oferta-detail';
import { NoticiasList } from './features/noticias/pages/noticias-list/noticias-list';
import { NoticiaDetail } from './features/noticias/pages/noticia-detail/noticia-detail';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: Home,
            },
            {
                path: 'comercios',
                component: ComerciosList
            },
            {
                path: 'comercios/:id',
                loadComponent: () =>
                    import('./features/comercios/pages/comercio-detail/comercio-detail')
                        .then(m => m.ComercioDetail)
            },
            {
                path: 'comercios/:id',
                component: ComercioDetail
            },
            {
                path: 'ofertas',
                component: OfertasList
            },
            {
                path: 'ofertas/:id',
                component: OfertaDetail
            },
            {
                path: 'noticias',
                component: NoticiasList
            },
            {
                path: 'noticias/:id',
                component: NoticiaDetail
            },
            {
                path: 'noticias',
                component: NoticiasList
            },
            {
                path: 'noticias/:id',
                component: NoticiaDetail
            }
        ],
    }
];
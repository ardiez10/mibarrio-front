import { Routes } from '@angular/router';
import { AdminLayout } from './features/admin/layout/admin-layout/admin-layout';
import { AdminComercios } from './features/admin/pages/admin-comercios/admin-comercios';
import { AdminDashboard } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { AdminSolicitudes } from './features/admin/pages/admin-solicitudes/admin-solicitudes';
import { AdminUsuarios } from './features/admin/pages/admin-usuarios/admin-usuarios';
import { AdminOfertas } from './features/admin/pages/admin-ofertas/admin-ofertas';
import { AdminNoticias } from './features/admin/pages/admin-noticias/admin-noticias';
import { Login } from './features/auth/pages/login/login';
import { Signup } from './features/auth/pages/signup/signup';
import { ComercioDetail } from './features/comercios/pages/comercio-detail/comercio-detail';
import { ComerciosList } from './features/comercios/pages/comercios-list/comercios-list';
import { Home } from './features/home/pages/home/home';
import { AvisoLegal } from './features/legal/pages/aviso-legal/aviso-legal';
import { Cookies } from './features/legal/pages/cookies/cookies';
import { Privacidad } from './features/legal/pages/privacidad/privacidad';
import { NoticiaDetail } from './features/noticias/pages/noticia-detail/noticia-detail';
import { NoticiasList } from './features/noticias/pages/noticias-list/noticias-list';
import { OfertaDetail } from './features/ofertas/pages/oferta-detail/oferta-detail';
import { OfertasList } from './features/ofertas/pages/ofertas-list/ofertas-list';
import { adminGuard, adminOnlyGuard } from './core/guards/admin.guard';
import { MainLayout } from './layout/main-layout/main-layout';

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
                path: 'login',
                component: Login
            },
            {
                path: 'signup',
                component: Signup
            },
            {
                path: 'aviso-legal',
                component: AvisoLegal
            },
            {
                path: 'privacidad',
                component: Privacidad
            },
            {
                path: 'cookies',
                component: Cookies
            }
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                component: AdminDashboard
            },
            {
                path: 'solicitudes',
                canActivate: [adminOnlyGuard],
                component: AdminSolicitudes
            },
            {
                path: 'usuarios',
                canActivate: [adminOnlyGuard],
                component: AdminUsuarios
            },
            {
                path: 'comercios',
                component: AdminComercios
            },
            {
                path: 'ofertas',
                component: AdminOfertas
            },
            {
                path: 'noticias',
                canActivate: [adminOnlyGuard],
                component: AdminNoticias
            }
        ]
    }
];

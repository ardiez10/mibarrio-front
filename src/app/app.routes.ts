import { Routes } from '@angular/router';
import { ComerciosList } from './features/comercios/pages/comercios-list/comercios-list';
import { Home } from './features/home/pages/home/home';
import { MainLayout } from './layout/main-layout/main-layout';
import { ComercioDetail } from './features/comercios/pages/comercio-detail/comercio-detail';


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
            }
        ],
    }
];
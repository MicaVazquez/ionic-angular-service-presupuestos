import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'mis-presupuestos',
    pathMatch: 'full',
  },
  {
    path: 'nuevo-presupuesto',
    loadComponent: () =>
      import('./nuevo-presupuesto/nuevo-presupuesto.page').then(
        (m) => m.NuevoPresupuestoPage,
      ),
  },
  {
    path: 'nuevo-presupuesto/:id',
    loadComponent: () =>
      import('./nuevo-presupuesto/nuevo-presupuesto.page').then(
        (m) => m.NuevoPresupuestoPage,
      ),
  },
  {
    path: 'home',
    redirectTo: 'mis-presupuestos',
    pathMatch: 'full',
  },
  {
    path: 'mis-presupuestos',
    loadComponent: () =>
      import('./mis-presupuestos/mis-presupuestos.page').then(
        (m) => m.MisPresupuestosPage,
      ),
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.component').then((m) => m.SplashComponent),
  },
  {
    path: '**',
    redirectTo: 'mis-presupuestos',
  },
];

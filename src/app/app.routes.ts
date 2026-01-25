import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: 'home',
  //   redirectTo: 'folder/inbox',
  //   pathMatch: 'full',
  // },
  {
    path: 'nuevo-presupuesto',
    loadComponent: () =>
      import('./nuevo-presupuesto/nuevo-presupuesto.page').then(
        (m) => m.NuevoPresupuestoPage,
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./inicio/inicio.component').then((m) => m.InicioComponent),
  },
  {
    path: 'mis-presupuestos',
    loadComponent: () =>
      import('./mis-presupuestos/mis-presupuestos.page').then(
        (m) => m.MisPresupuestosPage,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./splash/splash.component').then((m) => m.SplashComponent),
  },
];

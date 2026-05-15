import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'nuevo-presupuesto',
    loadComponent: () =>
      import('./nuevo-presupuesto/nuevo-presupuesto.page').then(
        (m) => m.NuevoPresupuestoPage,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'nuevo-presupuesto/:id',
    loadComponent: () =>
      import('./nuevo-presupuesto/nuevo-presupuesto.page').then(
        (m) => m.NuevoPresupuestoPage,
      ),
    canActivate: [authGuard],
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
    canActivate: [authGuard],
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./splash/splash.component').then((m) => m.SplashComponent),
  },
  {
    path: '**',
    redirectTo: 'splash',
  },
];

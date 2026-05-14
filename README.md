# Presupuestos

<div align="center">

[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=flat&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Node](https://img.shields.io/badge/Node-%3E%3D14-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-unlicensed-lightgrey?style=flat)](./LICENSE)

</div>

Aplicación móvil/web con Ionic + Angular + Capacitor para crear, editar y gestionar presupuestos. Permite agregar múltiples ítems con descripción y precio, calcular totales con anticipos en porcentaje, guardar en Supabase, exportar a PDF y compartir.

## Funcionalidades

- ✅ **Crear y editar presupuestos** con cliente, fecha, ítems, anticipo y observaciones
- ✅ **Validaciones de formulario** completas con mensajes de error específicos
- ✅ **Cálculo automático** de subtotal, anticipo y total
- ✅ **Listado de presupuestos** con búsqueda y filtros por estado
- ✅ **Detalle de presupuesto** con vista completa
- ✅ **Eliminar presupuestos** con confirmación
- ✅ **Exportar a PDF** y compartir
- ✅ **Login con Supabase Auth** (email + contraseña, sesión persistente)
- ✅ **Rutas protegidas** con AuthGuard (redirige a `/login` si no está autenticado)
- ✅ **Modales custom** consistentes (AlertModal) para alertas y confirmaciones
- ✅ **Persistencia** en Supabase (tabla `presupuesto` con RLS activo)

## Requisitos

- Node `>= 14`
- npm o yarn
- Ionic CLI — `npm install -g @ionic/cli`
- Java / Android SDK _(solo para Android)_
- Cuenta en [Supabase](https://supabase.com/) con tabla `presupuesto` configurada

## Instalación

```bash
npm install
```

Copiá el archivo de ejemplo y completá con tus credenciales de Supabase:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Editá `src/environments/environment.ts` con tus datos (Settings → API Keys → Publishable key):

```ts
export const environment = {
  production: false,
  supabase: {
    url: 'TU_SUPABASE_URL',
    key: 'TU_SUPABASE_PUBLISHABLE_KEY',
  },
};
```

> ⚠️ `environment.ts` está en `.gitignore` — nunca lo subas al repo.

## Desarrollo

```bash
ionic serve
```

## Android

```bash
ionic build
npx cap sync android
npx cap open android
```

## Tests

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Estructura

```
src/
├── app/
│   ├── components/
│   │   └── alert-modal.component.ts   # Modal custom (success/error/warning/info)
│   ├── guards/
│   │   └── auth.guard.ts              # Protege rutas, redirige a /login si no autenticado
│   ├── login/                         # Página de login (email + contraseña)
│   ├── inicio/                        # Página de inicio
│   ├── nuevo-presupuesto/             # Crear/editar presupuesto
│   ├── mis-presupuestos/              # Listar presupuestos
│   ├── detalle-presupuesto/           # Ver detalle de un presupuesto
│   ├── splash/                        # Pantalla de splash
│   ├── interfaces/
│   │   └── presupuesto.ts             # Modelo Presupuesto e ItemPresupuesto
│   ├── services/
│   │   ├── alert.service.ts           # Manejo centralizado de alertas
│   │   ├── auth.service.ts            # Login/logout con Supabase Auth
│   │   ├── database-service.ts        # Cliente Supabase (CRUD)
│   │   └── pdf-service.ts             # Generación de PDF
│   ├── app.component.ts               # Shell con menú lateral y botón logout
│   └── app.routes.ts                  # Rutas con loadComponent (lazy) + canActivate
├── environments/
│   ├── environment.example.ts         # ✅ Plantilla con placeholders (subir al repo)
│   ├── environment.ts                 # ❌ Credenciales reales (en .gitignore)
│   └── environment.prod.ts            # ❌ Credenciales producción (en .gitignore)
└── assets/
android/                               # Proyecto Android (Capacitor)
```

## Stack técnico

- **Ionic 8** + **Angular 20** (standalone components, sin NgModules)
- **Capacitor 7** para empaquetado a Android
- **Supabase** como backend (auth + base de datos, RLS activo)
- **Supabase Auth** para login con email y contraseña
- **Reactive Forms** (`FormBuilder`, `FormArray`) para formularios
- **AlertModal custom** reemplazando SweetAlert2

## Modelo de datos

```ts
interface Presupuesto {
  id?: string;
  cliente: string;
  fecha: string;
  anticipoPercent: number;
  items: ItemPresupuesto[];
  total: number;
  estado: "borrador" | "finalizado";
  observaciones?: string | null;
}

interface ItemPresupuesto {
  descripcion: string;
  precio: number;
}
```

## Notas

- Tras instalar plugins de Capacitor: `npx cap sync`
- Cambios nativos: sincronizar con `npx cap sync` y abrir la plataforma correspondiente

## Contribuir

Abrí un issue o pull request. Mantené el estilo del código e incluí pruebas.

## Licencia

Sin licencia definida — considerar añadir una.

# Presupuestos — Carpintería PV

<div align="center">

[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=flat&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

Aplicación móvil y web para gestionar presupuestos de carpintería. Permite crear presupuestos con múltiples ítems, calcular totales con anticipo, exportar a PDF y compartir directamente desde el celular.

---

## Capturas

| Splash | Login | Lista de presupuestos | Nuevo presupuesto | PDF generado |
|:---:|:---:|:---:|:---:|:---:|
| <img width="425" height="738" alt="image" src="https://github.com/user-attachments/assets/51bc1847-5925-457d-861b-7ecf146cc6ed" />| <img width="340" alt="Login" src="https://github.com/user-attachments/assets/2689a60c-ff0e-470a-9554-8b548a78387d" /> | <img width="379" alt="Lista de presupuestos" src="https://github.com/user-attachments/assets/85fcb952-6b66-4b5f-8b81-dede067c5057" /> | <img width="380" alt="Nuevo presupuesto" src="https://github.com/user-attachments/assets/ecdc7715-ee28-44d4-9b36-9ad8aee32a6f" /> | <img width="570" alt="PDF generado" src="https://github.com/user-attachments/assets/987c7c1d-f1ca-4610-80ec-dca7689eeee8" /> |
 

---

## Funcionalidades

- ✅ **Login** con email y contraseña (Supabase Auth, sesión persistente)
- ✅ **Crear y editar presupuestos** con cliente, ítems, anticipo % y observaciones
- ✅ **Validaciones** completas con mensajes de error específicos por campo
- ✅ **Cálculo automático** de total, anticipo y saldo pendiente
- ✅ **Listado** con búsqueda en tiempo real y actualizaciones en vivo (Supabase Realtime)
- ✅ **Exportar a PDF** con diseño profesional (fecha de emisión del día)
- ✅ **Compartir PDF** en Android vía share sheet (WhatsApp, Gmail, Drive, etc.)
- ✅ **Eliminar** con confirmación
- ✅ **Rutas protegidas** con AuthGuard
- ✅ **Tests** de cálculos financieros (16 specs, 100% pass)

---

## Instalación

### Requisitos

- Node `>= 14`
- Ionic CLI — `npm install -g @ionic/cli`
- Cuenta en [Supabase](https://supabase.com/)
- Java / Android SDK _(solo para build Android)_

### Pasos

```bash
npm install
```

Copiá el archivo de entorno y completá con tus credenciales:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Editá `environment.ts` con tus datos (**Settings → API Keys → Publishable key**):

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

---

## Comandos

```bash
# Desarrollo web
ionic serve

# Tests
npm test

# Lint
npm run lint

# Build + Android
ionic build
npx cap sync android
npx cap open android   # abre Android Studio para generar el APK
```

---

## Estructura

```
src/
├── app/
│   ├── components/
│   │   └── alert-modal.component.ts   # Modal custom (success / error / warning)
│   ├── guards/
│   │   └── auth.guard.ts              # Redirige a /login si no autenticado
│   ├── interfaces/
│   │   └── presupuesto.ts             # Modelos Presupuesto e ItemPresupuesto
│   ├── login/                         # Pantalla de login
│   ├── mis-presupuestos/              # Listado con búsqueda y acciones
│   ├── nuevo-presupuesto/             # Crear / editar presupuesto
│   ├── splash/                        # Pantalla de carga inicial
│   ├── services/
│   │   ├── alert.service.ts           # Alertas centralizadas
│   │   ├── auth.service.ts            # Login / logout con Supabase Auth
│   │   ├── database-service.ts        # CRUD + Realtime (Supabase)
│   │   └── pdf-service.ts             # Generación y descarga / share de PDF
│   ├── utils/
│   │   ├── calculos.ts                # Funciones puras: subtotal, anticipo, saldo
│   │   └── calculos.spec.ts           # 16 tests de cálculos financieros
│   ├── app.component.ts               # Shell con menú lateral y logout
│   └── app.routes.ts                  # Rutas lazy + canActivate
├── environments/
│   ├── environment.example.ts         # ✅ Plantilla (en el repo)
│   ├── environment.ts                 # ❌ Credenciales reales (.gitignore)
│   └── environment.prod.ts            # ❌ Credenciales producción (.gitignore)
└── assets/
    └── logo.png                       # Logo opcional (si no existe usa "CPV")
```

---

## Modelo de datos

```ts
interface Presupuesto {
  id?: string;
  cliente: string;
  fecha: string;          // se asigna automáticamente al crear
  anticipoPercent: number;
  items: ItemPresupuesto[];
  total: number;
  estado: 'borrador' | 'finalizado';
  observaciones?: string | null;
}

interface ItemPresupuesto {
  descripcion: string;
  precio: number;
}
```

---

## Stack

| Capa | Tecnología |
|---|---|
| UI | Ionic 8 + Angular 20 (standalone components) |
| Mobile | Capacitor 7 (Android) |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Seguridad | Row Level Security (RLS) con políticas `authenticated` |
| PDF | jsPDF + @capacitor/share |
| Forms | ReactiveFormsModule (FormBuilder + FormArray) |
| Tests | Karma + Jasmine |

---

## Notas

- Tras instalar un plugin de Capacitor, correr `npx cap sync`
- El PDF usa la fecha del día que se genera, no la de creación del presupuesto
- Los precios en el PDF incluyen la leyenda _"Precios válidos al DD/MM/YYYY. Sujetos a variación."_

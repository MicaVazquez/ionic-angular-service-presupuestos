# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Dev server: `ionic serve` (preferred) or `npm start` / `ng serve`
- Build web bundle into `www/`: `ng build` (or `ionic build`)
- Tests (Karma + Jasmine, Chrome): `npm test` / `ng test`
- Single test file: `ng test --include=src/app/services/database-service.spec.ts`
- Lint: `npm run lint` (Angular ESLint)
- Android: `ionic build && npx cap sync android && npx cap open android`
- After installing a Capacitor plugin or changing native code: re-run `npx cap sync`

## Architecture

Ionic 8 + Angular 20 (standalone components, no NgModules) + Capacitor 7. UI text and domain terms are in Spanish (`presupuesto`, `cliente`, `items`, `anticipo`).

- **Routing** (`src/app/app.routes.ts`): every route uses `loadComponent` for lazy loading. Feature pages live under `src/app/<feature>/` (`inicio`, `nuevo-presupuesto`, `mis-presupuestos`, `splash`). The `**` wildcard falls through to `SplashComponent`, so new routes must be registered before it.
- **Shell** (`src/app/app.component.ts`): `IonSplitPane` + side menu. The side menu is driven by the `appPages` array — adding a navigation entry means updating `appPages` *and* importing/registering its icon via `addIcons({...})` in the constructor (icons are tree-shaken; unregistered names render blank).
- **Pages**: each page is a standalone component that imports its own `@ionic/angular/standalone` primitives in the `imports` array. Forms use `ReactiveFormsModule` with `FormBuilder`/`FormArray` (see `nuevo-presupuesto.page.ts` for the item-list pattern). User-facing dialogs/alerts use SweetAlert2 (`Swal.fire`) with `heightAuto: false` to play nice with Ionic.
- **Persistence** (`src/app/services/database-service.ts`): Supabase client, table `presupuesto`. `DatabaseService` is `providedIn: 'root'`; credentials come from `src/environments/environment.ts` (dev) / `environment.prod.ts` (swapped at build time via `angular.json` `fileReplacements`). The Supabase anon key is committed in `environment.ts` — treat it as public config, not a secret.
- **Domain model** (`src/app/interfaces/presupuesto.ts`): `Presupuesto` has an `items: ItemPresupuesto[]` array and split `anticipoPercent` / `anticipoMonto` fields (percentage entered by the user, amount computed from subtotal).
- **Capacitor** (`capacitor.config.ts`): `webDir: 'www'`, so `ng build` must run before `npx cap sync`. `appId: com.presupuestos.app`.

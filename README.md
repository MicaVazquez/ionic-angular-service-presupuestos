# Presupuestos

<div align="center">

[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=flat&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Node](https://img.shields.io/badge/Node-%3E%3D14-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-unlicensed-lightgrey?style=flat)](./LICENSE)

</div>

Aplicación móvil con Ionic + Angular y Capacitor para crear, listar y gestionar presupuestos con ítems, exportar a PDF y compartir.

## Requisitos

- Node `>= 14`
- npm o yarn
- Ionic CLI — `npm install -g @ionic/cli`
- Java / Android SDK _(solo para Android)_

## Instalación

```bash
npm install
```

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

## Estructura

```
src/
├── app/
│   ├── mis-presupuestos/
│   └── ...
└── assets/
android/
```

## Notas

- Agregar plugins: `npm install <plugin>` + `npx cap sync`
- Cambios nativos: sincronizar con `npx cap sync` y abrir la plataforma correspondiente

## Contribuir

Abre un issue o pull request. Mantén el estilo del código e incluye pruebas.

## Licencia

Sin licencia definida — considerar añadir una.

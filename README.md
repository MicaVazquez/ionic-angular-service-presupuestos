# Presupuestos (Ionic + Capacitor)

Aplicación móvil/SPA para crear y gestionar presupuestos.

## Descripción

Proyecto desarrollado con Ionic + Angular y Capacitor. Permite crear, listar y gestionar presupuestos con items, exportar (PDF) y compartir. La interfaz principal incluye la página **Mis Presupuestos** donde se muestran los presupuestos guardados.

## Requisitos

- Node >= 14
- npm o yarn
- Ionic CLI (`npm install -g @ionic/cli`)
- Java / Android SDK (si vas a compilar para Android)

## Instalación

1. Clona el repositorio.
2. Instala dependencias:

```
npm install
## Desarrollo (navegador)

Arranca la app en modo desarrollo:

ionic serve
## Ejecutar en Android

Construir la app:
ionic build
Sincronizar con Capacitor y abrir Android Studio:
npx cap sync android
npx cap open android
Desde Android Studio podrás compilar y ejecutar en dispositivo o emulador.

## Tests

Ejecutar los tests unitarios (Karma):

npm test
## Estructura relevante

src/app/ — código Angular principal.
src/app/mis-presupuestos/ — página para listar presupuestos.
src/assets/ — recursos estáticos.
android/ — proyecto nativo Android generado por Capacitor.
## Notas rápidas

Para agregar plugins de Capacitor: npm install <plugin> y npx cap sync.
Si añades permisos o cambios nativos, abre la plataforma correspondiente y sincroniza.
## Contribuir

Abrir issue o pull request con cambios claros. Mantener estilo y pruebas.

## Licencia

Proyecto sin licencia específica — añadir una licencia si corresponde.# ionic-angular-service-presupuestos

```

Mostrar más
8:15 p. m.
¡Hola! Veo que tienes un proyecto de presupuestos con Ionic + Angular + Capacitor. ¿En qué te puedo ayudar?

Puedo asistirte con cosas como:

Agregar nuevas funcionalidades (filtros, categorías, totales, etc.)
Mejorar la UI/UX de la app
Implementar la exportación a PDF
Configurar plugins de Capacitor
Resolver errores o bugs
Escribir o mejorar tests
¿Qué necesitas?

ayudame a agregar estilos al readme

8:15 p. m.
¡Claro! Para darle un mejor estilo al README, necesito saber un poco más sobre lo que buscas.

Cuéntame tus preferencias y lo preparo de inmediato.

P: ¿Qué estilo visual prefieres para el README?
R: Profesional con badges e iconos

P: ¿Qué elementos quieres agregar? (Selecciona todas las opciones aplicables)
R: Badges (versión, licencia, etc.)

8:15 p. m.

Archivo creado, leyó un archivo
Archivo creado, leyó un archivo
Aquí tienes el README mejorado. Los cambios principales incluyen badges de Ionic, Angular, Capacitor, Node y Licencia en el encabezado centrado, iconos emoji en cada sección, un bloque visual de la estructura de carpetas, y un footer con créditos. Los badges enlazan automáticamente a las páginas oficiales de cada tecnología cuando se visualizan en GitHub.

Readme
Documento · MD
mas minimalista

8:18 p. m.

Archivo editado, leyó un archivo
Archivo editado, leyó un archivo
Listo, mucho más limpio. Se quitaron los emojis, los separadores ---, el texto decorativo y se simplificaron las descripciones. Solo quedan los badges en flat (más discretos) y el contenido esencial.

Readme
Documento · MD

Claude es IA y puede cometer errores. Por favor, verifica las respuestas.
Readme · MD
Copiar

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

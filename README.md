<div align="center">

# 💰 Presupuestos App

### Aplicación móvil para crear y gestionar presupuestos

[![Ionic](https://img.shields.io/badge/Ionic-7.x-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-17.x-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Capacitor](https://img.shields.io/badge/Capacitor-5.x-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Node](https://img.shields.io/badge/Node->=14-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/Licencia-Sin%20definir-lightgrey?style=for-the-badge)](./LICENSE)

</div>

---

## 📋 Descripción

Proyecto desarrollado con **Ionic + Angular** y **Capacitor**. Permite crear, listar y gestionar presupuestos con ítems, exportar a PDF y compartir. La interfaz principal incluye la página **Mis Presupuestos** donde se muestran los presupuestos guardados.

---

## ⚙️ Requisitos

- 🟢 Node `>= 14`
- 📦 npm o yarn
- ⚡ Ionic CLI — `npm install -g @ionic/cli`
- 🤖 Java / Android SDK _(solo para compilar en Android)_

---

## 🚀 Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repo>
cd presupuestos
npm install
```

---

## 🖥️ Desarrollo (navegador)

Arranca la app en modo desarrollo:

```bash
ionic serve
```

---

## 📱 Ejecutar en Android

**1. Construir la app:**

```bash
ionic build
```

**2. Sincronizar con Capacitor y abrir Android Studio:**

```bash
npx cap sync android
npx cap open android
```

> Desde Android Studio podrás compilar y ejecutar en dispositivo o emulador.

---

## 🧪 Tests

Ejecutar los tests unitarios con Karma:

```bash
npm test
```

---

## 🗂️ Estructura del proyecto

```
src/
├── app/
│   ├── mis-presupuestos/   # Página para listar presupuestos
│   └── ...                 # Código Angular principal
├── assets/                 # Recursos estáticos
android/                    # Proyecto nativo Android (Capacitor)
```

---

## 📝 Notas rápidas

- Para agregar plugins de Capacitor: `npm install <plugin>` y luego `npx cap sync`
- Si añades permisos o cambios nativos, abre la plataforma correspondiente y sincroniza

---

## 🤝 Contribuir

Abre un **issue** o **pull request** con cambios claros. Por favor, mantén el estilo del código y asegúrate de incluir pruebas.

---

## 📄 Licencia

Proyecto sin licencia específica — se recomienda añadir una antes de publicar.

<div align="center">
  <sub>Hecho con ❤️ usando Ionic + Angular + Capacitor</sub>
</div>

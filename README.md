
# 🌤️ Meteora - Asistente de Clima con IA

**Meteora** es una aplicación web que integra inteligencia artificial y datos meteorológicos en tiempo real para ofrecer respuestas personalizadas sobre el clima. Permite a los usuarios interactuar mediante un chat moderno, almacenar conversaciones y consultar condiciones climáticas actuales utilizando la API de **Open-Meteo** y **OpenAI**.

---

## 🧩 Tecnologías Utilizadas

| Capa           | Tecnología              |
|----------------|--------------------------|
| Frontend       | Vue 3 (Composition API) |
| Estilos        | Tailwind CSS            |
| API Clima      | Open-Meteo              |
| IA             | OpenAI                  |

---

## 🖥️ Características Principales

- 💬 Chat moderno e interactivo.
- 🧾 Visualización del historial de conversaciones.
- ⚡ Feedback visual: carga, errores, estados vacíos.
- 🌙 Interfaz oscura con gradientes animados.
- 📱 Diseño responsive (móvil y escritorio).

---

## 🛠️ Instalación y Configuración

### Requisitos Previos

- Node.js 18+
- npm

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/holman25/meteora-web.git
cd meteora-web

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

---

## 📁 Estructura del Proyecto

```
meteora-web/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   └── layout/
│   ├── views/
│   └── App.vue
├── public/
│   └── Meteoralogo.png
├── tailwind.config.js
├── index.html
```

---

## ✅ Buenas Prácticas Implementadas

- Prompt bien estructurado (rol, reglas, limitaciones, formato esperado).
- Feedback visual e interfaz clara.
- Componentes Vue organizados por funcionalidad.
- Uso extensivo de Tailwind CSS.
- Código limpio y mantenible.
- Commits atómicos y descriptivos (`feat:`, `fix:`, `refactor:`, `docs:`).
- Archivos sensibles fuera del repositorio (`.env`, `node_modules`, etc).

---

## ✉️ Ejemplo de Interacción

1. Usuario: `¿Está haciendo frio hoy en la ciudad de Bogotá?`
2. IA: llama a Open-Meteo si es necesario y responde algo como:

```
🌧️ Bogotá hoy:
- Temperatura: 12 °C
- Si la sensación termica es baja, lleva tu mejor buzo!
```

---

## 📝 Licencia
MIT - Proyecto con fines demostrativos.
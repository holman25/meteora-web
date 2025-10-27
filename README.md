
# 🌤️ Meteora - Asistente de Clima con IA

**Meteora** es una aplicación web interactiva que combina **inteligencia artificial** con **datos meteorológicos en tiempo real** para ofrecer respuestas precisas, naturales y visualmente atractivas sobre el clima.  
Los usuarios pueden chatear directamente con Meteora para conocer las condiciones actuales o pronósticos locales, gracias a la integración con **Open-Meteo** y **OpenAI**.

🔗 **Sitio oficial:** [https://meteora-web.netlify.app/](https://meteora-web.netlify.app/)  
📦 **Repositorio:** [https://github.com/holman25/meteora-web](https://github.com/holman25/meteora-web)

---

## 🧩 Tecnologías Utilizadas

| Capa           | Tecnología              |
|----------------|--------------------------|
| Frontend       | Vue 3 (Composition API) |
| Estilos        | Tailwind CSS            |
| API Clima      | Open-Meteo              |
| IA             | OpenAI (ChatGPT API)    |
| Estado global  | Composables Vue         |
| Hosting        | Netlify                 |

---

## ⚙️ Requisitos y Permisos

> 🚨 **Importante:** Para usar Meteora, el usuario **debe otorgar permisos de ubicación**.  
> Esto permite que la IA entienda el contexto geográfico y brinde información meteorológica precisa.  
> Sin ubicación, la aplicación no funcionará y redirigirá al Onboarding.

### Requisitos Técnicos

- **Node.js** 18 o superior
- **npm** o **yarn**
- Navegador con soporte de **Geolocalización** (HTTPS o `localhost`)

---

## 🖥️ Características Principales

- 💬 Chat moderno con animaciones suaves y respuestas naturales.
- 📍 Detección obligatoria de ubicación del usuario.
- 🧾 Historial persistente de conversaciones.
- ⚡ Feedback visual (carga, errores, vacíos, reconexión).
- 🌙 Interfaz oscura con gradientes animados.
- 📱 Totalmente responsive (móvil, tablet y escritorio).
- 🔐 Persistencia de sesión y cookies para ubicación.
- 🎨 UI minimalista, tipo "glassmorphism".

---

## 🚀 Instalación y Ejecución Local

```bash
# Clonar el repositorio
git clone https://github.com/holman25/meteora-web.git
cd meteora-web

---

## ⚙️ Configuración del Entorno (.env)
Antes de ejecutar el proyecto, asegúrate de crear tu archivo de entorno a partir del ejemplo incluido en el repositorio:
```bash

---

# Copiar el archivo de ejemplo
cp .env.example.env .env
---
# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

Luego abre [http://localhost:5173](http://localhost:5173) (o el puerto indicado) y otorga permisos de ubicación cuando el navegador lo solicite.

---

## 📁 Estructura del Proyecto

```
meteora-web/
├── src/
│   ├── api/                  # Llamadas HTTP a backend y APIs externas
│   ├── assets/               # Íconos, imágenes, logos
│   ├── components/
│   │   ├── chat/             # Ventana, Input, Mensajes
│   │   ├── layout/           # Sidebar, Navbar, LoadingOverlay
│   │   └── landing/          # Onboarding y pantallas iniciales
│   ├── composables/          # useMessages, useUserLocation, etc.
│   ├── views/                # Páginas principales
│   ├── App.vue
│   └── main.js
├── public/
│   └── Meteoralogo.png
├── tailwind.config.js
├── package.json
├── vite.config.js
└── README.md
```

---

## ✅ Buenas Prácticas Implementadas

- Uso del patrón **Composition API** de Vue 3.
- **Validación obligatoria de ubicación** antes de usar el chat.
- **Control de errores con fallback** para respuestas de IA.
- Feedback visual claro en estados de carga o fallo.
- Código estructurado y modular.
- **Commits semánticos** siguiendo el estándar Conventional Commits.
- Variables sensibles excluidas con `.env` y `.gitignore`.
- Hosting en **Netlify** con CI/CD conectado a GitHub.

---

## 🧠 Ejemplo de Interacción

**Usuario:**  
> “¿Va a llover mañana en Medellín?”

**IA (Meteora):**  
```
🌦️ Pronóstico para Medellín mañana:
- Temperatura: 23 °C (máx), 17 °C (mín)
- Probabilidad de lluvia: 68 %
☂️ Lleva paraguas, podría llover por la tarde.
```

---

## 🧩 Integraciones Clave

- **Open-Meteo API:** para obtener datos del clima en tiempo real según las coordenadas.
- **OpenAI API:** para generar respuestas naturales y contextualizadas.
- **Cookies y LocalStorage:** para recordar ubicación y sesiones anteriores.
- **Netlify Hosting:** despliegue continuo desde GitHub.

---

## 👨‍💻 Desarrollado por

**Holman Alba Castro**  
Desarrollador Fullstack (Laravel + Vue.js + IA)  
📧 [albaholman803@gmail.com](mailto:albaholman803@gmail.com)

---

## 📝 Licencia

**MIT License**  
Este proyecto es de uso educativo y demostrativo. Puedes modificarlo y adaptarlo libremente citando la fuente.

---

## 🔮 Implementaciones Futuras

En próximas versiones de **Meteora** se planea ampliar sus capacidades más allá de la ubicación actual del usuario. Algunas mejoras previstas incluyen:

- 🌍 **Consultas multi-ciudad:** permitir al usuario preguntar por el clima en diferentes ciudades o países sin necesidad de cambiar su ubicación física.  
- 🧭 **Selección manual de localización:** agregar un mapa o buscador para establecer ubicaciones personalizadas.  


---

> 🌐 **Demo en producción (Recuerda si demora en responder el API se debe a que tiene que Render confirmar si el app está funcionando así que puede demorar):** [https://meteora-web.netlify.app/](https://meteora-web.netlify.app/)  
> 🧭 **Repositorio oficial:** [https://github.com/holman25/meteora-web](https://github.com/holman25/meteora-web)



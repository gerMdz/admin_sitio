# Admin Alameda

Este proyecto es el panel de administración frontend del sistema **Censo Alameda**, pero sirve como base para api-catálogos, 
desarrollado en **Vue 3**, **PrimeVue (tema Sakai)** y construido con **Vite**.

Su función es interactuar con la API backend de Symfony a través de solicitudes RESTfull protegidas mediante tokens JWT.

---

## 🚀 Tecnologías utilizadas

- **Vue 3** - Framework progresivo de JavaScript
- **PrimeVue** - Biblioteca de componentes UI rica y moderna
- **Vite** - Build tool ultrarrápida para frontend moderno
- **Axios** - Cliente HTTP para integrar la API REST
- **Pinia o Vuex** (según implementación) - Manejo de estado
- **PrimeFlex** - Utilidades CSS para layout y grid

---

## 📦 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/gerMdz/admin_sitio
```

2. Instalar dependencias:

```bash
npm install
```

### Para desarrollo

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

---

## 📋 Configuración de variables de entorno

Antes de iniciar el proyecto debes configurar las variables de entorno.

1. Copiar el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Editar el archivo `.env` según tu entorno:

| Variable | Descripción |
|:---------|:------------|
| `VITE_API_URL` | URL base de la API (ejemplo: `https://127.0.0.1:8000/api`) |
| `VITE_API_PROXY` | URL de destino para proxy en desarrollo (ejemplo: `https://127.0.0.1:8000`) |

**Ejemplo para entorno local**:

```dotenv
VITE_API_URL=https://127.0.0.1:8000/api
VITE_API_PROXY=https://127.0.0.1:8000
```

**Ejemplo para entorno de producción**:

```dotenv
VITE_API_URL=https://api.alameda.ar/api
VITE_API_PROXY=https://api.alameda.ar
```

---

## 💻 Comandos útiles

| Comando | Descripción |
|:--------|:------------|
| `npm run dev` | Levanta el servidor de desarrollo en `http://localhost:5173/` |
| `npm run build` | Construye los archivos listos para producción (`dist/`) |
| `npm run preview` | Previsualiza el proyecto ya compilado |

---

## 📚 Estructura de carpetas

| Carpeta | Descripción |
|:--------|:------------|
| `src/views/` | Vistas principales (por entidad o sección) |
| `src/components/` | Componentes reutilizables |
| `src/api/` | Archivos de integración con la API (servicios) |
| `src/store/` | Gestión de estado (usuarios, autenticación, etc.) |
| `src/router/` | Definición de rutas (protección de rutas privadas) |
| `src/layouts/` | Layouts generales del panel |

---

## 🔒 Autenticación

Este frontend maneja la autenticación usando **JWT**.

- El token JWT se guarda en **LocalStorage** o en el **State**.
- El token se adjunta automáticamente en cada solicitud API usando Axios.

---

## 📝 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.

Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

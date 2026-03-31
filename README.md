# ⚽ Club Atlético Aldosivi — Centro de Datos y Rendimiento

> Dashboard profesional de estadísticas y análisis de rendimiento del Club Atlético Aldosivi en la Liga Profesional de Fútbol (AFA) — Temporada 2026.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF)

---

## 📋 Descripción

Esta aplicación web funciona como un **centro de inteligencia deportiva** para el cuerpo técnico de Aldosivi. Permite:

- 📊 **Visualizar métricas clave** de rendimiento (goles, posesión, xG, duelos, faltas, etc.) comparadas con la media de la liga.
- 📉 **Monitorear el estado de descenso** con tablas de promedios y tabla anual 2026 actualizadas.
- 👥 **Consultar la plantilla** con datos biométricos de cada jugador (altura, peso, perfil, rating).
- 📅 **Revisar partidos** con resultados, formación y detalle por fecha.
- 📄 **Subir informes PDF** que se parsean automáticamente para alimentar la base de datos.
- 🧑‍💼 **Archivo de candidatos DT** — módulo histórico tras la contratación de Israel Damonte.

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript 5 |
| **UI** | Tailwind CSS 4, shadcn/ui, Lucide Icons |
| **Gráficos** | Recharts (Radar, Bar, Pie) |
| **Backend** | API Routes de Next.js (App Router) |
| **Base de datos** | SQLite vía Prisma ORM |
| **Parser PDF** | pdf2json |

## 🚀 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/estadisticas-aldosivi.git
cd estadisticas-aldosivi

# 2. Instalar dependencias
npm install

# 3. Generar el cliente Prisma y crear la base de datos
npx prisma generate
npx prisma db push

# 4. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/
│   │   ├── page.tsx             # Dashboard principal (todas las pestañas)
│   │   ├── layout.tsx           # Metadatos SEO y fuentes
│   │   └── api/
│   │       ├── dashboard/       # GET — estadísticas agregadas desde la DB
│   │       └── upload-report/   # POST — parser de PDF con Regex
│   ├── components/
│   │   ├── UploadButton.tsx     # Componente de subida de archivos
│   │   └── ui/                  # Componentes shadcn/ui
│   ├── hooks/                   # Custom hooks
│   └── lib/                     # Utilidades (Prisma client, helpers)
├── prisma/
│   └── schema.prisma            # Modelos: Match, SquadMatchStat, Player, PlayerMatchStat
├── upload/                      # Directorio para PDFs subidos (no versionado)
├── .agents/                     # Archivos de contexto para agentes IA
│   └── context.md               # Documentación técnica del proyecto
└── public/                      # Archivos estáticos
```

## 📊 Fuentes de Datos

Las estadísticas del dashboard provienen de **dos fuentes verificadas**:
1. **Fichajes.com** — Métricas oficiales de la Liga Profesional 2026.
2. **Informes PDF** — Reportes de análisis procesados por agentes IA y parseados con Regex.

> ⚠️ Los datos del módulo "Candidatos DT" provienen de un análisis previo con Football Manager y se mantienen únicamente como archivo histórico. **No representan datos reales de la liga.**

## 🤖 Guía para Agentes IA

Este repositorio incluye un directorio `.agents/` con documentación de contexto pensada para que cualquier agente IA (Gemini, Claude, GPT, etc.) pueda:

- Entender la arquitectura del proyecto.
- Saber dónde modificar datos estadísticos.
- Conocer las convenciones del código.
- Agregar nuevos partidos o métricas sin romper nada.

Consultá `.agents/context.md` antes de hacer cualquier cambio.

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Ejecuta la build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run db:push` | Sincroniza el schema con la DB |
| `npm run db:generate` | Regenera el cliente Prisma |

## 📜 Licencia

Proyecto privado del Club Atlético Aldosivi — Mar del Plata, Argentina.

---

**🦈 Vamos Tiburón 🟢🟡**

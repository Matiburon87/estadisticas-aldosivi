# Contexto del Proyecto — Agentes IA

> Este documento sirve como guía de referencia rápida para cualquier agente de IA que trabaje en este repositorio.
> Léelo completo antes de hacer modificaciones.

---

## 🏟️ Información General

- **Club:** Club Atlético Aldosivi (Mar del Plata, Argentina)
- **Competencia:** Liga Profesional de Fútbol (AFA) — Temporada 2026
- **DT Actual:** Israel Damonte
- **DT Saliente:** Guillermo Martín Farré
- **Estado deportivo:** Zona de descenso. El equipo ocupa el puesto 29 en la tabla anual y el 28 en promedios.

## 🏗️ Arquitectura

### Stack
- **Framework:** Next.js 16 (App Router) con TypeScript 5
- **Estilos:** Tailwind CSS 4 + shadcn/ui
- **Gráficos:** Recharts
- **Base de datos:** SQLite (local) vía Prisma ORM
- **Parser de informes:** pdf2json con extracción Regex

### Rutas API
| Ruta | Método | Propósito |
|---|---|---|
| `/api/dashboard` | GET | Devuelve estadísticas agregadas desde la DB (goles, posesión, etc.) |
| `/api/upload-report` | POST | Recibe un PDF, lo parsea con Regex y guarda los datos en la DB |

### Base de datos (Prisma Models)
| Modelo | Descripción |
|---|---|
| `Match` | Partidos jugados (fecha, rival, resultado, tipo, competencia) |
| `SquadMatchStat` | Métricas del equipo por partido (goles, tiros, posesión, duelos...) |
| `Player` | Jugadores de la plantilla (nombre, posición, edad, altura, peso) |
| `PlayerMatchStat` | Rendimiento individual por partido (rating, minutos, goles, asistencias) |

## 📄 Archivo Principal: `src/app/page.tsx`

Este archivo contiene **toda la lógica de visualización** del dashboard. Funciona con datos provenientes de dos fuentes:

### Datos Estáticos (arrays en el archivo)
Estos arrays definen las estadísticas que se renderizan directamente. Son la fuente de verdad principal para la UI:

| Variable | Contenido |
|---|---|
| `clubData` | Datos generales del club (nombre, estadio, DT, promedios, puntos) |
| `metricsData` | 12 métricas de rendimiento comparadas con la media de la liga |
| `radarData` | Datos del gráfico radar (Ataque, Defensa, Posesión, Duelos...) |
| `comparisonData` | Comparativa con otros equipos líderes de la liga |
| `promediosData` | Tabla de promedios de descenso (últimos 6 puestos) |
| `tablaAnualData` | Tabla anual 2026 (últimos 6 puestos) |
| `jugadoresDestacados` | Plantilla completa con datos físicos, ratings y partidos |
| `candidatosDT` | Archivo histórico de candidatos a DT (ya contratado Damonte) |
| `resultadosPartidos` | Resultados de los 10 partidos jugados |

### Datos Dinámicos (desde la DB)
El dashboard consulta `/api/dashboard` al montar el componente. Si la DB tiene datos (subidos vía PDF), los muestra; sino, se queda con los arrays estáticos.

## ⚠️ Reglas de Edición para Agentes

1. **NUNCA uses datos de Football Manager como fuente de verdad.** Los datos FM fueron una referencia inicial pero ya fueron reemplazados por datos reales de Fichajes.com.
2. **Siempre verificá con fichajes.com** antes de actualizar métricas: `https://www.fichajes.com/equipo/ca-aldosivi/estadisticas`
3. **Porterías a cero:** Se cuentan SOLO partidos de liga, no Copa Argentina.
4. **Paleta de colores:** Verde oscuro (`green-950`, `emerald-950`) y acentos amarillos (`yellow-400`, `yellow-100`). No usar azul ni slate.
5. **Líder de goles/PJ actual:** Independiente Rivadavia (1.6). Actualizar si cambia la fecha.
6. **El módulo de Candidatos DT** está archivado. Damonte ya fue contratado. No eliminarlo, pero mantenerlo como última pestaña.

## 📊 Cómo Agregar un Nuevo Partido

Para agregar un nuevo partido al dashboard:

1. Localizar el array `resultadosPartidos` en `page.tsx` (~línea 140+).
2. Agregar un objeto con la estructura:
```typescript
{
  fecha: "DD/MM",
  rival: "Nombre del equipo",
  resultado: "X-X",
  tipo: "Local" | "Visitante",
  competencia: "Liga Profesional"
}
```
3. Actualizar `clubData.partidosJugados` incrementando en 1.
4. Recalcular `clubData.diferenciaGol` sumando/restando goles.
5. Si hubo portería a cero, actualizar la métrica correspondiente en `metricsData`.
6. Recalcular las métricas afectadas (goles/PJ, goles concedidos/PJ, etc.).

## 📊 Cómo Actualizar Métricas de Liga

1. Scrapear `https://www.fichajes.com/equipo/ca-aldosivi/estadisticas`
2. Cruzar los valores de: Goles, Tiros a puerta, Posesión, Precisión pases, Duelos, Entradas, Faltas, Goles concedidos, Porterías a cero.
3. Actualizar el array `metricsData` con los nuevos valores, rankings y líderes.
4. Actualizar `radarData` y `comparisonData` si cambian los valores de Aldosivi o los líderes.

## 🎨 Convenciones de Código

- Todos los textos de la UI están en **español**.
- Los comentarios del código están en **español**.
- Las variables usan **camelCase en español** (ej: `partidosJugados`, `golesPorPartido`).
- Los colores siguen la paleta del club: `green-900/950`, `emerald-950`, `yellow-400`.
- Los estados de métricas usan: `"critical"` (rojo), `"warning"` (amarillo), `"good"` (verde).

# Workflow: Actualizar Estadísticas Post-Fecha

> Guía paso a paso para actualizar el dashboard después de que Aldosivi juega un partido.

---

## Prerrequisitos
- Tener acceso a internet para consultar fichajes.com
- Conocer el resultado del partido

## Pasos

### 1. Obtener datos del partido
Consultar el resultado, tipo (Local/Visitante) y fecha en:
`https://www.fichajes.com/equipo/ca-aldosivi/calendario`

### 2. Agregar el partido a `resultadosPartidos`
Abrir `src/app/page.tsx` y localizar el array `resultadosPartidos`.
Agregar un nuevo objeto al final con la estructura:
```typescript
{ fecha: "DD/MM", rival: "Nombre", resultado: "X-X", tipo: "Local" | "Visitante", competencia: "Liga Profesional" }
```

### 3. Actualizar `clubData`
- Incrementar `partidosJugados` en 1
- Recalcular `diferenciaGol` (sumar goles a favor, restar goles en contra)
- Si ganó: sumar 3 a `puntos`. Si empató: sumar 1.

### 4. Actualizar métricas
Scrapear `https://www.fichajes.com/equipo/ca-aldosivi/estadisticas` y actualizar:
- `metricsData` → valores, rankings y líderes afectados
- `radarData` → si cambian significativamente Ataque, Defensa o Posesión
- `comparisonData` → si cambian los equipos líderes

### 5. Actualizar tablas de descenso
- `tablaAnualData` → actualizar puntos y posición de Aldosivi y rivales directos
- `promediosData` → recalcular promedio = (ptsPromedioHistorico + nuevos_pts) / (pjPromedioHistorico + 1)

### 6. Verificar
- Ejecutar `npm run dev`
- Revisar que no haya datos inconsistentes entre pestañas
- Confirmar que porterías a cero cuenta SOLO partidos de liga

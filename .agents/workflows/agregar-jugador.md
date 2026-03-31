# Workflow: Agregar Nuevo Jugador a la Plantilla

> Procedimiento para incorporar un jugador al dashboard.

---

## Pasos

### 1. Obtener datos biométricos
Consultar la ficha del jugador en fichajes.com o en la fuente oficial del club.
Datos necesarios: nombre, posición, edad, altura, peso, perfil (pie hábil/características).

### 2. Agregar al array `jugadoresDestacados`
Abrir `src/app/page.tsx` y localizar el array `jugadoresDestacados`.
Agregar un objeto con la estructura:
```typescript
{
  nombre: "Nombre Completo",
  posicion: "Posición",    // "Portero", "Defensa Central", "Lateral Derecho", "Mediocampista", "Extremo", "Delantero", etc.
  edad: 25,
  altura: "1.80m",
  peso: "75kg",
  rating: 0,               // 0 si aún no jugó
  partidos: 0,
  minutos: 0,
  key: false,              // true si es titular habitual
  perfil: "Descripción"    // Ej: "Rápido / Zurdo", "Mediapunta / Derecha"
}
```

### 3. Actualizar `clubData`
- Incrementar `jugadores` en 1
- Si es extranjero, incrementar `extranjeros` en 1
- Recalcular `edadMedia` si es relevante

### 4. Opcionalmente, agregar a la base de datos
Si se quiere persistir en Prisma:
```bash
npx prisma studio
```
Y agregar el registro manualmente en la tabla `Player`.

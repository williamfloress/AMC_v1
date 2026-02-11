# AMC MVP — Avaluo por Método Comparativo

Proyecto MVP del sistema de Avaluo por Método Comparativo (AMC). Backend NestJS, frontend React + Vite, base de datos PostgreSQL en Supabase.

---

## Base de datos (Supabase) — Migraciones y seed

La base de datos se configura con **Prisma** en `backend`. No versiones el archivo `.env`; usa `.env.example` como plantilla y guarda la `DATABASE_URL` en un gestor de secretos.

### Aplicar migraciones

Desde la raíz del backend:

```bash
cd amc-v1/backend
npx prisma migrate deploy
```

En desarrollo, para crear una nueva migración tras cambiar `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name nombre_descriptivo
```

La `DATABASE_URL` se obtiene en Supabase: Project Settings > Database > Connection string (modo Transaction, puerto 6543, para uso con Prisma).

### Cargar datos de ejemplo (seed)

El seed crea el sector LOS NARANJOS, el catálogo de acabados, las ponderaciones y 15 propiedades de ejemplo. Ejecutar **después** de haber aplicado las migraciones:

```bash
cd amc-v1/backend
npx prisma db seed
```

Para resetear la base y volver a aplicar migraciones y seed:

```bash
npx prisma migrate reset
```

---

## Definition of Done del MVP

El MVP se considera **listo** cuando se cumplan todos los criterios siguientes:

### Carga de datos

- [ ] Un usuario puede **cargar** al menos 15 propiedades comparables con: sector, m², habitaciones, baños, parqueos, acabados (piso, cocina, baño) y precio.

### Inmueble en estudio

- [ ] Un usuario puede **ingresar** el inmueble en estudio: sector, área (m²), acabados (piso, cocina, baño).

### Cálculo y resultados

- [ ] Al presionar **"Calcular"**, el sistema muestra:
  - valor de mercado base;
  - valor de mercado con acabados;
  - cantidad de comparables usados;
  - lista de comparables (precio, m², valor/m², acabados).

### Consistencia

- [ ] La app funciona con datos seedeados y reproduce resultados coherentes con el modelo del Excel/CSV.

---

Documentación detallada: `documentacion/GUIA_DESARROLLO_MVP.md` y `documentacion/ROADMAP_MVP.md`.

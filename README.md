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

---

## Levantar backend y frontend (desde la raíz)

Desde **`amc-v1`** puedes correr ambos en paralelo con un solo comando:

```bash
cd amc-v1
npm run dev
```

Eso inicia el backend (NestJS en http://localhost:3000) y el frontend (Vite en http://localhost:5173) a la vez. Para detenerlos, usa `Ctrl+C` en la misma terminal.

Scripts disponibles en la raíz de `amc-v1`:

| Script         | Descripción                          |
|----------------|--------------------------------------|
| `npm run dev`  | Backend + frontend en paralelo       |
| `npm run dev:backend`  | Solo backend (`start:dev`)   |
| `npm run dev:frontend` | Solo frontend (`dev`)        |

Asegúrate de tener `npm install` ya ejecutado en `backend` y en `frontend` al menos una vez.

---

## Producción (deploy del MVP)

El MVP se despliega con **backend en Railway** y **frontend en Vercel**. La base de datos sigue en **Supabase** (free tier).

### Backend (Railway)

1. Crear un servicio en [Railway](https://railway.app) conectado al repo (por ejemplo la rama `main`).
2. **Root Directory:** `backend`.
3. **Build:** Railway ejecuta `npm run build` por defecto. El script incluye `prisma generate && nest build` para generar el cliente Prisma y compilar NestJS.
4. **Start Command:** `npm run start:prod` o `node dist/main`.
5. **Variables de entorno** (en Railway → Variables):
   - `DATABASE_URL` — connection string de Supabase (pooler, puerto 6543).
   - `DIRECT_URL` — connection string directa de Supabase (puerto 5432).
   - `PORT` — opcional; Railway asigna uno por defecto.
   - `CORS_ORIGIN` — URL del frontend en producción, por ejemplo `https://amc-v1.vercel.app` (debe ser **https** para que el navegador permita las peticiones).
6. En **Networking** → **Public Networking** → **Generate Domain** para obtener la URL pública del API (ej. `https://amcv1-production.up.railway.app`).

### Frontend (Vercel)

1. Crear un proyecto en [Vercel](https://vercel.com) conectado al mismo repo.
2. **Root Directory:** `frontend`.
3. **Build / Output:** dejar la detección automática (Build: `npm run build`, Output: `dist`).
4. **Variable de entorno:**
   - **Nombre:** `VITE_API_BASE_URL` (el código usa este nombre, no `VITE_API_URL`).
   - **Valor:** URL completa del backend en Railway, por ejemplo `https://amcv1-production.up.railway.app` (con `https://`).
5. Tras cada cambio de variables, hacer **Redeploy** para que el build use los nuevos valores.

### Resumen de integración

| Dónde   | Variable            | Valor de ejemplo                                      |
|--------|---------------------|-------------------------------------------------------|
| Railway | `CORS_ORIGIN`       | `https://amc-v1.vercel.app`                           |
| Vercel  | `VITE_API_BASE_URL` | `https://amcv1-production.up.railway.app`            |

Para **desarrollo local** contra el backend en Railway, en `frontend/.env` puedes poner `VITE_API_BASE_URL=https://tu-url.up.railway.app`. Para usar el backend local, deja `VITE_API_BASE_URL=http://localhost:3000` y levanta el backend con `npm run dev:backend`.

---

Documentación detallada: `documentacion/GUIA_DESARROLLO_MVP.md` y `documentacion/ROADMAP_MVP.md`.

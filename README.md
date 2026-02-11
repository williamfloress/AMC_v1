# AMC MVP — Avaluo por Método Comparativo

Proyecto MVP del sistema de Avaluo por Método Comparativo (AMC). Backend NestJS, frontend React + Vite, base de datos PostgreSQL en Supabase.

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


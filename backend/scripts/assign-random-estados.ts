/**
 * Script para asignar estado aleatorio a todas las propiedades existentes.
 * Ejecutar: npx tsx scripts/assign-random-estados.ts
 * (desde amc-v1/backend)
 */
import { PrismaClient, EstadoPropiedad } from '@prisma/client';

const prisma = new PrismaClient();

const ESTADOS: EstadoPropiedad[] = ['disponible', 'reservada', 'alquilada', 'vendida'];

function randomEstado(): EstadoPropiedad {
  return ESTADOS[Math.floor(Math.random() * ESTADOS.length)]!;
}

async function main() {
  const propiedades = await prisma.propiedad.findMany({ select: { id: true } });
  let updated = 0;
  for (const p of propiedades) {
    await prisma.propiedad.update({
      where: { id: p.id },
      data: { estado: randomEstado() },
    });
    updated++;
  }
  console.log(`Actualizadas ${updated} propiedades con estado aleatorio.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

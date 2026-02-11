import { PrismaClient, TipoAcabado } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

const ACABADOS: { tipo: TipoAcabado; nombre: string; puntaje: number }[] = [
  { tipo: 'piso', nombre: 'Terracota', puntaje: 1 },
  { tipo: 'piso', nombre: 'Cerámica', puntaje: 2 },
  { tipo: 'piso', nombre: 'Machiembrado', puntaje: 3 },
  { tipo: 'piso', nombre: 'Porcelanato', puntaje: 4 },
  { tipo: 'piso', nombre: 'Parquet', puntaje: 4 },
  { tipo: 'piso', nombre: 'Marmol', puntaje: 8 },
  { tipo: 'cocina', nombre: 'Fórmica', puntaje: 1 },
  { tipo: 'cocina', nombre: 'Granito', puntaje: 5 },
  { tipo: 'cocina', nombre: 'Cuarzo', puntaje: 6 },
  { tipo: 'cocina', nombre: 'Marmol', puntaje: 8 },
  { tipo: 'bano', nombre: 'Cerámica', puntaje: 2 },
  { tipo: 'bano', nombre: 'Porcelanato', puntaje: 4 },
  { tipo: 'bano', nombre: 'Marmol', puntaje: 8 },
];

const PONDERACIONES: { tipo: TipoAcabado; ponderacion: number }[] = [
  { tipo: 'piso', ponderacion: 7 },
  { tipo: 'bano', ponderacion: 4 },
  { tipo: 'cocina', ponderacion: 3 },
];

// 15 propiedades de ejemplo basadas en documentacion/AMC.csv (LOS NARANJOS)
const PROPIEDADES_SEED = [
  { precio: 75000, area: 126, habitaciones: 3, banos: 2, parqueos: 2, columnaAux: 47, piso: 'Terracota', cocina: 'Fórmica', bano: 'Cerámica', cod: '817949404' },
  { precio: 80000, area: 120, habitaciones: 4, banos: 2, parqueos: 2, columnaAux: 30, piso: 'Machiembrado', cocina: 'Granito', bano: 'Cerámica', cod: '818532602' },
  { precio: 97000, area: 126, habitaciones: 3, banos: 3, parqueos: 2, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '810620930' },
  { precio: 97000, area: 127, habitaciones: 3, banos: 3, parqueos: 2, columnaAux: 39, piso: 'Cerámica', cocina: 'Granito', bano: 'Cerámica', cod: '812059458' },
  { precio: 97500, area: 121, habitaciones: 3, banos: 3, parqueos: 1, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Cerámica', cod: '816411140' },
  { precio: 99000, area: 127, habitaciones: 3, banos: 3, parqueos: 2, columnaAux: 25, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '812472290' },
  { precio: 100000, area: 121, habitaciones: 3, banos: 3, parqueos: 1, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Cerámica', cod: '813355826' },
  { precio: 110000, area: 124, habitaciones: 4, banos: 3, parqueos: 2, columnaAux: 43, piso: 'Marmol', cocina: 'Cuarzo', bano: 'Cerámica', cod: '766362823' },
  { precio: 115000, area: 130, habitaciones: 3, banos: 2, parqueos: 2, columnaAux: 14, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '817491534' },
  { precio: 115000, area: 130, habitaciones: 3, banos: 2, parqueos: 2, columnaAux: 44, piso: 'Porcelanato', cocina: 'Granito', bano: 'Cerámica', cod: '815960024' },
  { precio: 125000, area: 130.65, habitaciones: 3, banos: 3, parqueos: 1, columnaAux: 44, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '814406560' },
  { precio: 130000, area: 130, habitaciones: 3, banos: 3, parqueos: 2, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '766224505' },
  { precio: 160000, area: 130.65, habitaciones: 3, banos: 3, parqueos: 2, columnaAux: 25, piso: 'Porcelanato', cocina: 'Cuarzo', bano: 'Porcelanato', cod: '816566208' },
  { precio: 165000, area: 124, habitaciones: 3, banos: 3, parqueos: 2, columnaAux: 42, piso: 'Marmol', cocina: 'Marmol', bano: 'Marmol', cod: '817403868' },
  { precio: 165000, area: 116, habitaciones: 3, banos: 3, parqueos: 2, columnaAux: 16, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '813442820' },
];

async function main() {
  await prisma.propiedad.deleteMany();
  await prisma.acabado.deleteMany();
  await prisma.ponderacionAcabado.deleteMany();
  await prisma.sector.deleteMany();

  const sector = await prisma.sector.create({
    data: { nombre: 'LOS NARANJOS' },
  });

  await prisma.acabado.createMany({ data: ACABADOS });
  const acabados = await prisma.acabado.findMany();
  const acabadoByTipoNombre = new Map<string, number>();
  for (const a of acabados) {
    acabadoByTipoNombre.set(`${a.tipo}:${a.nombre}`, a.id);
  }

  for (const p of PONDERACIONES) {
    await prisma.ponderacionAcabado.create({ data: p });
  }

  for (const row of PROPIEDADES_SEED) {
    const acabadoPisoId = acabadoByTipoNombre.get(`piso:${row.piso}`);
    const acabadoCocinaId = acabadoByTipoNombre.get(`cocina:${row.cocina}`);
    const acabadoBanoId = acabadoByTipoNombre.get(`bano:${row.bano}`);
    if (acabadoPisoId == null || acabadoCocinaId == null || acabadoBanoId == null) {
      throw new Error(`Acabado no encontrado: piso=${row.piso} cocina=${row.cocina} bano=${row.bano}`);
    }
    await prisma.propiedad.create({
      data: {
        sectorId: sector.id,
        precio: row.precio,
        areaConstruccionM2: row.area,
        habitaciones: row.habitaciones,
        banos: row.banos,
        parqueos: row.parqueos,
        acabadoPisoId,
        acabadoCocinaId,
        acabadoBanoId,
        portal: 'Mercadolibre',
        codPublicacion: row.cod,
        columnaAux: row.columnaAux,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

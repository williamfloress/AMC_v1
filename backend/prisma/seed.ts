import { PrismaClient, TipoAcabado, EstadoPropiedad } from '@prisma/client';

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

const ESTADOS: EstadoPropiedad[] = ['disponible', 'reservada', 'alquilada', 'vendida'];
function randomEstado(): EstadoPropiedad {
  return ESTADOS[Math.floor(Math.random() * ESTADOS.length)]!;
}

type PropSeed = {
  precio: number;
  area: number;
  habitaciones: number;
  banos: number;
  parqueos: number;
  anio: number | null;
  columnaAux: number;
  piso: string;
  cocina: string;
  bano: string;
  cod: string;
};

// Propiedades base (LOS NARANJOS) + más para otros sectores
const PROPIEDADES_LOS_NARANJOS: PropSeed[] = [
  { precio: 75000, area: 126, habitaciones: 3, banos: 2, parqueos: 2, anio: 2010, columnaAux: 47, piso: 'Terracota', cocina: 'Fórmica', bano: 'Cerámica', cod: '817949404' },
  { precio: 80000, area: 120, habitaciones: 4, banos: 2, parqueos: 2, anio: 2012, columnaAux: 30, piso: 'Machiembrado', cocina: 'Granito', bano: 'Cerámica', cod: '818532602' },
  { precio: 97000, area: 126, habitaciones: 3, banos: 3, parqueos: 2, anio: 2015, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '810620930' },
  { precio: 97000, area: 127, habitaciones: 3, banos: 3, parqueos: 2, anio: 2014, columnaAux: 39, piso: 'Cerámica', cocina: 'Granito', bano: 'Cerámica', cod: '812059458' },
  { precio: 97500, area: 121, habitaciones: 3, banos: 3, parqueos: 1, anio: 2015, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Cerámica', cod: '816411140' },
  { precio: 99000, area: 127, habitaciones: 3, banos: 3, parqueos: 2, anio: 2016, columnaAux: 25, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '812472290' },
  { precio: 100000, area: 121, habitaciones: 3, banos: 3, parqueos: 1, anio: 2015, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Cerámica', cod: '813355826' },
  { precio: 110000, area: 124, habitaciones: 4, banos: 3, parqueos: 2, anio: 2018, columnaAux: 43, piso: 'Marmol', cocina: 'Cuarzo', bano: 'Cerámica', cod: '766362823' },
  { precio: 115000, area: 130, habitaciones: 3, banos: 2, parqueos: 2, anio: 2017, columnaAux: 14, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '817491534' },
  { precio: 115000, area: 130, habitaciones: 3, banos: 2, parqueos: 2, anio: 2016, columnaAux: 44, piso: 'Porcelanato', cocina: 'Granito', bano: 'Cerámica', cod: '815960024' },
  { precio: 125000, area: 130.65, habitaciones: 3, banos: 3, parqueos: 1, anio: 2019, columnaAux: 44, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '814406560' },
  { precio: 130000, area: 130, habitaciones: 3, banos: 3, parqueos: 2, anio: 2018, columnaAux: 39, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '766224505' },
  { precio: 160000, area: 130.65, habitaciones: 3, banos: 3, parqueos: 2, anio: 2020, columnaAux: 25, piso: 'Porcelanato', cocina: 'Cuarzo', bano: 'Porcelanato', cod: '816566208' },
  { precio: 165000, area: 124, habitaciones: 3, banos: 3, parqueos: 2, anio: 2021, columnaAux: 42, piso: 'Marmol', cocina: 'Marmol', bano: 'Marmol', cod: '817403868' },
  { precio: 165000, area: 116, habitaciones: 3, banos: 3, parqueos: 2, anio: 2019, columnaAux: 16, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: '813442820' },
];

const PROPIEDADES_CENTRO: PropSeed[] = [
  { precio: 85000, area: 95, habitaciones: 2, banos: 1, parqueos: 1, anio: 2008, columnaAux: 0, piso: 'Cerámica', cocina: 'Fórmica', bano: 'Cerámica', cod: 'CEN-001' },
  { precio: 120000, area: 110, habitaciones: 3, banos: 2, parqueos: 1, anio: 2015, columnaAux: 0, piso: 'Porcelanato', cocina: 'Granito', bano: 'Cerámica', cod: 'CEN-002' },
  { precio: 145000, area: 125, habitaciones: 3, banos: 2, parqueos: 2, anio: 2019, columnaAux: 0, piso: 'Porcelanato', cocina: 'Cuarzo', bano: 'Porcelanato', cod: 'CEN-003' },
  { precio: 98000, area: 100, habitaciones: 2, banos: 2, parqueos: 0, anio: 2012, columnaAux: 0, piso: 'Machiembrado', cocina: 'Granito', bano: 'Cerámica', cod: 'CEN-004' },
  { precio: 132000, area: 118, habitaciones: 3, banos: 2, parqueos: 1, anio: 2017, columnaAux: 0, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: 'CEN-005' },
];

const PROPIEDADES_ZONA_NORTE: PropSeed[] = [
  { precio: 92000, area: 105, habitaciones: 3, banos: 2, parqueos: 2, anio: 2014, columnaAux: 0, piso: 'Cerámica', cocina: 'Granito', bano: 'Cerámica', cod: 'ZN-001' },
  { precio: 138000, area: 128, habitaciones: 4, banos: 3, parqueos: 2, anio: 2020, columnaAux: 0, piso: 'Porcelanato', cocina: 'Cuarzo', bano: 'Porcelanato', cod: 'ZN-002' },
  { precio: 155000, area: 135, habitaciones: 4, banos: 3, parqueos: 2, anio: 2021, columnaAux: 0, piso: 'Marmol', cocina: 'Marmol', bano: 'Marmol', cod: 'ZN-003' },
];

const PROPIEDADES_MIRAFLORES: PropSeed[] = [
  { precio: 180000, area: 98, habitaciones: 2, banos: 2, parqueos: 1, anio: 2018, columnaAux: 0, piso: 'Porcelanato', cocina: 'Cuarzo', bano: 'Porcelanato', cod: 'MIR-001' },
  { precio: 220000, area: 115, habitaciones: 3, banos: 2, parqueos: 2, anio: 2020, columnaAux: 0, piso: 'Marmol', cocina: 'Marmol', bano: 'Marmol', cod: 'MIR-002' },
  { precio: 195000, area: 105, habitaciones: 3, banos: 2, parqueos: 1, anio: 2019, columnaAux: 0, piso: 'Porcelanato', cocina: 'Cuarzo', bano: 'Cerámica', cod: 'MIR-003' },
];

const PROPIEDADES_BARRANCO: PropSeed[] = [
  { precio: 170000, area: 102, habitaciones: 3, banos: 2, parqueos: 1, anio: 2017, columnaAux: 0, piso: 'Porcelanato', cocina: 'Granito', bano: 'Porcelanato', cod: 'BAR-001' },
  { precio: 205000, area: 120, habitaciones: 3, banos: 3, parqueos: 2, anio: 2021, columnaAux: 0, piso: 'Marmol', cocina: 'Cuarzo', bano: 'Porcelanato', cod: 'BAR-002' },
];

async function main() {
  await prisma.propiedad.deleteMany();
  await prisma.acabado.deleteMany();
  await prisma.ponderacionAcabado.deleteMany();
  await prisma.sector.deleteMany();

  // Sectores de la región caraqueña (Venezuela)
  const sectoresData = [
    { nombre: 'ALTAMIRA' },
    { nombre: 'CHACAO' },
    { nombre: 'LOS PALOS GRANDES' },
    { nombre: 'LA CASTELLANA' },
    { nombre: 'EL ROSAL' },
    { nombre: 'LAS MERCEDES' },
    { nombre: 'SABANA GRANDE' },
    { nombre: 'SAN BERNARDINO' },
  ];
  await prisma.sector.createMany({ data: sectoresData, skipDuplicates: true });

  const sectores = await prisma.sector.findMany({ orderBy: { id: 'asc' } });
  const sectorByName = new Map(sectores.map((s) => [s.nombre, s]));

  await prisma.acabado.createMany({ data: ACABADOS });
  const acabados = await prisma.acabado.findMany();
  const acabadoByTipoNombre = new Map<string, number>();
  for (const a of acabados) {
    acabadoByTipoNombre.set(`${a.tipo}:${a.nombre}`, a.id);
  }

  for (const p of PONDERACIONES) {
    await prisma.ponderacionAcabado.create({ data: p });
  }

  const sectorRows: { sectorNombre: string; rows: PropSeed[] }[] = [
    { sectorNombre: 'ALTAMIRA', rows: PROPIEDADES_LOS_NARANJOS },
    { sectorNombre: 'CHACAO', rows: PROPIEDADES_CENTRO },
    { sectorNombre: 'LOS PALOS GRANDES', rows: PROPIEDADES_ZONA_NORTE },
    { sectorNombre: 'LA CASTELLANA', rows: PROPIEDADES_MIRAFLORES },
    { sectorNombre: 'EL ROSAL', rows: PROPIEDADES_BARRANCO },
  ];

  for (const { sectorNombre, rows } of sectorRows) {
    const sector = sectorByName.get(sectorNombre);
    if (!sector) continue;
    for (const row of rows) {
      const acabadoPisoId = acabadoByTipoNombre.get(`piso:${row.piso}`);
      const acabadoCocinaId = acabadoByTipoNombre.get(`cocina:${row.cocina}`);
      const acabadoBanoId = acabadoByTipoNombre.get(`bano:${row.bano}`);
      if (acabadoPisoId == null || acabadoCocinaId == null || acabadoBanoId == null) continue;
      await prisma.propiedad.create({
        data: {
          sectorId: sector.id,
          precio: row.precio,
          areaConstruccionM2: row.area,
          habitaciones: row.habitaciones,
          banos: row.banos,
          parqueos: row.parqueos,
          anioConstruccion: row.anio ?? null,
          acabadoPisoId,
          acabadoCocinaId,
          acabadoBanoId,
          estado: randomEstado(),
          portal: 'Seed',
          codPublicacion: row.cod,
          columnaAux: row.columnaAux,
        },
      });
    }
  }

  console.log('Seed completado: sectores y propiedades con estado aleatorio.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

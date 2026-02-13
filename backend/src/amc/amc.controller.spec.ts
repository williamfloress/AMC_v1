import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('AmcController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /amc/run devuelve 201 con valor base, valor con acabados, estadísticas y comparables', async () => {
    const body = {
      sectorId: 1,
      areaM2: 128,
      habitaciones: 3,
      banos: 2,
      parqueos: 2,
      finishPisoId: 1,
      finishCocinaId: 2,
      finishBanoId: 1,
    };

    const res = await request(app.getHttpServer())
      .post('/amc/run')
      .send(body)
      .expect(201);

    expect(res.body).toMatchObject({
      valorBase: expect.any(Number),
      valorConAcabados: expect.any(Number),
      promedioValorM2: expect.any(Number),
      medianaValorM2: expect.any(Number),
      desviacionEstandarValorM2: expect.any(Number),
      tasaDesviacion: expect.any(Number),
      cantidadComparables: expect.any(Number),
      promedioPrecioComparables: expect.any(Number),
      medianaPrecioComparables: expect.any(Number),
      promedioAcabadoComparables: expect.any(Number),
      desviacionEstandarAcabados: expect.any(Number),
      tasaDesviacionAcabados: expect.any(Number),
      comparables: expect.any(Array),
    });
    expect(res.body.cantidadComparables).toBeGreaterThan(0);
    expect(res.body.comparables.length).toBe(res.body.cantidadComparables);
    expect(res.body.comparables[0]).toMatchObject({
      id: expect.any(Number),
      precio: expect.any(Number),
      areaConstruccionM2: expect.any(Number),
      valorM2: expect.any(Number),
      promedioAcabado: expect.any(Number),
    });
  });

  it('POST /amc/run con IDs de acabado inexistentes devuelve 400', async () => {
    const body = {
      sectorId: 1,
      areaM2: 128,
      habitaciones: 3,
      banos: 2,
      parqueos: 2,
      finishPisoId: 999,
      finishCocinaId: 2,
      finishBanoId: 1,
    };

    await request(app.getHttpServer())
      .post('/amc/run')
      .send(body)
      .expect(400);
  });

  it('POST /amc/run sin comparables (sector/área sin datos) devuelve 400', async () => {
    const body = {
      sectorId: 999,
      areaM2: 50,
      habitaciones: 2,
      banos: 1,
      parqueos: 1,
      finishPisoId: 1,
      finishCocinaId: 2,
      finishBanoId: 1,
    };

    await request(app.getHttpServer())
      .post('/amc/run')
      .send(body)
      .expect(400);
  });
});

function mockPrismaService() {
  const sector = { id: 1, nombre: 'LOS NARANJOS' };
  const acabado = (id: number, nombre: string, puntaje: number) => ({
    id,
    nombre,
    puntaje,
  });
  const ponderaciones = [
    { tipo: 'piso', ponderacion: 7 },
    { tipo: 'cocina', ponderacion: 3 },
    { tipo: 'bano', ponderacion: 4 },
  ];
  const propiedades = [
    {
      id: 1,
      sectorId: 1,
      sector: { id: 1, nombre: 'LOS NARANJOS' },
      latitud: null,
      longitud: null,
      precio: 115000,
      areaConstruccionM2: 130,
      habitaciones: 3,
      banos: 2,
      parqueos: 2,
      anioConstruccion: null,
      estado: 'disponible',
      acabadoPiso: acabado(1, 'Porcelanato', 4),
      acabadoCocina: acabado(2, 'Granito', 5),
      acabadoBano: acabado(1, 'Cerámica', 2),
    },
    {
      id: 2,
      sectorId: 1,
      sector: { id: 1, nombre: 'LOS NARANJOS' },
      latitud: null,
      longitud: null,
      precio: 125000,
      areaConstruccionM2: 130.65,
      habitaciones: 3,
      banos: 3,
      parqueos: 1,
      anioConstruccion: null,
      estado: 'disponible',
      acabadoPiso: acabado(1, 'Porcelanato', 4),
      acabadoCocina: acabado(2, 'Granito', 5),
      acabadoBano: acabado(2, 'Porcelanato', 4),
    },
  ];

  return {
    sector: { findMany: () => Promise.resolve([sector]) },
    ponderacionAcabado: { findMany: () => Promise.resolve(ponderaciones) },
    acabado: {
      findUnique: ({ where }: { where: { id: number } }) =>
        Promise.resolve(
          where.id <= 2
            ? { id: where.id, nombre: 'Test', tipo: 'piso', puntaje: 4 }
            : null,
        ),
    },
    propiedad: {
      findMany: ({ where }: { where: { sectorId: number; areaConstruccionM2?: { gte: number; lte: number } } }) =>
        Promise.resolve(
          where.sectorId === 999 || (where.areaConstruccionM2 && where.areaConstruccionM2.gte > 200)
            ? []
            : propiedades,
        ),
    },
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
  } as unknown as PrismaService;
}

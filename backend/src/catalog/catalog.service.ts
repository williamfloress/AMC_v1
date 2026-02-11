import { Injectable } from '@nestjs/common';
import { TipoAcabado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllSectors() {
    return this.prisma.sector.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findAllFinishes() {
    return this.prisma.acabado.findMany({
      orderBy: [{ tipo: 'asc' }, { puntaje: 'asc' }, { nombre: 'asc' }],
    });
  }

  async findFinishesByType(tipo: TipoAcabado) {
    return this.prisma.acabado.findMany({
      where: { tipo },
      orderBy: [{ puntaje: 'asc' }, { nombre: 'asc' }],
    });
  }

  async findFinishWeights() {
    return this.prisma.ponderacionAcabado.findMany({
      orderBy: { tipo: 'asc' },
    });
  }
}

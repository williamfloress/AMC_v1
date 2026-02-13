import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TipoAcabado } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllSectors() {
    return this.prisma.sector.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async createSector(dto: CreateSectorDto) {
    try {
      return await this.prisma.sector.create({
        data: {
          nombre: dto.nombre.trim(),
          ...(dto.latitud != null && { latitud: dto.latitud }),
          ...(dto.longitud != null && { longitud: dto.longitud }),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ya existe un sector con ese nombre');
      }
      throw e;
    }
  }

  async updateSector(id: number, dto: UpdateSectorDto) {
    const sector = await this.prisma.sector.findUnique({ where: { id } });
    if (!sector) throw new NotFoundException(`Sector con id ${id} no encontrado`);
    try {
      const data: { nombre?: string; latitud?: number; longitud?: number } = {};
      if (dto.nombre !== undefined) data.nombre = dto.nombre.trim();
      if (dto.latitud !== undefined) data.latitud = dto.latitud;
      if (dto.longitud !== undefined) data.longitud = dto.longitud;
      return await this.prisma.sector.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ya existe un sector con ese nombre');
      }
      throw e;
    }
  }

  async removeSector(id: number) {
    const sector = await this.prisma.sector.findUnique({ where: { id }, include: { _count: { select: { propiedades: true } } } });
    if (!sector) throw new NotFoundException(`Sector con id ${id} no encontrado`);
    if (sector._count.propiedades > 0) {
      throw new ConflictException('No se puede eliminar el sector porque tiene propiedades asociadas');
    }
    return this.prisma.sector.delete({ where: { id } });
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

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { GetPropertiesQueryDto } from './dto/get-properties-query.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePropertyDto) {
    try {
      return await this.prisma.propiedad.create({
        data: {
          sectorId: dto.sectorId,
          precio: dto.precio,
          areaConstruccionM2: dto.areaConstruccionM2,
          habitaciones: dto.habitaciones,
          banos: dto.banos,
          parqueos: dto.parqueos,
          acabadoPisoId: dto.acabadoPisoId,
          acabadoCocinaId: dto.acabadoCocinaId,
          acabadoBanoId: dto.acabadoBanoId,
          portal: dto.portal ?? null,
          codPublicacion: dto.codPublicacion ?? null,
          columnaAux: dto.columnaAux ?? null,
        },
        include: this.includeRelations(),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('codPublicacion ya existe');
        if (e.code === 'P2003') throw new BadRequestException('sectorId o algún acabadoId no existe');
      }
      throw e;
    }
  }

  async findAll(query: GetPropertiesQueryDto) {
    const where: Prisma.PropiedadWhereInput = {};
    if (query.sectorId != null) where.sectorId = query.sectorId;
    if (query.minArea != null || query.maxArea != null) {
      where.areaConstruccionM2 = {};
      if (query.minArea != null) where.areaConstruccionM2.gte = query.minArea;
      if (query.maxArea != null) where.areaConstruccionM2.lte = query.maxArea;
    }
    if (query.minPrecio != null || query.maxPrecio != null) {
      where.precio = {};
      if (query.minPrecio != null) where.precio.gte = query.minPrecio;
      if (query.maxPrecio != null) where.precio.lte = query.maxPrecio;
    }

    return this.prisma.propiedad.findMany({
      where,
      include: this.includeRelations(),
      orderBy: [{ sectorId: 'asc' }, { precio: 'asc' }],
    });
  }

  async findOne(id: number) {
    const prop = await this.prisma.propiedad.findUnique({
      where: { id },
      include: this.includeRelations(),
    });
    if (!prop) throw new NotFoundException(`Propiedad con id ${id} no encontrada`);
    return prop;
  }

  async update(id: number, dto: UpdatePropertyDto) {
    await this.findOne(id);
    try {
      return await this.prisma.propiedad.update({
        where: { id },
        data: {
          ...(dto.sectorId !== undefined && { sectorId: dto.sectorId }),
          ...(dto.precio !== undefined && { precio: dto.precio }),
          ...(dto.areaConstruccionM2 !== undefined && { areaConstruccionM2: dto.areaConstruccionM2 }),
          ...(dto.habitaciones !== undefined && { habitaciones: dto.habitaciones }),
          ...(dto.banos !== undefined && { banos: dto.banos }),
          ...(dto.parqueos !== undefined && { parqueos: dto.parqueos }),
          ...(dto.acabadoPisoId !== undefined && { acabadoPisoId: dto.acabadoPisoId }),
          ...(dto.acabadoCocinaId !== undefined && { acabadoCocinaId: dto.acabadoCocinaId }),
          ...(dto.acabadoBanoId !== undefined && { acabadoBanoId: dto.acabadoBanoId }),
          ...(dto.portal !== undefined && { portal: dto.portal }),
          ...(dto.codPublicacion !== undefined && { codPublicacion: dto.codPublicacion }),
          ...(dto.columnaAux !== undefined && { columnaAux: dto.columnaAux }),
        },
        include: this.includeRelations(),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('codPublicacion ya existe');
        if (e.code === 'P2003') throw new BadRequestException('sectorId o algún acabadoId no existe');
      }
      throw e;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.propiedad.delete({ where: { id } });
    return { deleted: true, id };
  }

  private includeRelations() {
    return {
      sector: { select: { id: true, nombre: true } },
      acabadoPiso: { select: { id: true, tipo: true, nombre: true, puntaje: true } },
      acabadoCocina: { select: { id: true, tipo: true, nombre: true, puntaje: true } },
      acabadoBano: { select: { id: true, tipo: true, nombre: true, puntaje: true } },
    } as const;
  }
}

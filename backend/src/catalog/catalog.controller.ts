import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { GetFinishesQueryDto } from './dto/get-finishes-query.dto';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('sectors')
  @ApiOperation({ summary: 'Listar sectores' })
  @ApiResponse({ status: 200, description: 'Lista de sectores ordenados por nombre' })
  getSectors() {
    return this.catalogService.findAllSectors();
  }

  @Post('sectors')
  @ApiOperation({ summary: 'Crear sector' })
  @ApiResponse({ status: 201, description: 'Sector creado' })
  @ApiResponse({ status: 409, description: 'Ya existe un sector con ese nombre' })
  createSector(@Body() dto: CreateSectorDto) {
    return this.catalogService.createSector(dto);
  }

  @Patch('sectors/:id')
  @ApiOperation({ summary: 'Actualizar sector' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Sector actualizado' })
  @ApiResponse({ status: 404, description: 'Sector no encontrado' })
  @ApiResponse({ status: 409, description: 'Nombre duplicado' })
  updateSector(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSectorDto) {
    return this.catalogService.updateSector(id, dto);
  }

  @Delete('sectors/:id')
  @ApiOperation({ summary: 'Eliminar sector' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Sector eliminado' })
  @ApiResponse({ status: 404, description: 'Sector no encontrado' })
  @ApiResponse({ status: 409, description: 'Sector tiene propiedades asociadas' })
  removeSector(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.removeSector(id);
  }

  @Get('finishes')
  @ApiOperation({ summary: 'Listar acabados (opcionalmente por tipo)' })
  @ApiResponse({ status: 200, description: 'Lista de acabados. Si type está presente, filtrados por piso|cocina|bano' })
  getFinishes(@Query() query: GetFinishesQueryDto) {
    if (query.type) {
      return this.catalogService.findFinishesByType(query.type);
    }
    return this.catalogService.findAllFinishes();
  }

  @Get('finish-weights')
  @ApiOperation({ summary: 'Listar ponderaciones de acabados' })
  @ApiResponse({ status: 200, description: 'Ponderación por tipo (piso, cocina, bano)' })
  getFinishWeights() {
    return this.catalogService.findFinishWeights();
  }
}

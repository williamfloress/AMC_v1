import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { GetFinishesQueryDto } from './dto/get-finishes-query.dto';

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

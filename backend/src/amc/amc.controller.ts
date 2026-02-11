import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AmcService, AmcResult } from './amc.service';
import { RunAmcDto } from './dto/run-amc.dto';

@ApiTags('amc')
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post('run')
  @ApiOperation({ summary: 'Ejecutar AMC para el inmueble en estudio' })
  @ApiResponse({ status: 201, description: 'Resultado del cálculo AMC' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o sin comparables' })
  run(@Body() dto: RunAmcDto): Promise<AmcResult> {
    return this.amcService.run(dto);
  }
}

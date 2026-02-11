import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPropertiesQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por sector' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sectorId?: number;

  @ApiPropertyOptional({ description: 'Área mínima (m²)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minArea?: number;

  @ApiPropertyOptional({ description: 'Área máxima (m²)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxArea?: number;

  @ApiPropertyOptional({ description: 'Precio mínimo' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrecio?: number;

  @ApiPropertyOptional({ description: 'Precio máximo' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrecio?: number;
}

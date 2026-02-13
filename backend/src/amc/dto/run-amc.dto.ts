import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, IsOptional, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RunAmcDto {
  @ApiProperty({ example: 1, description: 'ID del sector' })
  @IsInt()
  @Type(() => Number)
  sectorId!: number;

  @ApiProperty({ example: 128, description: 'Área del inmueble en estudio (m²)' })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  areaM2!: number;

  @ApiProperty({ example: 3, description: 'Cantidad de cuartos/habitaciones' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  habitaciones!: number;

  @ApiProperty({ example: 2, description: 'Cantidad de baños' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  banos!: number;

  @ApiProperty({ example: 2, description: 'Número de estacionamientos' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  parqueos!: number;

  @ApiPropertyOptional({ example: 2015, description: 'Año de construcción (opcional)' })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  anioConstruccion?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del acabado de piso (opcional)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  finishPisoId?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID del acabado de cocina (opcional)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  finishCocinaId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del acabado de baño (opcional)' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  finishBanoId?: number;
}

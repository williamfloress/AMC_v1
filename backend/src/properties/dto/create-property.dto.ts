import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty({ example: 1, description: 'ID del sector' })
  @IsInt()
  @Type(() => Number)
  sectorId!: number;

  @ApiProperty({ example: 97500, description: 'Precio en moneda local' })
  @IsNumber()
  @Min(0.01, { message: 'precio debe ser mayor a 0' })
  @Type(() => Number)
  precio!: number;

  @ApiProperty({ example: 121, description: 'Área construida en m²' })
  @IsNumber()
  @Min(0.01, { message: 'areaConstruccionM2 debe ser mayor a 0' })
  @Type(() => Number)
  areaConstruccionM2!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  habitaciones!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  banos!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  parqueos!: number;

  @ApiProperty({ example: 1, description: 'ID del acabado de piso' })
  @IsInt()
  @Type(() => Number)
  acabadoPisoId!: number;

  @ApiProperty({ example: 2, description: 'ID del acabado de cocina' })
  @IsInt()
  @Type(() => Number)
  acabadoCocinaId!: number;

  @ApiProperty({ example: 1, description: 'ID del acabado de baño' })
  @IsInt()
  @Type(() => Number)
  acabadoBanoId!: number;

  @ApiPropertyOptional({ example: 'Mercadolibre' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  portal?: string;

  @ApiPropertyOptional({ example: '816411140', description: 'Código único de publicación' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  codPublicacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  columnaAux?: number;
}

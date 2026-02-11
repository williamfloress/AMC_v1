import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
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

  @ApiProperty({ example: 1, description: 'ID del acabado de piso del inmueble en estudio' })
  @IsInt()
  @Type(() => Number)
  finishPisoId!: number;

  @ApiProperty({ example: 2, description: 'ID del acabado de cocina' })
  @IsInt()
  @Type(() => Number)
  finishCocinaId!: number;

  @ApiProperty({ example: 1, description: 'ID del acabado de baño' })
  @IsInt()
  @Type(() => Number)
  finishBanoId!: number;
}

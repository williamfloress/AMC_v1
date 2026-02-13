import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSectorDto {
  @ApiProperty({ example: 'LOS NARANJOS', description: 'Nombre del sector' })
  @IsString()
  @MaxLength(255)
  nombre!: string;

  @ApiPropertyOptional({ description: 'Latitud del centro del sector (opcional)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitud?: number;

  @ApiPropertyOptional({ description: 'Longitud del centro del sector (opcional)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitud?: number;
}

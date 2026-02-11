import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TipoAcabado } from '@prisma/client';

export class GetFinishesQueryDto {
  @ApiPropertyOptional({
    enum: TipoAcabado,
    description: 'Filtrar acabados por tipo: piso, cocina o bano',
    example: 'piso',
  })
  @IsEnum(TipoAcabado, {
    message: 'type debe ser uno de: piso, cocina, bano',
  })
  type?: TipoAcabado;
}

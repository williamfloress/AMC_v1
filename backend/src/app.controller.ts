import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root / health' })
  getHello(): { ok: boolean; message: string } {
    return { ok: true, message: 'AMC API' };
  }
}

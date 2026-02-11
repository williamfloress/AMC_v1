import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { PropertiesModule } from './properties/properties.module';
import { AmcModule } from './amc/amc.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CatalogModule,
    PropertiesModule,
    AmcModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

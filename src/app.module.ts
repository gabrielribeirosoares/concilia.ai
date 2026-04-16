import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ImportsModule } from './imports/imports.module';

@Module({
  imports: [PrismaModule, ImportsModule],
})
export class AppModule {}
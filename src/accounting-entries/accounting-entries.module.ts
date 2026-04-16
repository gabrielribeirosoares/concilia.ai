import { Module } from '@nestjs/common';
import { AccountingEntriesService } from './accounting-entries.service';
import { AccountingEntriesController } from './accounting-entries.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AccountingEntriesController],
  providers: [AccountingEntriesService],
  exports: [AccountingEntriesService],
})
export class AccountingEntriesModule {}

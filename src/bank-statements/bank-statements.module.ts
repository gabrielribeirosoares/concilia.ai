import { Module } from '@nestjs/common';
import { BankStatementsService } from './bank-statements.service';
import { BankStatementsController } from './bank-statements.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BankStatementsController],
  providers: [BankStatementsService],
  exports: [BankStatementsService],
})
export class BankStatementsModule {}

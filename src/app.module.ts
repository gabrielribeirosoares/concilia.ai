import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BankStatementsModule } from './bank-statements/bank-statements.module';
import { AccountingEntriesModule } from './accounting-entries/accounting-entries.module';
import { ReconciliationsModule } from './reconciliations/reconciliations.module';

@Module({
  imports: [
    PrismaModule,
    BankStatementsModule,
    AccountingEntriesModule,
    ReconciliationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

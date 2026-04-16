import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

export interface ParsedAccountingEntry {
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  accountCode?: string;
  documentRef?: string;
}

@Injectable()
export class AccountingEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async importEntries(companyId: string, entries: ParsedAccountingEntry[]) {
    const created = await this.prisma.accountingEntry.createMany({
      data: entries.map((e) => ({
        companyId,
        date: e.date,
        description: e.description,
        amount: e.amount,
        type: e.type,
        accountCode: e.accountCode,
        documentRef: e.documentRef,
      })),
      skipDuplicates: true,
    });
    return created;
  }

  async findByCompanyAndPeriod(companyId: string, start: Date, end: Date) {
    return this.prisma.accountingEntry.findMany({
      where: {
        companyId,
        date: { gte: start, lte: end },
      },
      orderBy: { date: 'asc' },
    });
  }
}

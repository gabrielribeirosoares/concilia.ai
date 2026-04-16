import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

export interface ParsedBankEntry {
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  documentRef?: string;
}

@Injectable()
export class BankStatementsService {
  constructor(private readonly prisma: PrismaService) {}

  async importEntries(companyId: string, entries: ParsedBankEntry[]) {
    const created = await this.prisma.bankStatement.createMany({
      data: entries.map((e) => ({
        companyId,
        date: e.date,
        description: e.description,
        amount: e.amount,
        type: e.type,
        documentRef: e.documentRef,
      })),
      skipDuplicates: true,
    });
    return created;
  }

  async findByCompanyAndPeriod(companyId: string, start: Date, end: Date) {
    return this.prisma.bankStatement.findMany({
      where: {
        companyId,
        date: { gte: start, lte: end },
      },
      orderBy: { date: 'asc' },
    });
  }
}

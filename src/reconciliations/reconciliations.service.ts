import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItemStatus, ReconciliationStatus } from '@prisma/client';

@Injectable()
export class ReconciliationsService {
  constructor(private readonly prisma: PrismaService) {}

  async run(companyId: string, periodStart: Date, periodEnd: Date) {
    const reconciliation = await this.prisma.reconciliation.create({
      data: {
        companyId,
        periodStart,
        periodEnd,
        status: ReconciliationStatus.IN_PROGRESS,
      },
    });

    const [bankEntries, accountingEntries] = await Promise.all([
      this.prisma.bankStatement.findMany({
        where: { companyId, date: { gte: periodStart, lte: periodEnd } },
      }),
      this.prisma.accountingEntry.findMany({
        where: { companyId, date: { gte: periodStart, lte: periodEnd } },
      }),
    ]);

    const items: {
      reconciliationId: string;
      bankStatementId?: string;
      accountingEntryId?: string;
      status: ItemStatus;
      difference?: number;
    }[] = [];

    const usedAccountingIds = new Set<string>();

    for (const bank of bankEntries) {
      const match = accountingEntries.find(
        (acc) =>
          !usedAccountingIds.has(acc.id) &&
          acc.type === bank.type &&
          Math.abs(Number(acc.amount) - Number(bank.amount)) < 0.01 &&
          Math.abs(new Date(acc.date).getTime() - new Date(bank.date).getTime()) <=
            3 * 24 * 60 * 60 * 1000,
      );

      if (match) {
        usedAccountingIds.add(match.id);
        items.push({
          reconciliationId: reconciliation.id,
          bankStatementId: bank.id,
          accountingEntryId: match.id,
          status: ItemStatus.MATCHED,
        });
      } else {
        items.push({
          reconciliationId: reconciliation.id,
          bankStatementId: bank.id,
          status: ItemStatus.PENDING_ACCOUNTING,
        });
      }
    }

    for (const acc of accountingEntries) {
      if (!usedAccountingIds.has(acc.id)) {
        items.push({
          reconciliationId: reconciliation.id,
          accountingEntryId: acc.id,
          status: ItemStatus.PENDING_BANK,
        });
      }
    }

    await this.prisma.reconciliationItem.createMany({ data: items });

    await this.prisma.reconciliation.update({
      where: { id: reconciliation.id },
      data: { status: ReconciliationStatus.COMPLETED },
    });

    return this.findById(reconciliation.id);
  }

  async findById(id: string) {
    return this.prisma.reconciliation.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            bankStatement: true,
            accountingEntry: true,
          },
        },
      },
    });
  }

  async findByCompany(companyId: string) {
    return this.prisma.reconciliation.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { items: true } } },
    });
  }
}

import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AccountingEntriesService, ParsedAccountingEntry } from './accounting-entries.service';

class ImportAccountingEntriesDto {
  companyId: string;
  entries: ParsedAccountingEntry[];
}

@Controller('accounting-entries')
export class AccountingEntriesController {
  constructor(private readonly service: AccountingEntriesService) {}

  @Post('import')
  async import(@Body() dto: ImportAccountingEntriesDto) {
    return this.service.importEntries(dto.companyId, dto.entries);
  }

  @Get()
  async findByPeriod(
    @Query('companyId') companyId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.service.findByCompanyAndPeriod(
      companyId,
      new Date(start),
      new Date(end),
    );
  }
}

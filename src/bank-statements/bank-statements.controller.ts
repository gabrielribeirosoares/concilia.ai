import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { BankStatementsService, ParsedBankEntry } from './bank-statements.service';

class ImportBankStatementsDto {
  companyId!: string;
  entries!: ParsedBankEntry[];
}

@Controller('bank-statements')
export class BankStatementsController {
  constructor(private readonly service: BankStatementsService) {}

  @Post('import')
  async import(@Body() dto: ImportBankStatementsDto) {
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

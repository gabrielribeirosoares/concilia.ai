import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ReconciliationsService } from './reconciliations.service';

class RunReconciliationDto {
  companyId: string;
  periodStart: string;
  periodEnd: string;
}

@Controller('reconciliations')
export class ReconciliationsController {
  constructor(private readonly service: ReconciliationsService) {}

  @Post('run')
  async run(@Body() dto: RunReconciliationDto) {
    return this.service.run(
      dto.companyId,
      new Date(dto.periodStart),
      new Date(dto.periodEnd),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get()
  async findByCompany(@Query('companyId') companyId: string) {
    return this.service.findByCompany(companyId);
  }
}

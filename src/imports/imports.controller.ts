import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('imports')
export class ImportsController {
  @Post('statement')
  @UseInterceptors(FileInterceptor('file'))
  async importStatement(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'OFX importado com sucesso',
      fileName: file?.originalname ?? null,
    };
  }
}
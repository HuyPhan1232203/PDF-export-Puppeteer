import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import express from 'express';
import { DocxService } from './docx.service';
import { HtmlToDocxDto } from './dto/html-to-docx.dto';

@Controller('docx')
export class DocxController {
  constructor(private readonly docxService: DocxService) {}

  @Post('convert')
  async convertHtmlToDocx(
    @Body() dto: HtmlToDocxDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<StreamableFile | undefined> {
    try {
      const docxBuffer = await this.docxService.convertHtmlToDocx(dto);

      const fileName = dto.fileName || `document-${Date.now()}.docx`;

      // Set response headers
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': docxBuffer.length,
      });

      return new StreamableFile(docxBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
      });
    }
  }
}

import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import express from 'express';
import { PdfService } from './pdf.service';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { IsOptional, IsString, IsIn, IsUrl } from 'class-validator';

class GeneratePdfFromUrlDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  @IsIn(['A4', 'A3', 'Letter'])
  format?: string;

  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  @IsIn(['landscape', 'portrait'])
  orientation?: string;
}

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async generatePdf(
    @Body() generatePdfDto: GeneratePdfDto,
    @Res() res: express.Response,
  ): Promise<void> {
    try {
      const pdfBuffer = await this.pdfService.generatePdf(generatePdfDto);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${generatePdfDto.filename || 'document.pdf'}"`,
        'Content-Length': pdfBuffer.length.toString(),
      });

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to generate PDF',
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate-from-url')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async generatePdfFromUrl(
    @Body() body: GeneratePdfFromUrlDto,
    @Res() res: express.Response,
  ): Promise<void> {
    try {
      if (!body.url) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'URL is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const pdfBuffer = await this.pdfService.generatePdfFromUrl(
        body.url,
        body.format,
        body.orientation,
      );

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${body.filename || 'document.pdf'}"`,

        'Content-Length': pdfBuffer.length.toString(),
      });

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to generate PDF from URL',
          error: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

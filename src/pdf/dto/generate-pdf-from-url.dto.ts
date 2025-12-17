// src/pdf/dto/generate-pdf-from-url.dto.ts
import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { PageFormat } from './generate-pdf.dto';

export class GeneratePdfFromUrlDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsEnum(PageFormat)
  format?: PageFormat = PageFormat.A4;

  @IsOptional()
  @IsString()
  filename?: string = 'document.pdf';
}

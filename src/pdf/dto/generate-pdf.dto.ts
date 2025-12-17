// src/pdf/dto/generate-pdf.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export enum PageFormat {
  A4 = 'A4',
  A3 = 'A3',
  LETTER = 'Letter',
}

interface Margins {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export class GeneratePdfDto {
  @IsString()
  @IsNotEmpty()
  html: string;

  @IsOptional()
  @IsEnum(PageFormat)
  format?: PageFormat = PageFormat.A4;

  @IsOptional()
  @IsString()
  filename?: string = 'document.pdf';

  @IsOptional()
  @IsObject()
  margins?: Margins;
}

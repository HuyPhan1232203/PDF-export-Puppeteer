// src/docx/dto/html-to-docx.dto.ts
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class HtmlToDocxDto {
  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsNumber()
  topMargin?: number;

  @IsOptional()
  @IsNumber()
  bottomMargin?: number;

  @IsOptional()
  @IsNumber()
  leftMargin?: number;

  @IsOptional()
  @IsNumber()
  rightMargin?: number;

  @IsOptional()
  @IsEnum(['portrait', 'landscape'])
  orientation?: 'portrait' | 'landscape';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  creator?: string;
}

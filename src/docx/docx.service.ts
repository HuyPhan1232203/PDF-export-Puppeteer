// src/docx/docx.service.ts
import { Injectable } from '@nestjs/common';
import HtmlToDocx from '@turbodocx/html-to-docx';
import { HtmlToDocxDto } from './dto/html-to-docx.dto';

@Injectable()
export class DocxService {
  private mmToTwip(mm: number): number {
    return Math.round(mm * 56.6929133858);
  }

  // ✅ Hàm thêm border styles vào table
  private addTableStyles(html: string): string {
    // Thêm inline styles cho table, tr, th, td
    const styledHtml = html
      .replace(
        /<table/g,
        '<table style="border-collapse: collapse; width: 100%; border: 1px solid black;"',
      )
      .replace(
        /<th/g,
        '<th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;"',
      )
      .replace(/<td/g, '<td style="border: 1px solid black; padding: 8px;"');

    return styledHtml;
  }

  async convertHtmlToDocx(dto: HtmlToDocxDto): Promise<Buffer> {
    const {
      html,
      topMargin = 25.4,
      bottomMargin = 25.4,
      leftMargin = 25.4,
      rightMargin = 25.4,
      orientation = 'portrait',
      title = 'Document',
      creator = 'NestJS API',
    } = dto;

    try {
      // ✅ Thêm border styles vào HTML
      const styledHtml = this.addTableStyles(html);

      const docxOptions = {
        orientation,
        margins: {
          top: this.mmToTwip(topMargin),
          bottom: this.mmToTwip(bottomMargin),
          left: this.mmToTwip(leftMargin),
          right: this.mmToTwip(rightMargin),
        },
        title,
        creator,
        font: 'Times New Roman',
        fontSize: 24,
        table: {
          row: {
            cantSplit: true,
          },
        },
        // ✅ Thêm table border options
        tableBorderOptions: {
          top: { style: 'single', size: 4, color: '000000' },
          bottom: { style: 'single', size: 4, color: '000000' },
          left: { style: 'single', size: 4, color: '000000' },
          right: { style: 'single', size: 4, color: '000000' },
          insideH: { style: 'single', size: 4, color: '000000' },
          insideV: { style: 'single', size: 4, color: '000000' },
        },
        pageNumber: true,
        footer: true,
      };

      const docxBuffer = await HtmlToDocx(styledHtml, null, docxOptions);

      // Handle the union return type from HtmlToDocx
      if (docxBuffer instanceof Buffer) {
        return docxBuffer;
      } else if (docxBuffer instanceof ArrayBuffer) {
        return Buffer.from(docxBuffer);
      } else {
        // Fallback for Blob or other types (unlikely in Node.js)
        throw new Error('Unsupported buffer type returned from HtmlToDocx');
      }
    } catch (error) {
      throw new Error(
        `Error converting HTML to DOCX: ${(error as Error).message}`,
      );
    }
  }
}

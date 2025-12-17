// src/pdf/pdf.service.ts
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PdfService.name);
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  private browser: Browser | null = null;

  async onModuleInit(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.logger.log('Puppeteer browser initialized successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error('Failed to initialize Puppeteer browser', errorStack);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.logger.log('Puppeteer browser closed');
    }
  }

  async generatePdf(generatePdfDto: GeneratePdfDto): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser is not initialized');
    }

    const { html, format, margins } = generatePdfDto;
    let page: Page | null = null;

    try {
      page = await this.browser.newPage();

      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: format as 'A4' | 'A3' | 'Letter',
        printBackground: true,
        margin: {
          top: margins?.top || '20px',
          right: margins?.right || '20px',
          bottom: margins?.bottom || '20px',
          left: margins?.left || '20px',
        },
      });

      this.logger.log('PDF generated successfully');
      return Buffer.from(pdfBuffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Error generating PDF: ${errorMessage}`, errorStack);
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async generatePdfFromUrl(
    url: string,
    format: string = 'A4',
  ): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser is not initialized');
    }

    let page: Page | null = null;

    try {
      page = await this.browser.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle0',
      });

      const pdfBuffer = await page.pdf({
        format: format as 'A4' | 'A3' | 'Letter',
        printBackground: true,
      });

      this.logger.log(`PDF generated successfully from URL: ${url}`);
      return Buffer.from(pdfBuffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Error generating PDF from URL: ${errorMessage}`,
        errorStack,
      );
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
}

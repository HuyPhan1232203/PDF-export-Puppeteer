import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocxModule } from './docx/docx.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [DocxModule, PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

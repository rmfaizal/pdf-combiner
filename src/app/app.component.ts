import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfMergeService } from './pdf-merge.service';
import { PdfIndexService } from './pdf-index.service';
import { PdfCombineService } from './pdf-combine.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedFiles: File[] = [];

  constructor(
    private pdfMergeService: PdfMergeService,
    private pdfIndexService: PdfIndexService,
    private pdfCombineService: PdfCombineService
  ) {}

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  async stitchFiles() {
    //const { pdfBytes, indexData } = await this.pdfMergeService.mergeFiles(this.selectedFiles);
    const { imageList, indexData } = await this.pdfMergeService.mergeFilesInToImageList(this.selectedFiles);
   // const indexPdf = await this.pdfIndexService.generateIndexPdf(indexData);

   const indexPdf = await this.pdfIndexService.generatePDFWithIndex1(imageList,indexData);

    //const finalPdf = await this.pdfCombineService.combineIndexAndContent(indexPdf, pdfBytes);

    //const blob = new Blob([finalPdf], { type: 'application/pdf' });
    const blob = new Blob([indexPdf], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'combined.pdf';
    link.click();
    //await this.pdfIndexService.generatePdf();

  }
}

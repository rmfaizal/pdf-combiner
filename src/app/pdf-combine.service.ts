import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})
export class PdfCombineService {
  async combineIndexAndContent(indexPdfBytes: Uint8Array, contentPdfBytes: Uint8Array): Promise<Uint8Array> {
    const finalPdf = await PDFDocument.create();

    const indexPdf = await PDFDocument.load(indexPdfBytes);
    const contentPdf = await PDFDocument.load(contentPdfBytes);

    const indexPages = await finalPdf.copyPages(indexPdf, indexPdf.getPageIndices());
    indexPages.forEach((page) => finalPdf.addPage(page));

    const contentPages = await finalPdf.copyPages(contentPdf, contentPdf.getPageIndices());
    contentPages.forEach((page) => finalPdf.addPage(page));

    return await finalPdf.save();
  }
}
 
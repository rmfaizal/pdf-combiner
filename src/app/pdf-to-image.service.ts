// pdf-to-image.service.ts
import { Injectable } from '@angular/core';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

@Injectable({
  providedIn: 'root',
})
export class PdfToImageService {
  constructor() {
    // Set worker path
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;
  }

  async convertPdfToImages(pdfFile: File): Promise<string[]> {
    const imageList: string[] = [];

    const pdfData = await pdfFile.arrayBuffer();
    const pdf = await getDocument({ data: pdfData }).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Adjust scale for quality
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const imgData = canvas.toDataURL('image/jpeg');
      imageList.push(imgData);
    }

    return imageList;
  }
}

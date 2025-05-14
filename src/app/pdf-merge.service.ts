import { Injectable } from '@angular/core';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root',
})
export class PdfMergeService {
  constructor() {
    // Set worker path
    //GlobalWorkerOptions.workerPort  = new PDFWorker(); //`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;
    //pdfjsLib.GlobalWorkerOptions.workerSrc = `../node_modules/pdfjs-dist/build/legacy/pdf.worker.mjs`;
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs';
  }
  async mergeFiles(files: File[]): Promise<{ pdfBytes: Uint8Array; indexData: any[] }> {
    const mergedPdf = await PDFDocument.create();
    const indexData: { fileName: string; pageNumber: number }[] = [];

    for (const [i, file] of files.entries()) {
      const fileName = file.name;
      const startPage = mergedPdf.getPageCount() + 1;

      if (file.type === 'application/pdf') {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        indexData.push({ fileName, pageNumber: startPage });
      } else if (file.type.startsWith('image/')) {
        const imgBytes = await file.arrayBuffer();
        let img;
        if (file.type === 'image/jpeg') {
          img = await mergedPdf.embedJpg(imgBytes);
        } else if (file.type === 'image/png') {
          img = await mergedPdf.embedPng(imgBytes);
        } else {
          continue;
        }

        const page = mergedPdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        indexData.push({ fileName, pageNumber: startPage });
      }
    }

    const pdfBytes = await mergedPdf.save();
    return { pdfBytes, indexData };
  }
  async mergeFilesInToImageList(files: File[]): Promise<{ imageList: string[]; indexData: any[] }> {
    const mergedPdf = await PDFDocument.create();
    const indexData: { fileName: string; pageNumber: number }[] = [];

    for (const [i, file] of files.entries()) {
      const fileName = file.name;
      const startPage = mergedPdf.getPageCount() + 1;

      if (file.type === 'application/pdf') {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        indexData.push({ fileName, pageNumber: startPage });
      } else if (file.type.startsWith('image/')) {
        const imgBytes = await file.arrayBuffer();
        let img;
        if (file.type === 'image/jpeg') {
          img = await mergedPdf.embedJpg(imgBytes);
        } else if (file.type === 'image/png') {
          img = await mergedPdf.embedPng(imgBytes);
        } else {
          continue;
        }

        const page = mergedPdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        indexData.push({ fileName, pageNumber: startPage });
      }
    }

    const pdfBytes = await mergedPdf.save();

    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const imageList: string[] = [];
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
    
    return { imageList, indexData };
  }

}

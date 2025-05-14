import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);


@Injectable({
  providedIn: 'root',
})
export class PdfIndexService {
  async generateIndexPdf(indexData: { fileName: string; pageNumber: number }[]): Promise<Uint8Array> {
    const content = [
      { text: 'Index', style: 'header' },
      ...indexData.map(entry => ({
        text: `${entry.fileName} - Page ${entry.pageNumber}`,
        style: 'item',
      })),
    ];

    const docDefinition = {
      content,
      styles: {
        header: { fontSize: 18, bold: true, marginBottom: 10 },
        item: { fontSize: 12, marginBottom: 5 },
      },
    };

    return new Promise<Uint8Array>((resolve) => {
      pdfMake.createPdf(docDefinition).getBuffer((buffer: ArrayBuffer) => {
        resolve(new Uint8Array(buffer));
      });
    });
  }

  async generatePDFWithIndex(imageList: string[], indexData: {fileName: string; pageNumber: number }[]): Promise<Uint8Array> {
    const content = [
      { text: 'Index', style: 'header' },
      ...indexData.map(entry => ({
        text: `${entry.fileName} - Page ${entry.pageNumber}`,
        style: 'item',
      })),
    ];

    const imgContent = imageList.map((img) => ({
      image: img,
      width: 500, // Adjust as needed
      margin: [0, 10, 0, 10],
    }));

    content.push(...imgContent as any);

    const docDefinition = {
      content,
      styles: {
        header: { fontSize: 18, bold: true, marginBottom: 10 },
        item: { fontSize: 12, marginBottom: 5 },
      },
    };

    return new Promise<Uint8Array>((resolve) => {
      pdfMake.createPdf(docDefinition).getBuffer((buffer: ArrayBuffer) => {
        resolve(new Uint8Array(buffer));
      });
    });
  }
  async generatePDFWithIndex1(imageList: string[], indexData: {fileName: string; pageNumber: number }[]): Promise<Uint8Array> {
    const content = 
      [

        { text: 'Document Index', style: 'header' },
        {
          ul: indexData.map(entry => ({
            text: entry.fileName, // Use displayName if available
            linkToDestination: 'page=15',//'image'+entry.pageNumber,     // ID to link to
            linkToPage:entry.pageNumber+1,
            style: 'link'
          }))
        },
        { text: '', pageBreak: 'after' },
      ];

      const imgContent = imageList.map((img, index) => ({
        image: img,
        width: 500, // Adjust as needed
        margin: [0, 10, 0, 10],
        id: `image${index + 1}` // Creates IDs like image1, image2, etc.
      }));

    content.push(...imgContent as any);

    const docDefinition = {
      content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        link: {
          color: 'blue',
          decoration: 'underline',
          margin: [0, 2]
        }
       },
    };

    return new Promise<Uint8Array>((resolve) => {
      pdfMake.createPdf(docDefinition).getBuffer((buffer: ArrayBuffer) => {
        resolve(new Uint8Array(buffer));
      });
    });
  }
  generatePdf() {
    const docDefinition: any = {
      content: [
        { text: 'Document Index', style: 'header' },
        {
          ul: [
            { text: 'Section 1', linkToDestination: 'section1', style: 'link' },
            { text: 'Section 2', linkToDestination: 'section2', style: 'link' },
            { text: 'Section 3', linkToDestination: 'section3', style: 'link' }
          ]
        },
        { text: '', pageBreak: 'after' },
  
        // Section 1
        {
          text: 'Section 1',
          style: 'sectionHeader',
          id: 'section1',
          bookmark: 'Section 1'
        },
        { text: 'Content of Section 1 goes here.', margin: [0, 10] },
        { text: '', pageBreak: 'after' },
  
        // Section 2
        {
          text: 'Section 2',
          style: 'sectionHeader',
          id: 'section2',
          bookmark: 'Section 2'
        },
        { text: 'Content of Section 2 goes here.', margin: [0, 10] },
        { text: '', pageBreak: 'after' },
  
        // Section 3
        {
          text: 'Section 3',
          style: 'sectionHeader',
          id: 'section3',
          bookmark: 'Section 3'
        },
        { text: 'Content of Section 3 goes here.', margin: [0, 10] }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        link: {
          color: 'blue',
          decoration: 'underline',
          margin: [0, 2]
        }
      }
    };
  
    pdfMake.createPdf(docDefinition).open();
  }
  
}

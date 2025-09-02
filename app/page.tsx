// app/page.tsx
'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import PdfButton from './components/PdfButton';
import DownloadMerged from './components/DownloadMerged';
import PdfCard from './components/PdfCard';
import DropArea from './components/DropArea';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  const handleSelect = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.multiple = true;

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const newFiles = Array.from(target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    };

    input.click();
  };

  const handleRemove = (file: File): void => {
    setFiles(files.filter((f) => f !== file));
  };

  const handleMerge = async (): Promise<void> => {
    if (files.length === 0) return;

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setMergedPdfUrl(url);
  };

  const handleDownload = (): void => {
    if (!mergedPdfUrl) return;
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'merged.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">PDF Merger</h1>

        {!mergedPdfUrl ? (
          <>
            <p className="text-center text-gray-600 mb-4">Add PDF files</p>
            <DropArea onSelect={handleSelect} />

            <div className="mt-4 flex flex-col gap-3">
              {files.map((file, idx) => (
                <PdfCard
                  key={idx}
                  fileName={file.name}
                  onRemove={() => handleRemove(file)}
                />
              ))}
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <PdfButton label="Merge" onClick={handleMerge} />
              </div>
            )}
          </>
        ) : (
          <DownloadMerged onDownload={handleDownload} />
        )}
      </div>
    </div>
  );
}

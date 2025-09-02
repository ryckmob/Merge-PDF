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
  const [error, setError] = useState<string | null>(null);

  // Função para processar a imagem (escaneado leve + contraste)
  const processImage = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Erro ao processar imagem');

        ctx.drawImage(img, 0, 0);

        // Aplicar efeito de escaneado + contraste leve
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const contrast = 1.1; // contraste leve
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const c = factor * (avg - 128) + 128;
          data[i] = data[i + 1] = data[i + 2] = Math.min(255, Math.max(0, c));
        }
        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return reject('Erro ao converter imagem');
          blob.arrayBuffer().then(resolve);
        }, file.type);
      };
      img.onerror = () => reject('Erro ao carregar imagem');
    });
  };

  const handleSelect = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,image/*';
    input.multiple = true;

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const newFiles = Array.from(target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setError(null);
    };

    input.click();
  };

  const handleRemove = (file: File): void => {
    setFiles(files.filter((f) => f !== file));
  };

  const handleMerge = async (): Promise<void> => {
    if (files.length < 1) {
      setError('Selecione pelo menos 1 arquivo');
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();

        if (file.type === 'application/pdf') {
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.type.startsWith('image/')) {
          const processedBuffer = await processImage(file);
          const img = file.type === 'image/png'
            ? await mergedPdf.embedPng(processedBuffer)
            : await mergedPdf.embedJpg(processedBuffer);

          const page = mergedPdf.addPage([img.width, img.height]);
          page.drawImage(img, {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
          });
        }
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao tentar juntar os arquivos');
    }
  };

  const handleDownload = (): void => {
    if (!mergedPdfUrl) {
      setError('Nenhum PDF foi gerado para download');
      return;
    }
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = 'merged.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">PDF Merger</h1>

        {error && (
          <div className="mb-4 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 text-sm rounded-md p-2">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
          </div>
        )}

        {!mergedPdfUrl ? (
          <>
            <p className="text-center text-gray-600 mb-4">Add PDF files or Images</p>
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

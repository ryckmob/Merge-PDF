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
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');

  // Função para aplicar efeito de scanner leve
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
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        // Apenas clarear levemente: aumentar luminosidade 10%
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.1);     // R
          data[i+1] = Math.min(255, data[i+1] * 1.1); // G
          data[i+2] = Math.min(255, data[i+2] * 1.1); // B
        }
  
        ctx.putImageData(imageData, 0, 0);
  
        canvas.toBlob((blob) => {
          if (!blob) return reject('Erro ao converter imagem');
          blob.arrayBuffer().then(resolve);
        }, 'image/jpeg'); // sempre converte para jpg
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

  const generateFileName = (): string => {
    const now = new Date();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `merged_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_` +
      `${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}${now.getMilliseconds()}_${randomDigits}.pdf`;
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
          const img = await mergedPdf.embedJpg(processedBuffer);
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

      const name = generateFileName();

      setMergedPdfUrl(url);
      setFileName(name);
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
    link.download = fileName;
    link.click();

    // após baixar, mostrar modal de compartilhar
    setShowModal(true);
  };

  const handleShare = async (): Promise<void> => {
    if (!mergedPdfUrl) return;

    try {
      const response = await fetch(mergedPdfUrl);
      const blob = await response.blob();
      const filesArray = [new File([blob], fileName, { type: 'application/pdf' })];

      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator.share({
          files: filesArray,
          title: 'PDF Compartilhado',
          text: 'Segue o PDF gerado',
        });
      } else {
        alert('Compartilhamento não suportado neste dispositivo');
      }
    } catch (err) {
      console.error(err);
    }
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
          <>
            <DownloadMerged onDownload={handleDownload} />

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-xl w-80 text-center">
                  <h2 className="text-lg font-bold mb-4">PDF pronto!</h2>
                  <p className="mb-4">Seu PDF foi baixado com sucesso! Clique abaixo para compartilhar:</p>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                    onClick={handleShare}
                  >
                    Compartilhar PDF
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-md"
                    onClick={() => setShowModal(false)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

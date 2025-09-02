// components/PdfCard.tsx
import { X } from 'lucide-react';

interface PdfCardProps {
  fileName: string;
  onRemove: () => void;
}

export default function PdfCard({ fileName, onRemove }: PdfCardProps) {
  return (
    <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-md font-bold">
          PDF
        </div>
        <span className="font-medium text-gray-700">{fileName}</span>
      </div>
      <button onClick={onRemove} className="text-gray-500 hover:text-red-600">
        <X size={20} />
      </button>
    </div>
  );
}

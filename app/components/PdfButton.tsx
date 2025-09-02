// components/PdfButton.tsx
import { ButtonHTMLAttributes } from 'react';

interface PdfButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function PdfButton({ label, ...props }: PdfButtonProps) {
  return (
    <button
      {...props}
      className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-red-600 transition"
    >
      {label}
    </button>
  );
}

// components/DropArea.tsx
interface DropAreaProps {
  onSelect: () => void;
}

export default function DropArea({ onSelect }: DropAreaProps) {
  return (
    <div
      onClick={onSelect}
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-10 cursor-pointer hover:border-red-400 transition"
    >
      <div className="bg-red-500 text-white w-14 h-14 flex items-center justify-center rounded-md font-bold mb-3">
        PDF
      </div>
      <p className="text-gray-600 font-medium">Selecione os arquivos</p>
    </div>
  );
}

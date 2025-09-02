// components/DownloadMerged.tsx
import PdfButton from './PdfButton';

interface DownloadMergedProps {
  onDownload: () => void;
}

export default function DownloadMerged({ onDownload }: DownloadMergedProps) {
  return (
    <div className="mt-8">
      <PdfButton label="Download Merged PDF" onClick={onDownload} />
    </div>
  );
}

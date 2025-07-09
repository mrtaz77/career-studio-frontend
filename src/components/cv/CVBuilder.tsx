import { useState } from 'react';
import { CVForm } from './CVForm';
import { CVPreview } from './CVPreview';
import { TopNavigation } from './TopNavigation';
import { CVData, defaultCVData } from '@/types/cv';

interface CVBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVBuilder = ({ isOpen, onClose }: CVBuilderProps) => {
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataChange = (newData: Partial<CVData['save_content']>) => {
    setCvData((prev) => ({
      ...prev,
      save_content: { ...prev.save_content, ...newData },
    }));
  };

  const handleTitleChange = (title: string) => {
    handleDataChange({ title });
  };

  const handleRecompile = () => {
    setIsLoading(true);
    // Simulate recompilation
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDownload = () => {
    // This would integrate with a PDF library in a real app
    console.log('Downloading CV as PDF...');
    alert('PDF download functionality would be implemented here');
  };

  const handleShare = () => {
    console.log('Opening share modal...');
    alert('Share functionality would be implemented here');
  };

  const handleVersions = () => {
    console.log('Opening versions panel...');
    alert('Version management would be implemented here');
  };

  const handleLayouts = () => {
    console.log('Opening layout selector...');
    alert('Layout templates would be available here');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">CV Builder</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        {/* Top Navigation */}
        <TopNavigation
          title={cvData.save_content.title}
          onTitleChange={handleTitleChange}
          onRecompile={handleRecompile}
          onDownload={handleDownload}
          onShare={handleShare}
          onVersions={handleVersions}
          onLayouts={handleLayouts}
          isLoading={isLoading}
        />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Form */}
          <div className="w-1/2 bg-white/80 backdrop-blur-sm border-r-2 border-blue-200 shadow-xl overflow-y-auto">
            <div className="h-full">
              <CVForm data={cvData.save_content} onChange={handleDataChange} />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 bg-gray-50/90 backdrop-blur-sm shadow-inner overflow-y-auto">
            <div className="h-full">
              <CVPreview data={cvData.save_content} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

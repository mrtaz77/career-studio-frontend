import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { RefreshCw, Download, Share, History, Layout, ChevronDown, Plus, Save } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface TopNavigationProps {
  title: string;
  onTitleChange: (title: string) => void;
  onShare: () => void;
  onTemplateChange: (templateId: number) => void;
  currentTemplate: number;
  isLoading: boolean;
}

export const TopNavigation = ({
  title,
  onTitleChange,
  onShare,
  onTemplateChange,
  currentTemplate,
  isLoading,
}: TopNavigationProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTempTitle(title);
  };

  const handleTitleSave = () => {
    onTitleChange(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(title);
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const dummyVersions = [
    { id: 1, name: 'Current Version', date: '2024-01-08 14:30', current: true },
    { id: 2, name: 'Tech Manager Role', date: '2024-01-07 09:15', current: false },
    { id: 3, name: 'Senior Developer', date: '2024-01-05 16:45', current: false },
  ];

  const dummyLayouts = [
    { id: 1, name: 'Modern Professional', current: true },
    { id: 2, name: 'Classic Traditional', current: false },
    { id: 3, name: 'Creative Designer', current: false },
    { id: 4, name: 'Minimal Clean', current: false },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg px-6 py-1">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleKeyPress}
              className="text-2xl font-bold text-white bg-transparent border-white/30 placeholder-white/70 focus:ring-2 focus:ring-white/50 rounded-lg min-w-[200px] w-auto"
              style={{ width: `${Math.max(200, tempTitle.length * 16)}px` }}
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl font-bold text-white cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200"
              onClick={handleTitleClick}
            >
              {title}
            </h1>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-200"
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>

            {/* Template Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-200"
                >
                  <Layout className="h-4 w-4" />
                  <span>Template</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white shadow-lg border-gray-200">
                <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 border-b">
                  CV Templates
                </div>
                <DropdownMenuItem
                  onClick={() => onTemplateChange(1)}
                  className={currentTemplate === 1 ? 'bg-blue-50' : ''}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Basic</span>
                    {currentTemplate === 1 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onTemplateChange(2)}
                  className={currentTemplate === 2 ? 'bg-purple-50' : ''}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Classic</span>
                    {currentTemplate === 2 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </>
  );
};

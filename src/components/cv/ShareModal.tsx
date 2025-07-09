import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Mail, Twitter, Facebook, Linkedin } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal = ({ isOpen, onClose }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://cv-builder.app/shared/abc123-def456-ghi789';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = 'Check out my professional CV!';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=${encodedText}%20${encodedUrl}`,
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700">Share Your CV</DialogTitle>
          <DialogDescription>
            Share your professional CV with others using the link below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input readOnly value={shareUrl} className="flex-1 bg-gray-50 border-blue-200" />
            <Button onClick={copyToClipboard} size="sm" className="bg-blue-600 hover:bg-blue-700">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Or share via</p>
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocial('twitter')}
                className="hover:bg-blue-50 border-blue-200"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocial('facebook')}
                className="hover:bg-blue-50 border-blue-200"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocial('linkedin')}
                className="hover:bg-blue-50 border-blue-200"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocial('email')}
                className="hover:bg-blue-50 border-blue-200"
              >
                <Mail className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

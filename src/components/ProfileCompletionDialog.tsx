import React from 'react';
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
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';
import { useEffect } from 'react';

interface ProfileCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ProfileCompletionDialog = ({
  open,
  onClose,
  currentUser,
}: ProfileCompletionDialogProps) => {
  //console.log("ProfileCompletionDialog rendered with currentUser:", currentUser);
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [_uploadRetries, _setUploadRetries] = useState(0);
  const MAX_UPLOAD_RETRIES = 2;

  // Debug logging
  useEffect(() => {
    // console.log('ProfileCompletionDialog - uploadingImage:', uploadingImage);
    // console.log('ProfileCompletionDialog - selectedFile:', selectedFile?.name);
    // console.log('ProfileCompletionDialog - imagePreview length:', imagePreview?.length);
  }, [uploadingImage, selectedFile, imagePreview]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;

      try {
        const idToken = await currentUser?.getIdToken();
        // console.log('Fetching user profile with ID token:', idToken);
        const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
          setFormData({
            username: profileData?.username || '',
            full_name: profileData?.full_name || '',
            address: profileData?.address || '',
            contactNumber: profileData?.phone || '',
            jobTitle: profileData?.jobTitle || '',
            company: profileData?.company || '',
            imgUrl: profileData?.img || '',
          });
          // Set initial image preview if user already has a profile picture
          if (profileData?.img) {
            setImagePreview(profileData.img);
          }
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        // console.error('Error fetching user profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile information.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // console.log("Fetched profile:", profile);
  //console.log("name:", profile?.full_name);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    address: profile?.address || '',
    contactNumber: profile?.phone || '',
    jobTitle: profile?.jobTitle || '',
    company: profile?.company || '',
    imgUrl: profile?.img || '',
  });
  //console.log("formData:", formData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Unused duplicate

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset any previous errors
    _setUploadRetries(0);

    // Validate file type - be more specific about allowed types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPG, PNG, GIF, or WebP image.',
        variant: 'destructive',
      });
      // Reset file input
      e.target.value = '';
      return;
    }

    // Validate file size (1MB max for better performance)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 1MB.',
        variant: 'destructive',
      });
      // Reset file input
      e.target.value = '';
      return;
    }

    setSelectedFile(file);

    // Create preview with error handling
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as string;
        setImagePreview(result);

        toast({
          title: 'Image selected',
          description: `${file.name} ready for upload.`,
          variant: 'default',
        });
      } catch (_error) {
        // console.error('Error creating image preview:', _error);
        toast({
          title: 'Preview failed',
          description: 'Could not create image preview, but upload will still work.',
          variant: 'destructive',
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: 'File read error',
        description: 'Could not read the selected file. Please try another image.',
        variant: 'destructive',
      });
      setSelectedFile(null);
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const uploadImageToBackend = async (retryCount = 0): Promise<string | null> => {
    if (!selectedFile || !currentUser) return null;

    setUploadingImage(true);
    try {
      // Get authentication token
      const token = await currentUser.getIdToken(true);
      if (!token) {
        throw new Error('Authentication failed');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userId', currentUser.uid);
      formData.append('folder', 'profile-pictures');

      // console.log('Uploading image to backend...', {
      //   fileName: selectedFile.name,
      //   fileSize: selectedFile.size,
      //   fileType: selectedFile.type
      // });

      // Send to backend API
      const response = await fetch(`${API_BASE_URL}/api/v1/users/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const imageUrl = result.imageUrl || result.url || result.downloadUrl;

      if (!imageUrl) {
        throw new Error('No image URL returned from server');
      }

      // Reset retry count on success
      _setUploadRetries(0);

      toast({
        title: 'Success!',
        description: 'Profile picture uploaded successfully.',
        variant: 'default',
      });

      return imageUrl;
    } catch (error: unknown) {
      // console.error(`Backend upload error (attempt ${retryCount + 1}):`, error);

      // Retry logic for network/server errors
      if (
        retryCount < MAX_UPLOAD_RETRIES &&
        error instanceof Error &&
        (error.name === 'NetworkError' ||
          error.message?.includes('network') ||
          error.message?.includes('timeout') ||
          error.message?.includes('500') ||
          error.message?.includes('502') ||
          error.message?.includes('503'))
      ) {
        _setUploadRetries(retryCount + 1);

        toast({
          title: 'Upload failed',
          description: `Retrying upload... (${retryCount + 1}/${MAX_UPLOAD_RETRIES})`,
          variant: 'default',
        });

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000 * (retryCount + 1)));

        return uploadImageToBackend(retryCount + 1);
      }

      // If backend upload fails, fall back to base64
      // console.log('Backend upload failed, falling back to base64...');

      try {
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        toast({
          title: 'Using fallback method',
          description: 'Image will be stored as base64 data.',
          variant: 'default',
        });

        return base64String;
      } catch (_base64Error) {
        // console.error('Base64 conversion also failed:', _base64Error);

        let errorMessage = 'Failed to upload image. Please try again.';

        if (error instanceof Error) {
          if (error.message?.includes('Authentication failed')) {
            errorMessage = 'Please sign in again and try uploading.';
          } else if (error.message?.includes('413')) {
            errorMessage = 'Image file is too large. Please select a smaller image.';
          } else if (error.message?.includes('415')) {
            errorMessage = 'Unsupported file type. Please select a JPG, PNG, or GIF image.';
          } else if (error.message?.includes('401')) {
            errorMessage = 'Authentication failed. Please sign in again.';
          } else if (error.message?.includes('404')) {
            errorMessage = 'Upload service not available. Please try again later.';
          }
        }

        toast({
          title: 'Upload failed',
          description: errorMessage,
          variant: 'destructive',
        });

        _setUploadRetries(0);
        return null;
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImageToBackend();
        if (!imageUrl) {
          throw new Error('Failed to upload profile picture');
        }
      }

      const token = await currentUser.getIdToken();
      const response = await fetch('/api/v1/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          img: imageUrl || formData.imgUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile information');
      }

      const data = await response.json();
      toast({
        title: 'Profile updated!',
        description: 'Your profile information was saved successfully.',
        variant: 'default',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save profile information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !loading && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your information to complete your profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" role="form">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-3">
            <Label>Profile Picture (Optional)</Label>
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-gray-200">
                <AvatarImage src={imagePreview} alt="Profile preview" />
                <AvatarFallback className="text-xl bg-gray-100">
                  {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <Input
              id="profilePicture"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="max-w-xs"
              disabled={uploadingImage || loading}
            />
            {selectedFile && (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-green-600">✓ Selected: {selectedFile.name}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(formData.imgUrl || '');
                    // Reset file input
                    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  className="text-xs"
                  disabled={uploadingImage || loading}
                >
                  Remove Selected Image
                </Button>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP supported</p>
              <p className="text-xs text-gray-500">Maximum file size: 1MB</p>
              {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading image...</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData?.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData?.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter user name"
              required
            />
          </div>

          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData?.contactNumber}
              onChange={(e) => {
                let value = e.target.value;
                // Auto-add '+' if user starts typing without it
                if (value.length === 1 && value !== '+' && /\d/.test(value)) {
                  value = '+' + value;
                }
                handleInputChange('contactNumber', value);
              }}
              placeholder="Enter phone number (e.g., +1234567890)"
              pattern="^\+[1-9]\d{1,14}$"
              title="Phone number must start with + followed by country code and number"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your address"
              required
            />
          </div>
          <div>
            <Label htmlFor="jobTitle">Current Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="Enter your current job title"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Current Company</Label>
            <Input
              id="company"
              placeholder="Enter your current company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              name="save"
              aria-label={loading ? 'Saving changes...' : 'Save Changes'}
              data-state={loading ? 'loading' : 'idle'}
              className={`${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
